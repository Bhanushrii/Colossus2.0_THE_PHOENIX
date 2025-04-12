import React, { useState } from "react";
import axios from "axios";

export default function CognitiveFeatures({ questionText }) {
  const [simplified, setSimplified] = useState("");
  const [loading, setLoading] = useState(false);

  const simplifyText = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_GEMINI_API_KEY",
        {
          contents: [
            {
              parts: [
                {
                  text: `Simplify this question using easy words, bullet points, and step-by-step format:\n\n${questionText}`,
                },
              ],
            },
          ],
        }
      );

      const simplifiedText =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Could not simplify.";
      setSimplified(simplifiedText);
    } catch (err) {
      console.error("❌ Error simplifying text:", err);
      setSimplified("❌ Failed to simplify.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <button onClick={simplifyText} disabled={loading} style={styles.button}>
        {loading ? "Simplifying..." : "🧠 Simplify Question"}
      </button>
      {simplified && (
        <div style={styles.result}>
          <p><strong>Simplified Version:</strong></p>
          <pre style={{ whiteSpace: "pre-wrap" }}>{simplified}</pre>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    marginTop: "1rem",
    marginBottom: "1rem",
    fontFamily: "'Segoe UI', sans-serif",
  },
  button: {
    backgroundColor: "#2563EB",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 16px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  result: {
    marginTop: "1rem",
    padding: "1rem",
    backgroundColor: "#f3f4f6",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
};
