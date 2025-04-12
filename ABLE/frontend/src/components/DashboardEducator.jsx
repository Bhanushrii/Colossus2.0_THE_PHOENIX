// src/components/DashboardEducator.jsx
import React from "react";
import { UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function DashboardEducator() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.heading}>🎓 Welcome, Educator</h1>
        <UserButton afterSignOutUrl="/" />
      </header>
      <p style={styles.subtext}>
        Empower every learner with inclusive assessments and adaptive insights.
      </p>

      <div style={styles.cardContainer}>
        <div
          style={{ ...styles.card, cursor: "pointer" }}
          onClick={() => navigate("/assessments/create")}
        >
          <h2>📤 Deploy Assessments</h2>
          <p>Create and assign tests with adaptive formats.</p>
        </div>

        <div
          style={{ ...styles.card, cursor: "pointer" }}
          onClick={() => navigate("/educator/scores")}
        >
          <h2>📈 Track Student Progress</h2>
          <p>View submitted scores and insights.</p>
        </div>

    


        
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "4rem 2rem",
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#FFF7F5",
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
    color: "#C94C4C",
  },
  subtext: {
    marginBottom: "2rem",
    color: "#555",
    fontSize: "1rem",
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
};
