"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef, useState } from "react";

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

  const [buildStep, setBuildStep] = useState(0);

  const resultRef = useRef<HTMLDivElement | null>(null);

  const disabled = loading || !topic.trim() || !audience.trim();
  
  useEffect(() => {
  if (result?.report && resultRef.current) {
    resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}, [result]);

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
  setBuildStep(1);

setTimeout(() => setBuildStep(2), 1200);
setTimeout(() => setBuildStep(3), 2200);
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
  setResult(null);
} else {
        setResult(data);
      }
    } catch (e: any) {
  setError(e?.message ?? "Unexpected error");
  setResult(null);
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
const exportPDF = async () => {
  const element = document.getElementById("report-content");

  if (!element) {
    alert("No report found to export");
    return;
  }

  const html2pdf = (await import("html2pdf.js")).default;

  const opt = {
    margin: [20, 20, 20, 20] as [number, number, number, number],
    filename: "report.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(opt).from(element).save();
};

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
      padding: 28,
      border: "1px solid #e5e5e5",
      borderRadius: 16,
      background: "#fff",
      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    }}
  >

      <div style={{ display: "grid", gap: 20 }}>
        <label>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Topic (required)</div>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., How schools should use AI tools"
            style={{
  width: "100%",
  padding: 12,
  fontSize: 14,
  border: "1px solid #d1d5db",
  borderRadius: 10,
  background: "#ffffff",
  outline: "none",
}}
          />
        </label>

        <label>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Audience (required)</div>
          <input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g., School administrators or product managers"
            style={{
  width: "100%",
  padding: 12,
  fontSize: 14,
  border: "1px solid #d1d5db",
  borderRadius: 10,
  background: "#ffffff",
  outline: "none",
}}
          />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <label>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Tone</div>
            <select value={tone} onChange={(e) => setTone(e.target.value)} style={{
  width: "100%",
  padding: 12,
  fontSize: 14,
  border: "1px solid #d1d5db",
  borderRadius: 10,
  background: "#ffffff",
  outline: "none",
}}>
              <option>Clear & Practical</option>
              <option>Professional</option>
              <option>Friendly Coach</option>
              <option>Direct / No-Fluff</option>
            </select>
          </label>

          <label>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Length</div>
            <select value={length} onChange={(e) => setLength(e.target.value)} style={{
  width: "100%",
  padding: 12,
  fontSize: 14,
  border: "1px solid #d1d5db",
  borderRadius: 10,
  background: "#ffffff",
  outline: "none",
}}>
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
            rows={8}
            style={{
  width: "100%",
  padding: 12,
  fontSize: 14,
  border: "1px solid #d1d5db",
  borderRadius: 10,
  background: "#ffffff",
  outline: "none",
}}
          />
        </label>
      </div>

      <div style={{ marginTop: 28, display: "flex", gap: 16, alignItems: "center" }}>
  <button
    onClick={generate}
    disabled={disabled}
    style={{
      padding: "10px 16px",
      fontSize: 14,
      fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer",
      background: disabled ? "#9ca3af" : "#111827",
      color: "#ffffff",
      border: "none",
      borderRadius: 8,
    }}
  >
    <>
  {loading && (
    <span
      style={{
        display: "inline-block",
        width: 14,
        height: 14,
        border: "2px solid rgba(255,255,255,0.5)",
        borderTopColor: "#ffffff",
        borderRadius: "50%",
        marginRight: 8,
        verticalAlign: "middle",
        animation: "rf-spin 0.8s linear infinite",
      }}
    />
  )}
  {loading ? "Generating..." : result ? "Generate Again" : "Generate Report"}
</>
  </button>

  {loading && (
  <div style={{ marginTop: 12, fontSize: 13, color: "#6b7280" }}>
    <div>Building report...</div>

    {buildStep >= 1 && <div>✔ Structuring outline</div>}
    {buildStep >= 2 && <div>✔ Writing executive summary</div>}
    {buildStep >= 3 && <div>✔ Generating key points</div>}
  </div>
)}

  <button
    onClick={clearForm}
    disabled={loading}
    style={{
  padding: "10px 16px",
  fontSize: 14,
  fontWeight: 500,
  cursor: loading ? "not-allowed" : "pointer",
  background: "#f3f4f6",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  opacity: loading ? 0.7 : 1
}}
  >
    Clear
  </button>

  <Link
    href="/history"
    className="text-sm underline underline-offset-4"
    style={{
  padding: "6px 2px",
  color: "#2563eb",
  display: "inline-block"
}}
  >
    View History
  </Link>
</div>

{!result && !loading && !error && (
  <p
    style={{
      marginTop: 16,
      color: "#6b7280",
      fontSize: 15,
      textAlign: "center"
    }}
  >
    Enter a topic to generate your first report.
  </p>
)}

      {error && (
        <pre style={{ marginTop: 16, padding: 12, background: "#ffecec", color: "#a40000", whiteSpace: "pre-wrap" }}>
          Error: {error}
        </pre>
      )}
    </div>
  
</section>

      {result?.report && (
  <section ref={resultRef} style={{ marginTop: 48 }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
      }}
    >
      <h2 style={{ margin: 0, fontSize: 20 }}>Generated Report</h2>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 12 }}>
  <button
    onClick={() => {
      if (!result?.report) return;

      const text =
        document.getElementById("report-content")?.innerText || "";

      navigator.clipboard.writeText(text);
      alert("Copied to clipboard");
    }}
    style={{
      padding: "8px 12px",
      fontSize: 13,
      borderRadius: 8,
      border: "1px solid #d1d5db",
      background: "#fff",
      cursor: "pointer",
    }}
  >
    Copy Report
  </button>

  <button
    onClick={exportPDF}
    style={{
      padding: "8px 12px",
      fontSize: 13,
      borderRadius: 8,
      border: "1px solid #d1d5db",
      background: "#fff",
      cursor: "pointer",
    }}
  >
    Export PDF
  </button>
</div>
      <span style={{ fontSize: 13, color: "#6b7280" }}>AI-generated preview</span>
    </div>

    <div
      style={{
        padding: 28,
        border: "1px solid #e5e5e5",
        borderRadius: 16,
        background: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div id="report-content">
  <ReactMarkdown components={markdownComponents}>
    {result.report}
  </ReactMarkdown>
</div>
    </div>
  </section>
)}
<style jsx>{`
  @keyframes rf-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`}</style>
    </main>
  );
}