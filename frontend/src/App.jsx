import { useEffect, useState } from "react";

function useEndpoint(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(path, { cache: "no-store" })
      .then(async (r) => {
        const text = await r.text();
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}: ${text.slice(0, 120)}`);
        try {
          return JSON.parse(text);
        } catch {
          throw new Error(`Non-JSON response: ${text.slice(0, 120)}`);
        }
      })
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, [path]);

  return { data, error };
}

function Endpoint({ path }) {
  const { data, error } = useEndpoint(path);
  return (
    <section className="card">
      <h2>{path}</h2>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {error && <pre className="error">{error}</pre>}
      {!data && !error && <pre>loading…</pre>}
    </section>
  );
}

export default function App() {
  return (
    <main className="container">
      <h1>AI Workshop Template</h1>
      <p className="subtitle">React + Express + Sequelize, deployable free on Render.</p>
      <Endpoint path="/api/hello" />
      <Endpoint path="/api/health" />
    </main>
  );
}
