// proxy.js (ES Module version)

import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS so your frontend can call this proxy.
app.use(cors());
// Parse JSON bodies.
app.use(express.json());

// Proxy endpoint to forward Gemini API requests
app.post("/proxy-gemini", async (req, res) => {
  // Use your API key (ideally, load from an environment variable)
  const API_KEY = "AIzaSyAAhFsxkmbYpeWfuCjswbTaGJsPHXaH1tk";
  // Construct the Gemini URL
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${API_KEY}`;
  
  try {
    const response = await axios.post(geminiUrl, req.body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Proxy error:", error.response ? error.response.data : error.message);
    res.status(error.response?.status || 500).json(
      error.response?.data || { error: error.message }
    );
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
