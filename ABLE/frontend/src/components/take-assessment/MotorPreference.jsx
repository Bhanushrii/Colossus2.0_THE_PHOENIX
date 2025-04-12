// MotorPreference.jsx
import React from "react";
import axios from "axios";

export default function MotorPreference({ userId, onComplete }) {
  const handleSelect = async (preference) => {
    try {
      await axios.post(`http://localhost:5000/set-motor-preference/${userId}`, {
        preference,
      });
      onComplete(preference);
    } catch (err) {
      console.error("❌ Failed to set preference:", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🦾 Choose Your Input Method</h2>
      <p>Select one way to interact with the assessment:</p>

      <button
        onClick={() => handleSelect("eye-tracking")}
        style={buttonStyle}
      >
        👁️ Eye Tracking
      </button>

      <button
        onClick={() => handleSelect("sip-puff")}
        style={buttonStyle}
      >
        🌬️ Sip-and-Puff
      </button>
    </div>
  );
}

const buttonStyle = {
  margin: "1rem",
  padding: "1rem 2rem",
  fontSize: "1.2rem",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#3b82f6",
  color: "white",
  cursor: "pointer",
};
