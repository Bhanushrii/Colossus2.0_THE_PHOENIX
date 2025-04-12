import React, { useState } from "react";

export default function QuestionBuilder({ onAddQuestion }) {
  const [questionText, setQuestionText] = useState("");
  const [type, setType] = useState("mcq");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleAdd = () => {
    if (!questionText) {
      return alert("Please provide a question!");
    }

    if (type === "mcq") {
      // Ensure there's at least one option and a correct answer
      if (!options.some((opt) => opt) || !correctAnswer) {
        return alert("Please fill out MCQ options and correct answer!");
      }
    } else if (type === "short" && !correctAnswer) {
      return alert("Please provide a correct one-word answer!");
    }

    // Convert the imageFile to an object URL for local display
    const imageUrl = imageFile ? URL.createObjectURL(imageFile) : null;

    const newQuestion = {
      questionText,
      type, // "mcq" or "short"
      options: type === "mcq" ? options : [],
      correctAnswer,
      imageUrl, // naming matches the Mongoose schema
    };

    // Send the new question up to parent
    onAddQuestion(newQuestion);

    // Reset form fields
    setQuestionText("");
    setType("mcq");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
    setImageFile(null);
  };

  return (
    <div style={styles.container}>
      <label>Question:</label>
      <textarea
        rows={2}
        style={styles.input}
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
      />

      <label>Question Type:</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={styles.input}
      >
        <option value="mcq">Multiple Choice</option>
        <option value="short">One Word Answer</option>
      </select>

      {type === "mcq" && (
        <>
          <label>Options:</label>
          {options.map((opt, idx) => (
            <input
              key={idx}
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={(e) => {
                const newOpts = [...options];
                newOpts[idx] = e.target.value;
                setOptions(newOpts);
              }}
              style={styles.input}
            />
          ))}

          <label>Correct Option:</label>
          <input
            placeholder="Enter correct option text"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            style={styles.input}
          />
        </>
      )}

      {type === "short" && (
        <>
          <label>Correct One Word Answer:</label>
          <input
            placeholder="Enter correct one-word answer"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            style={styles.input}
          />
        </>
      )}

      <label>Attach Optional Image:</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        style={styles.input}
      />

      <button onClick={handleAdd} style={styles.button}>
        Add Question
      </button>
    </div>
  );
}

const styles = {
  container: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  button: {
    background: "#4f46e5",
    color: "white",
    padding: "10px 20px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
  },
};
