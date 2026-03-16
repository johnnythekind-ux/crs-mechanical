"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

const markdownComponents = {
  h1: ({ children }: any) => (
    <h1 style={{ fontSize: "2rem", marginBottom: "1rem", lineHeight: 1.2 }}>
      {children}
    </h1>
  ),

  h2: ({ children }: any) => (
    <h2
      style={{
        fontSize: "1.4rem",
        marginTop: "2rem",
        marginBottom: "0.75rem",
        lineHeight: 1.3,
      }}
    >
      {children}
    </h2>
  ),

  p: ({ children }: any) => (
    <p style={{ lineHeight: 1.7, marginBottom: "1rem" }}>{children}</p>
  ),

  ul: ({ children }: any) => (
    <ul style={{ paddingLeft: "1.4rem", marginBottom: "1rem" }}>{children}</ul>
  ),

  li: ({ children }: any) => (
    <li style={{ marginBottom: "0.4rem", lineHeight: 1.6 }}>{children}</li>
  ),

  strong: ({ children }: any) => (
    <strong style={{ fontWeight: 700 }}>{children}</strong>
  ),
};

export default function Home() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("Clear & Practical");
  const [length, setLength] = useState("Medium");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const disabled = loading || !topic.trim() || !audience.trim();

  async function generate() {
  if (loading) return;

  if (!topic.trim()) {
    alert("Please enter a topic.");
    return;
  }

  if (topic.length > 300) {
    alert("Topic is too long.");
    return;
  }

  if (!audience.trim()) {
    alert("Please enter an audience.");
    return;
  }

  setLoading(true);
  setError(null);
  setResult(null);

  try {
      const res = await fetch("/api/generate", {
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

  function clearForm() {
  setTopic("");
  setAudience("");
  setTone("Clear & Practical");
  setLength("Medium");
  setNotes("");
  setResult(null);
  setError(null);
}

  return (
    <main
  style={{
    maxWidth: 900,
    margin: "40px auto",
    padding: 24,
    fontFamily: "system-ui, sans-serif",
  }}
>
      <h1 style={{ fontSize: 32, marginBottom: 6 }}>ReportForge — AI Report Builder</h1>

      <p style={{ marginTop: 0, marginBottom: 28, color: "#555" }}>
        Turn your topic into a structured AI-generated report in seconds.
      </p>

      <section style={{ marginTop: 8 }}>
  <div
    style={{
      padding: 24,
      border: "1px solid #e5e5e5",
      borderRadius: 16,
      background: "#fff",
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    }}
  >

      <div style={{ display: "grid", gap: 12 }}>
        <label>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Topic (required)</div>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., How schools should use AI tools"
            style={{ width: "100%", padding: 10, fontSize: 14 }}
          />
        </label>

        <label>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Audience (required)</div>
          <input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g., School administrators or product managers"
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
            placeholder="Add context, constraints, or goals..."
            rows={6}
            style={{ width: "100%", padding: 12, fontSize: 14 }}
          />
        </label>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 12, alignItems: "center" }}>
  <button
    onClick={generate}
    disabled={disabled}
    style={{ padding: "10px 14px", fontSize: 14, cursor: disabled ? "not-allowed" : "pointer" }}
  >
    {loading ? "Generating..." : "Generate Report"}
  </button>

  <button
    onClick={clearForm}
    disabled={loading}
    style={{ padding: "10px 14px", fontSize: 14, cursor: "pointer" }}
  >
    Clear
  </button>

  <Link
  href="/history"
  className="text-sm underline underline-offset-4"
  style={{ padding: "10px 14px" }}
>
    View History
  </Link>
</div>

      {error && (
        <pre style={{ marginTop: 16, padding: 12, background: "#ffecec", color: "#a40000", whiteSpace: "pre-wrap" }}>
          Error: {error}
        </pre>
      )}
    </div>
  
</section>

      {result?.report && (
  <section style={{ marginTop: 36 }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
      }}
    >
      <h2 style={{ margin: 0, fontSize: 20 }}>Generated Report</h2>
      <span style={{ fontSize: 13, color: "#666" }}>AI-generated preview</span>
    </div>

    <div
      style={{
        padding: 28,
        border: "1px solid #e5e5e5",
        borderRadius: 16,
        background: "#fff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <ReactMarkdown components={markdownComponents}>
        {result.report}
      </ReactMarkdown>
    </div>
  </section>
)}

    </main>
  );
}