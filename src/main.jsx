import React from "react"
import ReactDOM from "react-dom/client"
import { Analytics } from "@vercel/analytics/react"
import App from "./App.jsx"
import Privacy from "./Privacy.jsx"

const path = window.location.pathname;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {path === "/privacy" ? <Privacy /> : <App />}
    <Analytics />
  </React.StrictMode>,
)
