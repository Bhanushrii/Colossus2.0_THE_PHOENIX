import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EducatorScores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await axios.get("http://localhost:5000/scores/all");
        setScores(res.data);
      } catch (err) {
        console.error("❌ Error fetching scores:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  if (loading) return <p style={{ padding: "2rem" }}>Loading student scores...</p>;
  if (!scores.length) return <p style={{ padding: "2rem" }}>No scores submitted yet.</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📊 Student Assessment Results</h2>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Disability Support</th>
              <th style={styles.th}>Score</th>
              <th style={styles.th}>Assessment ID</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, i) => (
              <tr key={i} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                <td style={styles.td}>{s.userId}</td>
                <td style={styles.td}>{s.supports?.join(", ") || "None"}</td>
                <td style={styles.td}>{`${s.score} / ${s.total}`}</td>
                <td style={styles.td}>{s.assessmentId || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#fff",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "1.8rem",
    marginBottom: "1rem",
    color: "#333",
  },
  tableWrapper: {
    overflowX: "auto",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    borderRadius: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "1rem",
  },
  th: {
    background: "#f3f4f6",
    padding: "12px 16px",
    borderBottom: "2px solid #ddd",
    textAlign: "left",
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #eee",
  },
  rowEven: {
    backgroundColor: "#fafafa",
  },
  rowOdd: {
    backgroundColor: "#fff",
  },
};
