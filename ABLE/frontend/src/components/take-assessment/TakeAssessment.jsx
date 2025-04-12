// TakeAssessment.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import DyslexiaFeatures from "./features/DyslexiaFeatures";
import SipPuffListener from "./SipPuffListener";
import BrailleSpeaker from "./features/BrailleSpeaker";

// Reusable style for visual‐mode buttons
const visualButtonStyle = {
  padding: "16px 32px",
  fontSize: "1.2rem",
  borderRadius: "12px",
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
};

export default function TakeAssessment() {
  const { id } = useParams();
  const { user } = useUser();

  // Core state
  const [assessment, setAssessment] = useState(null);
  const [supports, setSupports] = useState([]);
  const [motorPreference, setMotorPreference] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [simplified, setSimplified] = useState("");
  const [simplifying, setSimplifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [highlightedOption, setHighlightedOption] = useState(0);

  // 1) Load user supports & assessment
  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await axios.get(
          `http://localhost:5000/get-user/${user.id}`
        );
        setSupports(userRes.data.supports || []);
        if (userRes.data.supports?.includes("motor")) {
          setMotorPreference("sip-puff");
        }
        const assessRes = await axios.get(
          `http://localhost:5000/assessments/${id}`
        );
        setAssessment(assessRes.data);
      } catch (err) {
        console.error("❌ Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, user]);

  // 2) Reset simplify state on question change
  useEffect(() => {
    setSimplified("");
    setSimplifying(false);
  }, [currentIndex]);

  // 3) AI‑powered simplify
  const handleSimplify = async (text) => {
    setSimplifying(true);
    try {
      const prompt = `Simplify this question using simple English, bullet points, and a step-by-step explanation:\n\n${text}`;
      const payload = {
        model: "gemini-1.5-pro-latest",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 256 },
      };
      const res = await axios.post(
        "http://localhost:3000/proxy-gemini",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      const simplifiedText =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Could not simplify.";
      setSimplified(simplifiedText);
    } catch (err) {
      console.error("❌ Simplify error:", err);
      setSimplified("❌ Failed to simplify.");
    } finally {
      setSimplifying(false);
    }
  };

  // 4) Timer (skip if autism support)
  const effectiveTimer =
    assessment && supports.includes("autism") ? null : assessment?.timer;
  useEffect(() => {
    if (!assessment || !effectiveTimer) return;
    const initial = effectiveTimer * 60;
    setTimeLeft(initial);
    const iv = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(iv);
          console.log("⏰ Time is up!");
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [assessment, effectiveTimer]);

  // 5) Submit score
  const submitScore = async () => {
    setSubmitLoading(true);
    try {
      let score = 0;
      assessment.questions.forEach((q, idx) => {
        if (
          q.correctAnswer !== undefined &&
          selectedAnswers[idx] === q.correctAnswer
        ) {
          score++;
        }
      });
      await axios.post("http://localhost:5000/submit-score", {
        userId: user.id,
        userName: user.fullName,
        supports,
        score,
        total: assessment.questions.length,
      });
      alert("✅ Score submitted!");
    } catch (err) {
      console.error("❌ Submit error:", err);
      alert("Error submitting score.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading)
    return (
      <p style={{ padding: "3rem", fontSize: "1.4rem" }}>
        Loading assessment...
      </p>
    );
  if (!assessment)
    return (
      <p style={{ padding: "3rem", fontSize: "1.4rem" }}>
        Assessment not found.
      </p>
    );

  const { title, questions } = assessment;
  const hasVisual = supports.includes("visual");
  const hasDyslexia =
    supports.includes("dyslexia") || supports.includes("adhd");
  const hasAutism = supports.includes("autism");
  const hasMotor =
    supports.includes("motor") && motorPreference === "sip-puff";
  const currentQ = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const autismStyles = {
    wrapper: {
      backgroundColor: "#f0f4ff",
      color: "#1e293b",
      fontFamily: "'Segoe UI', sans-serif",
      padding: "3rem",
      minHeight: "100vh",
      fontSize: "1.2rem",
    },
    questionBox: {
      border: "3px solid #cbd5e1",
      background: "#fff",
      padding: "2rem",
      borderRadius: "12px",
      marginTop: "1.5rem",
      fontSize: "1.4rem",
    },
    progress: {
      fontSize: "1.3rem",
      fontWeight: "bold",
      color: "#334155",
      marginBottom: "1rem",
    },
    nav: {
      marginTop: "2.5rem",
      display: "flex",
      gap: "1.5rem",
    },
    button: {
      padding: "14px 28px",
      fontSize: "1.2rem",
      borderRadius: "10px",
      backgroundColor: "#3b82f6",
      color: "#fff",
      border: "none",
      cursor: "pointer",
    },
  };

  return (
    <div
      style={
        hasAutism
          ? autismStyles.wrapper
          : hasVisual
          ? {
              backgroundColor: "#000",
              color: "#fff",
              padding: "4rem",
              fontSize: "1.3rem",
              minHeight: "100vh",
              width: "100vw",
            }
          : { padding: "2.5rem", fontSize: "1.2rem" }
      }
    >
      {/* Braille / vibration */}
      {hasVisual && currentQ?.questionText && currentQ?.options && (
        <BrailleSpeaker
          question={currentQ.questionText}
          options={currentQ.options}
        />
      )}

      <h2
        style={{
          fontSize: "2.2rem",
          marginBottom: "1rem",
          lineHeight: "1.3",
        }}
        onMouseEnter={() => hasVisual && speak(title)}
        tabIndex={hasVisual ? 0 : -1}
        onFocus={() => hasVisual && speak(title)}
      >
        {title}
      </h2>

      {!hasAutism && effectiveTimer != null && (
        <p style={{ fontSize: "1.4rem", marginBottom: "1rem" }}>
          ⏱ Time Left:{" "}
          <strong>
            {Math.floor(timeLeft / 60)}:
            {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
          </strong>
        </p>
      )}

      {hasAutism && (
        <p style={autismStyles.progress}>
          Step {currentIndex + 1} of {questions.length}
        </p>
      )}

      {hasDyslexia ? (
        <DyslexiaFeatures question={currentQ} />
      ) : (
        <QuestionItem
          question={currentQ}
          questionIndex={currentIndex}
          totalQuestions={questions.length}
          visualMode={hasVisual}
          cognitiveMode={supports.includes("cognitive")}
          autismMode={hasAutism}
          autismStyles={autismStyles}
          onSimplify={() => handleSimplify(currentQ.questionText)}
          simplified={simplified}
          simplifying={simplifying}
          onAnswer={(idx, sel) => {
            setSelectedAnswers((prev) => ({ ...prev, [idx]: sel }));
            setHighlightedOption(sel);
          }}
          highlightedOption={highlightedOption}
        />
      )}

      <div
        style={
          hasAutism
            ? autismStyles.nav
            : { marginTop: "2rem", display: "flex", gap: "1rem" }
        }
      >
        {currentIndex < questions.length - 1 ? (
          <button
            onClick={handleNext}
            style={hasAutism ? autismStyles.button : visualButtonStyle}
            onMouseEnter={() => hasVisual && speak("Next question")}
            onFocus={() => hasVisual && speak("Next question")}
          >
            Next
          </button>
        ) : (
          <button
            onClick={submitScore}
            disabled={submitLoading}
            style={hasAutism ? autismStyles.button : visualButtonStyle}
            onMouseEnter={() => hasVisual && speak("Finish assessment")}
            onFocus={() => hasVisual && speak("Finish assessment")}
          >
            {submitLoading ? "Submitting..." : "Finish"}
          </button>
        )}
      </div>

      {hasMotor && (
        <SipPuffListener
          onSip={() => {
            const opts = currentQ.options?.length || 0;
            setHighlightedOption((prev) => {
              const next = (prev + 1) % opts;
              setSelectedAnswers((ans) => ({
                ...ans,
                [currentIndex]: next,
              }));
              return next;
            });
          }}
          onPuff={() => {
            if (currentIndex < questions.length - 1) handleNext();
            else submitScore();
          }}
        />
      )}
    </div>
  );
}

// inline QuestionItem & speak()


function QuestionItem({
  question,
  questionIndex,
  totalQuestions,
  visualMode,
  cognitiveMode,
  autismMode,
  autismStyles,
  onSimplify,
  simplified,
  simplifying,
  onAnswer,
  highlightedOption,
}) {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (highlightedOption !== undefined) {
      setSelectedOption(highlightedOption);
    }
  }, [highlightedOption]);

  const handleFocus = () => {
    if (visualMode) speak(question.questionText);
  };
  const handleOptionFocus = (opt) => {
    if (visualMode) speak(opt);
  };

  return (
    <div
      tabIndex={0}
      onFocus={handleFocus}
      onMouseEnter={handleFocus}
      style={
        autismMode
          ? autismStyles.questionBox
          : {
              marginTop: "1.5rem",
              padding: "1.5rem",
              border: "2px solid #ccc",
              borderRadius: "8px",
              fontSize: "1.3rem",
            }
      }
    >
      <p style={{ marginBottom: "1rem", lineHeight: "1.4" }}>
        <strong>
          Question {questionIndex + 1}/{totalQuestions}:
        </strong>{" "}
        {question.questionText}
      </p>

      {cognitiveMode && (
        <div style={{ margin: "1.2rem 0" }}>
          <button
            onClick={onSimplify}
            disabled={simplifying}
            style={{
              ...visualButtonStyle,
              backgroundColor: "#4f46e5",
              marginBottom: "1rem",
            }}
            onMouseEnter={() => speak("Simplify question")}
            onFocus={() => speak("Simplify question")}
          >
            {simplifying ? "Simplifying..." : "🧠 Simplify Question"}
          </button>
          {simplified && (
            <div
              style={{
                backgroundColor: "#f1f5f9",
                padding: "1.2rem",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                fontFamily: "Segoe UI, sans-serif",
                whiteSpace: "pre-wrap",
                fontSize: "1.1rem",
              }}
            >
              <p>
                <strong>🔍 Simplified:</strong>
              </p>
              <div>{simplified}</div>
            </div>
          )}
        </div>
      )}

      {question.type === "mcq" && (
        <ul style={{ listStyle: "none", paddingLeft: 0, fontSize: "1.2rem" }}>
          {question.options.map((opt, i) => (
            <li
              key={i}
              tabIndex={0}
              onFocus={() => handleOptionFocus(opt)}
              onMouseEnter={() => handleOptionFocus(opt)}
              style={{ marginBottom: "0.8rem" }}
            >
              <label style={{ cursor: "pointer" }}>
                <input
                  type="radio"
                  name={`q-${questionIndex}`}
                  checked={selectedOption === i}
                  onChange={() => {
                    setSelectedOption(i);
                    onAnswer(questionIndex, i);
                  }}
                  style={{ transform: "scale(1.3)", marginRight: "0.5rem" }}
                />
                {opt}
              </label>
            </li>
          ))}
        </ul>
      )}

      {question.type === "short" && (
        <input
          type="text"
          placeholder="Type your answer..."
          style={{
            marginTop: "0.8rem",
            padding: "8px",
            fontSize: "1.2rem",
            width: "100%",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
          onFocus={() => visualMode && speak("Type your answer")}
          onMouseEnter={() => visualMode && speak("Type your answer")}
        />
      )}

      {question.imageUrl && (
        <img
          src={question.imageUrl}
          alt="question"
          style={{ maxWidth: "100%", marginTop: "1rem", borderRadius: "6px" }}
        />
      )}
    </div>
  );
}

function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 1;
  window.speechSynthesis.speak(u);
}
