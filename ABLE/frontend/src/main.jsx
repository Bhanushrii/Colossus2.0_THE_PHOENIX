// src/index.jsx

import React from "react";
import "./index.css";              // your global styles
import '@fontsource/opendyslexic'; // OpenDyslexic font

import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark, shadesOfPurple } from "@clerk/themes"; // base dark theme
import App from "./App.jsx";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!clerkPubKey) throw new Error("Missing Publishable Key");

ReactDOM.createRoot(document.getElementById("root")).render(
  <ClerkProvider
    publishableKey={clerkPubKey}
    routing="history"
    afterSignInUrl="/"
    afterSignUpUrl="/"
    appearance={{
      baseTheme: shadesOfPurple,
      variables: {
        // your new pastel‑teal primary
        colorPrimary: "#6ec6ca",
        colorPrimaryText: "#ffffff",
        // tweak backgrounds & inputs if you like
        colorBackground: "#1e1e1e",
        colorInputText: "#e0e0e0",
        colorInputPlaceholder: "#888888",
      },
      elements: {
        // style the Sign In button
        signInButton: {
          borderRadius: "30px",
          fontSize: "1rem",
        },
      },
    }}
  >
    <App />
  </ClerkProvider>
);
