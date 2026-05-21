import { useEffect, useState } from "react";

function useApi(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(path)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  return { data, error, loading };
}

function Card({ title, state }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {state.loading && <p className="muted">loading…</p>}
      {state.error && <p className="error">error: {state.error}</p>}
      {state.data && <pre>{JSON.stringify(state.data, null, 2)}</pre>}
    </div>
  );
}

export default function App() {
  const hello = useApi("/api/hello");
  const health = useApi("/api/health");

  return (
    <main>
      <h1>AI Workshop Template</h1>
      <p className="muted">React + Express + Sequelize</p>
      <Card title="/api/hello" state={hello} />
      <Card title="/api/health" state={health} />
    </main>
  );
}
