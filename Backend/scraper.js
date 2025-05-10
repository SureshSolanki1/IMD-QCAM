const puppeteer = require("puppeteer");
const { MongoClient } = require("mongodb");

(async () => {
  try {
    const client = await MongoClient.connect("mongodb://localhost:27017/", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db("authDB");
    const collection = db.collection("aws_data");
    const stationsCollection = db.collection("stations");

    console.log("Connected to MongoDB");

    const today = new Date();
    const todayFormatted = today.toISOString().split("T")[0];

    // --------- NEW LOGIC TO CHECK DATE AND DELETE OLD DATA ----------
    const todayDataExists = await collection.findOne({ date: todayFormatted });

    if (!todayDataExists) {
      const deleteResult = await collection.deleteMany({});
      console.log(`No today's data found. Deleted ${deleteResult.deletedCount} old records from 'aws_data'.`);
    } else {
      console.log("Today's data already exists. Proceeding to scrape and update...");
    }
    // -----------------------------------------------------------------

    const lastRecord = await collection.find({ date: todayFormatted }).sort({ serial_no: -1 }).limit(1).toArray();
    const lastSerial = lastRecord.length ? lastRecord[0].serial_no : 0;

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      timeout: 60000,
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);

    const url = `http://aws.imd.gov.in:8091/AWS/tabulardataview.php?a=AWS&b=MAHARASHTRA&c=PUNE&d=ALL_STATION&e=${todayFormatted}&f=${todayFormatted}&g=ALL_HOUR&h=ALL_MINUTE`;
    console.log("Navigating to the URL:", url);

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    await page.waitForSelector("table");

    const lengthDropdown = await page.$('select[name="example_length"]');
    if (lengthDropdown) {
      await page.select('select[name="example_length"]', '100');
      await page.waitForTimeout(2000);
    }

    const allData = [];
    let hasNextPage = true;
    let currentPage = 1;

    while (hasNextPage) {
      console.log(`Scraping page ${currentPage}...`);
      await page.waitForSelector("table tbody tr");

      const pageData = await page.evaluate(() => {
        const rows = document.querySelectorAll("table tbody tr");
        const data = [];

        rows.forEach((row) => {
          const cols = row.querySelectorAll("td");
          if (cols.length > 0) {
            const getValue = (col) => {
              const text = col?.innerText.trim() || "";
              return ["", "///"].includes(text) ? "-" : text;
            };

            const serialNo = parseInt(getValue(cols[0])) || 0;
            const entry = {
              serial_no: serialNo,
              district: getValue(cols[1]),
              station: getValue(cols[2]),
              date: getValue(cols[3]),
              time: getValue(cols[4]),
              rainfall: getValue(cols[5]),
              temp: getValue(cols[6]),
              temp_min: getValue(cols[7]),
              temp_max: getValue(cols[8]),
              rh: getValue(cols[9]),
              rh_min_max: getValue(cols[10]),
              wind_dir: getValue(cols[11]),
              wind_speed: getValue(cols[12]),
              wind_speed_max_gust: getValue(cols[13]),
              slp: getValue(cols[14]),
              mslp: getValue(cols[15]),
              sunshine: getValue(cols[16]),
              battery: getValue(cols[17]),
              gps: getValue(cols[18]),
              timestamp: new Date(),
              scrapeDate: new Date(),
            };

            if (entry.serial_no && entry.station && entry.date && entry.time) {
              data.push(entry);
            }
          }
        });

        return data;
      });

      const filteredData = pageData.filter((d) => d.serial_no > lastSerial);
      allData.push(...filteredData);
      console.log(`Added ${filteredData.length} new records`);

      const nextButton = await page.$('#example_next:not(.disabled)');
      if (nextButton) {
        await nextButton.click();
        await page.waitForTimeout(2000);
        currentPage++;
      } else {
        hasNextPage = false;
      }
    }

    console.log(`Total new records to insert: ${allData.length}`);

    for (const record of allData) {
      await collection.updateOne(
        {
          serial_no: record.serial_no,
          station: record.station,
          date: record.date,
          time: record.time,
        },
        { $set: record },
        { upsert: true }
      );
    }

    const THRESHOLDS = {
      Air_Temperature_Sensor: { min: 10, max: 40.0 },
      Relative_Humidity_Sensor: { min: 5, max: 100 },
      Tipping_Bucket_Rain_Gauge: { min: 0, max: 300 },
      Ultrasonic_Wind_Sensor: { min: 0, max: 32 },
      Pressure_Sensor: { min: 900, max: 1100 },
    };

    console.log("Checking for outliers and updating 'stations'...");

    for (const record of allData) {
      const stationName = record.station;
      const temp = parseFloat(record.temp);
      const rh = parseFloat(record.rh);
      const rainfall = parseFloat(record.rainfall);
      const windSpeed = parseFloat(record.wind_speed?.replace(/[^\d.]/g, ""));
      const slp = parseFloat(record.slp);
      const mslp = parseFloat(record.mslp);

      const sensors = await stationsCollection.find({ name: stationName }).toArray();

      for (const sensor of sensors) {
        const type = sensor.sensorName;
        const limits = THRESHOLDS[type];
        if (!limits) continue;

        let value;
        if (type.includes("Temp")) value = temp;
        else if (type.includes("Humidity")) value = rh;
        else if (type.includes("Rain")) value = rainfall;
        else if (type.includes("Wind")) value = windSpeed;
        else if (type.includes("Pressure")) {
          if (!isNaN(slp)) value = slp;
          else if (!isNaN(mslp)) value = mslp;
        } else continue;

        const raw = {
          temp: record.temp, rh: record.rh, rainfall: record.rainfall,
          windSpeed: record.wind_speed, slp: record.slp, mslp: record.mslp
        };

        const missing =
          type.includes("Temp") && ["-", "///"].includes(raw.temp) ||
          type.includes("Humidity") && ["-", "///"].includes(raw.rh) ||
          type.includes("Rain") && ["-", "///"].includes(raw.rainfall) ||
          type.includes("Wind") && ["-", "///"].includes(raw.windSpeed) ||
          type.includes("Pressure") &&
            (["-", "///"].includes(raw.slp) && ["-", "///"].includes(raw.mslp));

        if (missing || value === undefined || isNaN(value)) {
          await stationsCollection.updateOne(
            { _id: sensor._id },
            { $set: { status: "Offline", outlierFetched: "NA" } }
          );
        } else {
          const isOutlier = value < limits.min || value > limits.max;
          await stationsCollection.updateOne(
            { _id: sensor._id },
            {
              $set: {
                status: "Online",
                outlierFetched: isOutlier ? true : false,
              },
            }
          );
        }
      }
    }

    console.log("Outlier and status update completed.");
    await browser.close();
    await client.close();
    console.log("Browser and MongoDB connection closed");
  } catch (error) {
    console.error("Error during scraping or MongoDB operation:", error);
  }
})();
