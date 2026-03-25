import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            background: "#ffffff",
            color: "#1c1917",
            border: "1px solid #e7e5e4",
            borderRadius: "16px",
            padding: "14px 16px",
          },
        }}
      />
    </>
  </React.StrictMode>
);