import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";

// css
// ✅ Bootstrap imports (order matters)
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap"; // 👈 this line must come AFTER css

// Optional: log to verify it's loaded
console.log("Bootstrap loaded:", bootstrap);
import App from './App.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </StrictMode>,
)
