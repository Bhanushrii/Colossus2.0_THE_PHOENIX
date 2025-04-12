// server.js

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

import { SerialPort } from "serialport";

// Models
import User from "./models/User.js";
import Assessment from "./models/Assessment.js";
import Score from "./models/Score.js"; // NEW: score model

const app = express();

// ======================== MIDDLEWARE =========================

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(ClerkExpressWithAuth());

// ======================= MONGODB CONNECTION ==================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// ======================= SERIAL PORT FOR BRAILLE =============

//const brailleSerial = new SerialPort({ path: "COM9", baudRate: 9600 });

function letterToDots(letter) {
  switch (letter) {
    case "a": return [1];
    case "b": return [1, 2];
    case "c": return [1, 4];
    case "d": return [1, 4, 5];
    case "e": return [1, 5];
    case "f": return [1, 2, 4];
    case "g": return [1, 2, 4, 5];
    case "h": return [1, 2, 5];
    case "i": return [2, 4];
    case "j": return [2, 4, 5];
    case "k": return [1, 3];
    case "l": return [1, 2, 3];
    case "m": return [1, 3, 4];
    case "n": return [1, 3, 4, 5];
    case "o": return [1, 3, 5];
    case "p": return [1, 2, 3, 4];
    case "q": return [1, 2, 3, 4, 5];
    case "r": return [1, 2, 3, 5];
    case "s": return [2, 3, 4];
    case "t": return [2, 3, 4, 5];
    case "u": return [1, 3, 6];
    case "v": return [1, 2, 3, 6];
    case "w": return [2, 4, 5, 6];
    case "x": return [1, 3, 4, 6];
    case "y": return [1, 3, 4, 5, 6];
    case "z": return [1, 3, 5, 6];
    default: return [];
  }
}

// ====================== ROUTES ===============================

app.post("/create-user", async (req, res) => {
  try {
    const { userId, email, name, profileImageUrl } = req.body;
    if (!userId || !email || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const user = await User.findOneAndUpdate(
      { userId },
      { email, name, profilePicture: profileImageUrl },
      { new: true, upsert: true }
    );
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error saving user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/get-user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/onboarding", async (req, res) => {
  try {
    const { userId, role, supports, isOnboarded } = req.body;
    if (!userId || !role) {
      return res.status(400).json({ error: "User ID and role are required" });
    }
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      {
        $set: {
          role,
          supports,
          isOnboarded,
        },
      },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: "Onboarding complete", user: updatedUser });
  } catch (err) {
    console.error("❌ Error saving onboarding info:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/set-motor-preference", async (req, res) => {
  try {
    const { userId, preference } = req.body;
    if (!userId || !preference) {
      return res.status(400).json({ error: "Missing userId or preference" });
    }
    const updated = await User.findOneAndUpdate(
      { userId },
      { $set: { motorPreference: preference } },
      { new: true }
    );
    res.status(200).json({ success: true, updated });
  } catch (error) {
    console.error("❌ Error setting motor preference:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/submit-score", async (req, res) => {
  try {
    const { userId, name, supports, score, total } = req.body;
    if (!userId || score === undefined || total === undefined) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const saved = await new Score({ userId, name, supports, score, total }).save();
    res.status(201).json({ message: "Score submitted", scoreId: saved._id });
  } catch (err) {
    console.error("❌ Error submitting score:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ NEW: Fetch all submitted scores (Educator dashboard)
app.get("/scores/all", async (req, res) => {
  try {
    const allScores = await Score.find();
    res.status(200).json(allScores);
  } catch (err) {
    console.error("❌ Error fetching scores:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/assessments/create", async (req, res) => {
  try {
    const { createdBy, title, timer, questions, targetSupports } = req.body;

    const newAssessment = new Assessment({
      createdBy,
      title,
      timer,
      questions,
      targetSupports,
    });

    const saved = await newAssessment.save();
    res.status(201).json({ message: "Assessment created", assessmentId: saved._id });
  } catch (err) {
    console.error("❌ Error creating assessment:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/assessments/all", async (req, res) => {
  try {
    const allAssessments = await Assessment.find();
    res.status(200).json(allAssessments);
  } catch (err) {
    console.error("❌ Error fetching assessments:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/assessments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const oneAssessment = await Assessment.findById(id);
    if (!oneAssessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }
    res.status(200).json(oneAssessment);
  } catch (err) {
    console.error("❌ Error fetching assessment by ID:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/braille", (req, res) => {
  try {
    const { letter } = req.body;
    if (!letter) {
      return res.status(400).json({ error: "No letter provided" });
    }

    const lower = letter.toLowerCase();
    const dots = letterToDots(lower);

    const packet = Buffer.from([dots.length, ...dots]);

    brailleSerial.write(packet, (err) => {
      if (err) {
        console.error("❌ Braille write error:", err);
        return res.status(500).json({ error: err.message });
      }
      console.log(`Sent letter '${letter}' => dots: [${dots}]`);
      res.status(200).json({ status: "ok", letter, dots });
    });
  } catch (err) {
    console.error("❌ Error sending braille letter:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
