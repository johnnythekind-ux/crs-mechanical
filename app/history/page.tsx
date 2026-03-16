"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ReportRow = {
  id: string;
  created_at: string;
  mode: string;
  topic: string;
  audience: string;
  tone: string;
  length: string;
};

export default function HistoryPage() {
  const [items, setItems] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/reports", { method: "GET" });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Failed to load reports");
        setItems([]);
      } else {
        setItems(data?.items ?? []);
      }
    } catch (e: any) {
      setError(e?.message ?? "Unexpected error");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <div style={{ marginBottom: 12 }}>
  <Link href="/" style={{ textDecoration: "underline" }}>
    Back to Builder
  </Link>
</div>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>History</h1>
      <p style={{ marginTop: 0, color: "#555" }}>
        Saved reports from Supabase (newest first).
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <a href="/" style={{ textDecoration: "underline" }}>← Back</a>
        <button
          onClick={load}
          disabled={loading}
          style={{ padding: "8px 12px", cursor: "pointer" }}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <pre style={{ marginTop: 16, padding: 12, background: "#ffecec", color: "#a40000" }}>
          Error: {error}
        </pre>
      )}

      {loading && !error && <p style={{ marginTop: 16 }}>Loading…</p>}

      {!loading && !error && (
        <div style={{ marginTop: 16 }}>
          {items.length === 0 ? (
            <p>No saved reports yet. Generate one on the home page first.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Created</th>
                  <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Topic</th>
                  <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Audience</th>
                  <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Mode</th>
                  <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>ID</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r.id}>
                    <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{r.topic}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{r.audience}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{r.mode}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #eee", fontFamily: "monospace" }}>
    <a href={`/reports/${r.id}`}>
  {r.id ? r.id : "ID IS UNDEFINED"}
</a>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </main>
  );
}