// CreateAssessment.jsx

import React, { useState } from "react";
import QuestionBuilder from "./QuestionBuilder";
import TimerSelector from "./TimerSelector";
import AssessmentPreview from "./AssessmentPreview";

export default function CreateAssessment() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [timer, setTimer] = useState(10);

  const handleAddQuestion = (newQuestion) => {
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const handleDeleteQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>📚 Create Assessment</h1>

      <label style={styles.label}>Assessment Title</label>
      <input
        type="text"
        placeholder="e.g. Algebra Quiz 1"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
      />

      <section style={styles.section}>
        <h2 style={styles.subheading}>✏️ Manual Questions</h2>
        <QuestionBuilder onAddQuestion={handleAddQuestion} />
      </section>

      <section style={styles.section}>
        <h2 style={styles.subheading}>⏱ Timer</h2>
        <TimerSelector value={timer} onChange={setTimer} />
      </section>

      <section style={styles.section}>
        <h2 style={styles.subheading}>👁️ Preview (Visual Mode)</h2>
        <AssessmentPreview
          title={title}
          questions={questions}
          timer={timer}
          previewMode="visual"
          onDeleteQuestion={handleDeleteQuestion}
        />
      </section>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "Inter, sans-serif",
    backgroundColor: "#fdf6ff",
    color: "#4b4b4b",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
    color: "#a58fd4",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: 500,
    color: "#7e6a9f",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "1.5rem",
    border: "1px solid #d8c3e5",
    borderRadius: "8px",
    backgroundColor: "#fff8fd",
  },
  section: {
    marginBottom: "2rem",
    padding: "1rem",
    backgroundColor: "#fcf5ff",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  subheading: {
    fontSize: "1.5rem",
    marginBottom: "1rem",
    color: "#8f6bbd",
  },
};
