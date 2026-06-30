import React from "react"
import ReactDOM from "react-dom/client"
import { Analytics } from "@vercel/analytics/react"
import App from "./App.jsx"
import Privacy from "./Privacy.jsx"
import Terms from "./Terms.jsx"

const path = window.location.pathname;

const canonical = document.querySelector('link[rel="canonical"]');
if (canonical) {
  canonical.setAttribute("href", "https://getantiviral.app" + (path || "/"));
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {path === "/terms" ? <Terms /> : path === "/privacy" ? <Privacy /> : <App />}
    <Analytics />
  </React.StrictMode>,
)
