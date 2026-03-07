import { useState } from "react";

const PASS = "itsabouttime";
const KEY = "gate_unlocked";

export default function Gate({ children }) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(KEY) === "1");
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  if (unlocked) return children;

  const submit = (e) => {
    e.preventDefault();
    if (value === PASS) {
      sessionStorage.setItem(KEY, "1");
      setUnlocked(true);
    } else {
      setError(true);
      setValue("");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#0A0A0A",
      color: "#fff",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      <p style={{
        fontSize: "13px",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.4)",
        marginBottom: "32px",
      }}>
        Coming soon
      </p>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <input
          type="password"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false); }}
          placeholder="Password"
          autoFocus
          style={{
            padding: "12px 20px",
            borderRadius: "8px",
            border: `1px solid ${error ? "rgba(255,80,80,0.5)" : "rgba(255,255,255,0.15)"}`,
            background: "rgba(255,255,255,0.05)",
            color: "#fff",
            fontSize: "15px",
            outline: "none",
            width: "240px",
            textAlign: "center",
          }}
        />
      </form>
    </div>
  );
}
