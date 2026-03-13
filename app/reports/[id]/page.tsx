import ReactMarkdown from "react-markdown"
import type { Components } from "react-markdown"
import { createClient } from "@supabase/supabase-js";


const markdownComponents = {
  h1: ({children}: any) => (
    <h1 style={{fontSize: "2rem", marginBottom: "1rem"}}>
      {children}
    </h1>
  ),

  h2: ({children}: any) => (
    <h2 style={{fontSize: "1.4rem", marginTop: "2rem", marginBottom: "0.75rem"}}>
      {children}
    </h2>
  ),

  p: ({children}: any) => (
    <p style={{lineHeight: 1.7, marginBottom: "1rem"}}>
      {children}
    </p>
  ),

  ul: ({children}: any) => (
    <ul style={{paddingLeft: "1.4rem", marginBottom: "1rem"}}>
      {children}
    </ul>
  ),

  li: ({children}: any) => (
    <li style={{marginBottom: "0.4rem", lineHeight: 1.6}}>
      {children}
    </li>
  )
};

export default async function ReportPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const resolvedParams = await Promise.resolve(params as any);
const id = resolvedParams?.id;

  // 1) Guard: if id is missing, show a clear message instead of querying Supabase
  if (!id) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Report ID missing</h2>
        <p>
          The route param <code>id</code> was undefined. This page must be visited
          as <code>/reports/&lt;uuid&gt;</code>.
        </p>
      </div>
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  // 2) Guard: env vars
  if (!supabaseUrl || !serviceRoleKey) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Server env missing</h2>
        <p>
          Missing <code>NEXT_PUBLIC_SUPABASE_URL</code> or{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code>.
        </p>
      </div>
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // 3) Fetch single report by id
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Supabase error</h2>
        <pre>{JSON.stringify(error, null, 2)}</pre>
        <p>
          Tried to load report id: <code>{id}</code>
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Report not found</h2>
        <p>
          No report exists with id: <code>{id}</code>
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <h1 style={{ marginBottom: 8 }}>Report</h1>

      <div style={{ opacity: 0.7, marginBottom: 16 }}>
        <div>
          <strong>ID:</strong> <code>{data.id}</code>
        </div>
        <div>
          <strong>Created:</strong>{" "}
          {data.created_at ? new Date(data.created_at).toLocaleString() : "—"}
        </div>
        <div>
          <strong>Mode:</strong> {data.mode ?? "—"}
        </div>
      </div>

      <h3>Topic</h3>
      <p>{data.topic ?? "—"}</p>

      <h3>Audience</h3>
      <p>{data.audience ?? "—"}</p>

      <h3>Tone</h3>
      <p>{data.tone ?? "—"}</p>

      <h3>Length</h3>
      <p>{data.length ?? "—"}</p>

      <h3>Full Report</h3>
<div
  style={{
    padding: 24,
    border: "1px solid #eee",
    borderRadius: 12,
    maxWidth: 850,
    background: "#fff",
  }}
>
  <ReactMarkdown components={markdownComponents}>
  {data.report ?? "-"}
</ReactMarkdown>
</div>
</div>
  );
  }
