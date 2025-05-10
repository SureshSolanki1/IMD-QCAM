require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
const cron = require("node-cron");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));


// User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);

// Register User
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();
  res.json({ message: "User registered successfully" });
});

// Login User
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Protected Route
app.get("/profile", async (req, res) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

const stationSchema = new mongoose.Schema({
  stationId: String,
  name: String,
  sensorID: String,
  sensorName: String,
  installationDate: Date,
  lastMaintenance: Date,
  nextMaintenance: Date,
  needsMaintenance: Boolean,
  email: String,
  outlierFetched: Boolean
});

const Station = mongoose.model("Station", stationSchema);

// Correct Schema Mapping for AWS Data Collection
const AWSDataSchema = new mongoose.Schema({
  serial_no: Number,
  district: String,
  station: String,
  date: String,
  time: String,
  rainfall: String,
  temp: String,
  temp_min: String,
  temp_max: String,
  rh: String,
  rh_min_max: String,
  wind_dir: String,
  wind_speed: String,
  wind_speed_max_gust: String,
  slp: String,
  mslp: String,
  sunshine: String,
  battery: String,
  gps: String,
  timestamp: Date
});

const AWSData = mongoose.model("AWSData", AWSDataSchema, "aws_data"); // Ensure correct collection name

// ✅ Updated API to Fetch AWS Data and Map Fields
app.get("/api/aws_station_data", async (req, res) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Fetch today's records, sorted by serial number
    const data = await AWSData.find({ date: today })
      .sort({ serial_no: 1 }) // 1 for ascending order by serial number
      .lean()
      .exec();
    
    console.log("📌 MongoDB Data Count:", data.length);
    
    if (data.length === 0) {
      return res.status(404).json({ message: "No data found for today" });
    }

    // Map the data to match frontend expectations
    const mappedData = data.map(item => ({
      S_NO: item.serial_no,
      DISTRICT: item.district,
      STATION: item.station,
      DATE: item.date,
      TIME_IST: item.time,
      RAIN_FALL: item.rainfall,
      TEMP_C: item.temp,
      TEMP_MIN_C: item.temp_min,
      TEMP_MAX_C: item.temp_max,
      RH_PERCENT: item.rh,
      RH_MIN_MAX_PERCENT: item.rh_min_max,
      WIND_DIR_DEG: item.wind_dir,
      WIND_SPEED_KT: item.wind_speed,
      WIND_GUST_KT: item.wind_speed_max_gust,
      SLP_HPA: item.slp,
      MSLP_HPA: item.mslp,
      SUN_SHINE: item.sunshine,
      BATTERY_VOLTS: item.battery,
      GPS: item.gps
    }));

    console.log("📌 Sending total records:", mappedData.length);
    res.json(mappedData);
  } catch (error) {
    console.error("❌ Error fetching AWS data:", error);
    res.status(500).json({ message: "Error fetching AWS data", error });
  }
});

// API: Search AWS Station by Name
app.get("/api/stations/search", async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    console.log("🔍 Received Search Query:", query);

    if (mongoose.connection.readyState !== 1) {
      console.error("❌ MongoDB is not connected!");
      return res.status(500).json({ message: "Database connection error" });
    }

    const searchRegex = new RegExp(query, "i");
    const stations = await Station.find({ name: searchRegex });

    console.log("📌 MongoDB Search Result:", stations);

    if (stations.length === 0) {
      return res.status(404).json({ message: "No stations found" });
    }

    res.json(stations);
  } catch (error) {
    console.error("❌ Error searching station:", error);
    res.status(500).json({ message: "Error searching station", error });
  }
});

// Function to Check Maintenance and Send Emails
const checkMaintenance = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const stations = await Station.find({ nextMaintenance: { $lte: new Date(today) } });

    stations.forEach(async (station) => {
      if (!station.needsMaintenance) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: station.email,
          subject: `AWS Station ${station.name} Needs Maintenance`,
          text: `Hello,\n\nThe AWS Station ${station.name} requires maintenance today.\n\nPlease schedule it accordingly.\n\nThanks,\nAWS Monitoring System`
        };

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        await transporter.sendMail(mailOptions);
        await Station.updateOne({ _id: station._id }, { needsMaintenance: true });

        console.log(`Maintenance email sent to ${station.email} for ${station.name}`);
      }
    });
  } catch (error) {
    console.error("Error in maintenance check:", error);
  }
};

// Schedule Email Check Every Day at 9 AM
cron.schedule("0 9 * * *", () => {
  console.log("Checking maintenance status...");
  checkMaintenance();
});

app.listen(5000, () => console.log("Server running on port 5000"));
