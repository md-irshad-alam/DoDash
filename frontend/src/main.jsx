import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <LoadScript
      googleMapsApiKey="AIzaSyAiiDBGPzxjgiXjurf7uAT8o98p8iT3J30"
      libraries={["places"]}
    > */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* </LoadScript> */}
  </StrictMode>
);
