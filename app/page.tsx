"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/hello", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      // Safer: handle cases where response isn't JSON
      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }

      if (!res.ok) {
        setError(data?.error ?? `Request failed (HTTP ${res.status})`);
      } else {
        setResult(data);
      }
    } catch (e: any) {
      setError(e?.message ?? "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "40px auto",
        padding: 16,
        fontFamily: "system-ui",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>
        CRS Mechanical — AI Report Builder (Mock)
      </h1>

      <p style={{ marginTop: 0, color: "#555" }}>
        Type input → click Generate → backend returns mock report.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste a situation/problem here..."
        rows={6}
        style={{ width: "100%", padding: 12, fontSize: 14 }}
      />

      <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
        <button
          onClick={generate}
          disabled={loading || input.trim().length === 0}
          style={{ padding: "10px 14px", fontSize: 14, cursor: "pointer" }}
        >
          {loading ? "Generating..." : "Generate Report"}
        </button>

        <button
          onClick={() => {
            setInput("");
            setResult(null);
            setError(null);
          }}
          disabled={loading}
          style={{ padding: "10px 14px", fontSize: 14, cursor: "pointer" }}
        >
          Clear
        </button>
      </div>

      {error && (
        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: "#ffecec",
            color: "#a40000",
            whiteSpace: "pre-wrap",
          }}
        >
          Error: {error}
        </pre>
      )}

      {/* Nice: show report text prominently if it exists */}
      {result?.report && (
        <>
          <h2 style={{ marginTop: 18, marginBottom: 8, fontSize: 18 }}>
            Report
          </h2>
          <pre
            style={{
              padding: 12,
              background: "#f4f4f4",
              whiteSpace: "pre-wrap",
            }}
          >
            {result.report}
          </pre>
        </>
      )}

      {/* Still keep full JSON for debugging/verification */}
      {result && (
        <>
          <h2 style={{ marginTop: 18, marginBottom: 8, fontSize: 18 }}>
            Full JSON
          </h2>
          <pre
            style={{
              padding: 12,
              background: "#f4f4f4",
              whiteSpace: "pre-wrap",
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        </>
      )}
    </main>
  );
}