import { useEffect, useState } from "react";

export default function App() {
  const [hello, setHello] = useState(null);
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/hello").then((r) => r.json()),
      fetch("/api/health").then((r) => r.json()),
    ])
      .then(([h, s]) => {
        setHello(h);
        setHealth(s);
      })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <main className="container">
      <h1>AI Workshop Template</h1>
      <p className="subtitle">React + Express + Sequelize, deployable free on Render.</p>

      <section className="card">
        <h2>/api/hello</h2>
        <pre>{hello ? JSON.stringify(hello, null, 2) : "loading…"}</pre>
      </section>

      <section className="card">
        <h2>/api/health</h2>
        <pre>{health ? JSON.stringify(health, null, 2) : "loading…"}</pre>
      </section>

      {error && <p className="error">Error: {error}</p>}
    </main>
  );
}
