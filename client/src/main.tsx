import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeApp } from "firebase/app";

// Initialize Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || ""}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || ""}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

// Initialize Firebase if keys are provided
if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId) {
  initializeApp(firebaseConfig);
}

// Set document title
document.title = "VeriForum - KI-gestütztes Forum für Verschwörungstheorien";

// Create a meta description tag
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'Ein KI-gestütztes Forum für die kritische Analyse von Verschwörungstheorien vom 18. bis 21. Jahrhundert.';
document.head.appendChild(metaDescription);

// Add Google Fonts
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

// Add Material Icons
const iconLink = document.createElement('link');
iconLink.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
iconLink.rel = 'stylesheet';
document.head.appendChild(iconLink);

// Render the app
createRoot(document.getElementById("root")!).render(<App />);
