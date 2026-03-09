"use client";

import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("Clear & Practical");
  const [length, setLength] = useState("Medium");
  const [notes, setNotes] = useState("");

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

        // ✅ This is the “request body”
        // It’s the data we are sending TO the server.
        body: JSON.stringify({ topic, audience, tone, length, notes }),
      });

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

  // Disable Generate if topic/audience missing
  const disabled =
    loading ||
    topic.trim().length === 0 ||
    audience.trim().length === 0;

  return (
    <main style={{ maxWidth: 820, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>CRS Mechanical — AI Report Builder (Mock)</h1>

      <p style={{ marginTop: 0, color: "#555" }}>
        Fill the fields → click Generate → backend returns mock report + JSON.
      </p>

      <div style={{ display: "grid", gap: 12 }}>
        <label>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Topic (required)</div>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Building powerful apps"
            style={{ width: "100%", padding: 10, fontSize: 14 }}
          />
        </label>

        <label>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Audience (required)</div>
          <input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g., Novice developer / Non-technical founder"
            style={{ width: "100%", padding: 10, fontSize: 14 }}
          />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Tone</div>
            <select value={tone} onChange={(e) => setTone(e.target.value)} style={{ width: "100%", padding: 10, fontSize: 14 }}>
              <option>Clear & Practical</option>
              <option>Professional</option>
              <option>Friendly Coach</option>
              <option>Direct / No-Fluff</option>
            </select>
          </label>

          <label>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Length</div>
            <select value={length} onChange={(e) => setLength(e.target.value)} style={{ width: "100%", padding: 10, fontSize: 14 }}>
              <option>Short</option>
              <option>Medium</option>
              <option>Long</option>
            </select>
          </label>
        </div>

        <label>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Notes / Situation</div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Extra context here..."
            rows={6}
            style={{ width: "100%", padding: 12, fontSize: 14 }}
          />
        </label>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
        <button
          onClick={generate}
          disabled={disabled}
          style={{ padding: "10px 14px", fontSize: 14, cursor: disabled ? "not-allowed" : "pointer" }}
        >
          {loading ? "Generating..." : "Generate Report"}
        </button>

        <button
          onClick={() => {
            setTopic("");
            setAudience("");
            setTone("Clear & Practical");
            setLength("Medium");
            setNotes("");
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
        <pre style={{ marginTop: 16, padding: 12, background: "#ffecec", color: "#a40000", whiteSpace: "pre-wrap" }}>
          Error: {error}
        </pre>
      )}

      {result?.report && (
        <>
          <h2 style={{ marginTop: 18, marginBottom: 8, fontSize: 18 }}>Report</h2>
          <pre style={{ padding: 12, background: "#f4f4f4", whiteSpace: "pre-wrap" }}>
            {result.report}
          </pre>
        </>
      )}

      {result && (
        <>
          <h2 style={{ marginTop: 18, marginBottom: 8, fontSize: 18 }}>Full JSON</h2>
          <pre style={{ padding: 12, background: "#f4f4f4", whiteSpace: "pre-wrap" }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </>
      )}
    </main>
  );
}