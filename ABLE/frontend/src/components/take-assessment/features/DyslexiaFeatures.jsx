import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import "../../../fonts.css"; // ⬅️ Make sure this path is correct

export default function DyslexiaFeatures({ question, onAnswer }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const hasCelebrated = useRef(false);

  useEffect(() => {
    if (question?.questionText) {
      speak(question.questionText);
    }
    setSelectedOption(null);
    hasCelebrated.current = false;
  }, [question]);

  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const handleOptionClick = (opt) => {
    setSelectedOption(opt);
    speak(opt);
    triggerConfetti(); // 🎉 For every selection
    hasCelebrated.current = true;
    if (onAnswer) onAnswer(opt);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  if (!question) return null;

  return (
    <div style={styles.wrapper}>
      <style>{keyframes}</style> {/* ⬅️ For fade-in animation */}

      <p style={styles.question}>{question.questionText}</p>

      {question.type === "mcq" && (
        <ul style={styles.optionList}>
          {(question.options || []).map((opt, idx) => (
            <li
              key={idx}
              tabIndex={0}
              role="button"
              aria-pressed={selectedOption === opt}
              style={{
                ...styles.option,
                backgroundColor: selectedOption === opt ? "#dbeafe" : "#fff",
              }}
              onClick={() => handleOptionClick(opt)}
              onFocus={() => speak(opt)}
              onMouseEnter={() => speak(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}

      {question.type === "short" && (
        <input
          type="text"
          placeholder="Type your answer..."
          style={styles.input}
          onFocus={() => speak("Type your answer")}
        />
      )}
    </div>
  );
}

// 🎨 Styling
const styles = {
  wrapper: {
    fontFamily: "'OpenDyslexic', Arial, sans-serif",
    lineHeight: "1.8",
    letterSpacing: "0.08em",
    fontSize: "1.1rem",
    padding: "1rem",
    borderRadius: "10px",
    backgroundColor: "#f0f9ff",
    marginTop: "1rem",
    animation: "fadeIn 0.5s ease-in-out",
  },
  question: {
    marginBottom: "1rem",
    fontWeight: "bold",
  },
  optionList: {
    listStyle: "none",
    paddingLeft: 0,
  },
  option: {
    padding: "12px",
    border: "2px solid #60a5fa",
    borderRadius: "10px",
    marginBottom: "12px",
    cursor: "pointer",
    backgroundColor: "#fff",
    transition: "background-color 0.2s ease, transform 0.2s ease",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
};

// 🔥 Animation keyframes (inline style)
const keyframes = `
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
`;
