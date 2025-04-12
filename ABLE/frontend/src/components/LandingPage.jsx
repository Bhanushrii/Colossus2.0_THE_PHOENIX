// LandingPage.jsx

import React, { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { SignInButton } from "@clerk/clerk-react";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  // TTS helper
  const speak = (text) => {
    const synth = window.speechSynthesis;
    if (!synth.speaking) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-US";
      utter.rate = 1;
      synth.speak(utter);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/onboarding");
    }
  }, [isLoaded, isSignedIn, navigate]);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0f7fa, #fce4ec)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Segoe UI', sans-serif",
        paddingBottom: "5rem",
      }}
    >
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          .navbar {
            position: sticky;
            top: 0;
            width: 100%;
            background: rgba(255, 255, 255, 0.6);
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 1.6rem;
            font-weight: 600;
            color: #333;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
            backdrop-filter: blur(8px);
          }

          .glow-button button {
            padding: 0.7rem 1.8rem;
            font-size: 1rem;
            font-weight: 600;
            border-radius: 30px;
            border: 2px solid #6ec6ca;
            background: transparent;
            color: #333;
            transition: all 0.3s ease;
            cursor: pointer;
            backdrop-filter: blur(6px);
          }

          .glow-button button:hover {
            background: #6ec6ca;
            color: #fff;
            box-shadow: 0 0 20px rgba(110, 198, 202, 0.6);
          }

          .glass-card {
            background: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 18px;
            padding: 2rem;
            width: 300px;
            text-align: center;
            backdrop-filter: blur(12px);
            box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
            color: #333;
            transition: transform 0.3s ease;
          }

          .glass-card:hover {
            transform: translateY(-5px);
          }

          .hero h1 {
            font-size: 2.7rem;
            font-weight: 800;
            background: linear-gradient(to right, #7ed6df, #f8a5c2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.6rem;
          }

          .hero p {
            font-size: 1.1rem;
            color: #4a4a4a;
          }
        `}
      </style>

      <div
        className="navbar"
        tabIndex={0}
        onFocus={() => speak("AbleX")}
        onMouseEnter={() => speak("AbleX")}
      >
        AbleX
        <SignInButton mode="modal" redirectUrl="/onboarding">
          <div className="glow-button">
            <button
              aria-label="Sign In to AbleX"
              onFocus={() => speak("Sign In")}
              onMouseEnter={() => speak("Sign In")}
            >
              Sign In
            </button>
          </div>
        </SignInButton>
      </div>

      <div
        className="hero"
        style={{ marginTop: "6rem", textAlign: "center" }}
      >
        <h1
          tabIndex={0}
          onFocus={() => speak("Inclusive Assessments for All")}
          onMouseEnter={() => speak("Inclusive Assessments for All")}
        >
          Inclusive Assessments for All
        </h1>
        <p
          tabIndex={0}
          onFocus={() => speak("Pastel perfect, tech powered, and accessibility first")}
          onMouseEnter={() => speak("Pastel perfect, tech powered, and accessibility first")}
        >
          Pastel-perfect, tech-powered, and accessibility-first.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "2rem",
          justifyContent: "center",
          marginTop: "4rem",
          flexWrap: "wrap",
        }}
      >
        <div
          className="glass-card"
          tabIndex={0}
          aria-label="Braille and screen reader support"
          onFocus={() => speak("Tactile and Verbal: Braille outputs, screen readers, and narration tools")}
          onMouseEnter={() => speak("Tactile and Verbal: Braille outputs, screen readers, and narration tools")}
        >
          <h2>🔠 Tactile & Verbal</h2>
          <p>Braille outputs, screen readers, and narration tools for low-vision learners.</p>
        </div>
        <div
          className="glass-card"
          tabIndex={0}
          aria-label="Focus friendly: AI simplification, focus mode"
          onFocus={() => speak("Focus Friendly: AI simplification, focus mode, and easy to understand layouts")}
          onMouseEnter={() => speak("Focus Friendly: AI simplification, focus mode, and easy to understand layouts")}
        >
          <h2>🎯 Focus Friendly</h2>
          <p>AI simplification, focus mode, and easy-to-understand layouts.</p>
        </div>
        <div
          className="glass-card"
          tabIndex={0}
          aria-label="Adaptive inputs: voice, sip and puff, keyboard, gaze tracking"
          onFocus={() => speak("Adaptive Inputs: Voice, sip and puff, keyboard, and gaze tracking integration")}
          onMouseEnter={() => speak("Adaptive Inputs: Voice, sip and puff, keyboard, and gaze tracking integration")}
        >
          <h2>💡 Adaptive Inputs</h2>
          <p>Voice, sip-and-puff, keyboard, and gaze tracking integration.</p>
        </div>
      </div>

      <div
        style={{
          marginTop: "5rem",
          textAlign: "center",
          fontSize: "0.95rem",
          color: "#666",
        }}
      >
        <p
          tabIndex={0}
          onFocus={() => speak("Copyright 2025 AbleX, designed with empathy, built with tech")}
          onMouseEnter={() => speak("Copyright 2025 AbleX, designed with empathy, built with tech")}
        >
          AbleX — Designed with empathy, built with tech 💜
        </p>
      </div>
    </div>
  );
}
