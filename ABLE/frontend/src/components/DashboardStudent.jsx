// src/components/DashboardStudent.jsx

import React, { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function DashboardStudent() {
  const { user } = useUser();
  const navigate = useNavigate();  // useNavigate to handle routing
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/assessments/all");
        setAssessments(res.data);
      } catch (err) {
        console.error("❌ Error fetching assessments:", err);
      }
    };
    fetchAssessments();
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.heading}>👋 Welcome, {user?.firstName || "Student"}</h1>
        <UserButton afterSignOutUrl="/" />
      </header>
      <p style={styles.subtext}>
        You're all set to begin your adaptive and accessible learning journey with AbleX.
      </p>

      <h2 style={styles.sectionTitle}>Available Assessments</h2>
      <div style={styles.cardContainer}>
        {assessments.map((a) => (
          <div key={a._id} style={styles.card}>
            <h3>{a.title}</h3>
            <p><strong>Timer:</strong> {a.timer} min</p>
            <p><strong>Created By:</strong> {a.createdBy}</p>
            <p><strong>Supports:</strong> {a.targetSupports.join(", ")}</p>
            {/* 🚀 Navigate to /assessment/:id on click */}
            <button
              style={styles.button}
              onClick={() => navigate(`/assessment/${a._id}`)}
            >
              Start Assessment
            </button>
          </div>
        ))}
        {assessments.length === 0 && <p>No assessments available yet.</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "4rem 2rem",
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#F0F8FF",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  heading: {
    fontSize: "2rem",
    color: "#0B3D91",
  },
  subtext: {
    marginBottom: "2rem",
    color: "#444",
    fontSize: "1rem",
  },
  sectionTitle: {
    fontSize: "1.4rem",
    fontWeight: 600,
    marginBottom: "1rem",
    color: "#0B3D91",
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    flex: "1 1 250px",
  },
  button: {
    marginTop: "1rem",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
