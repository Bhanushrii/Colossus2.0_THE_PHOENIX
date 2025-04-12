// src/components/assessments/AssessmentPreview.jsx
import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

export default function AssessmentPreview({ questions, title, timer }) {
  const { user } = useUser();
  const [mode, setMode] = useState("normal");
  const [isSaving, setIsSaving] = useState(false);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.post("http://localhost:5000/assessments/create", {
        createdBy: user.id,
        title,
        timer,
        questions,
        targetSupports: [mode],
      });
      alert("✅ Assessment saved!");
    } catch (err) {
      console.error("❌ Error saving assessment:", err);
      alert("❌ Failed to save assessment");
    } finally {
      setIsSaving(false);
    }
  };

  const renderVisualMode = () => (
    <div style={{ filter: "contrast(150%)", fontSize: "1.2rem" }}>
      {questions.map((q, idx) => (
        <div
          key={idx}
          tabIndex={0}
          onFocus={() => speak(q.questionText)}
          onMouseEnter={() => speak(q.questionText)}
          style={{
            marginBottom: "2rem",
            padding: "1rem",
            border: "2px solid #555",
            backgroundColor: "#000",
            color: "#fff",
          }}
        >
          <p><strong>Q{idx + 1}:</strong> {q.questionText}</p>
          {q.imageUrl && <img src={q.imageUrl} alt="question" style={{ maxWidth: 300 }} />}
          {q.type === "mcq" && (
            <ul>
              {q.options.map((opt, i) => (
                <li
                  key={i}
                  tabIndex={0}
                  onFocus={() => speak(opt)}
                  onMouseEnter={() => speak(opt)}
                  style={{ margin: "0.5rem 0" }}
                >
                  {opt}
                </li>
              ))}
            </ul>
          )}
          {q.type === "short" && (
            <input
              type="text"
              placeholder="Type your answer"
              style={{ padding: "0.5rem", marginTop: "1rem", width: "100%" }}
              tabIndex={0}
              onFocus={() => speak("Answer field")}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderPreview = () => {
    switch (mode) {
      case "visual":
        return renderVisualMode();
      default:
        return <p>✨ Preview for '{mode}' mode is coming soon.</p>;
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Segoe UI, sans-serif" }}>
      <h2 style={{ marginBottom: "1rem" }}>Preview Assessment: {title}</h2>

      <label style={{ display: "block", marginBottom: "1rem" }}>
        Preview Mode:
        <select value={mode} onChange={(e) => setMode(e.target.value)} style={{ marginLeft: "1rem" }}>
          <option value="normal">Normal</option>
          <option value="visual">Visual</option>
          <option value="hearing">Hearing</option>
          <option value="cognitive">Cognitive</option>
          <option value="adhd">Dyslexia / ADHD</option>
          <option value="autism">Autism</option>
        </select>
      </label>

      {renderPreview()}

      <button
        onClick={handleSave}
        disabled={isSaving}
        style={{
          marginTop: "2rem",
          padding: "12px 24px",
          background: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: 6,
        }}
      >
        {isSaving ? "Saving..." : "Save Assessment"}
      </button>
    </div>
  );
}
