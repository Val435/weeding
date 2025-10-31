import { BrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import OrientationLock from "./components/OrientationLock.jsx";
import { GuestProvider } from "./GuestContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GuestProvider>
      <OrientationLock>
        <App />
      </OrientationLock>
    </GuestProvider>
  </BrowserRouter>
);
