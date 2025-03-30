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
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

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

// API: Get all AWS Stations
app.get("/api/stations", async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stations", error });
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
