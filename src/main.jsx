import { BrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GuestProvider } from "./GuestContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GuestProvider>
      <App />
    </GuestProvider>
  </BrowserRouter>
);
