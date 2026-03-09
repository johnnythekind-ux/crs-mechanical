import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.json()

  const { topic, audience, tone, length, notes } = body

  const mockReport = `MOCK REPORT
Topic: ${topic}
Audience: ${audience}
Tone: ${tone}
Length: ${length}

Summary:
You are building a report builder by locking the full-stack loop first.

Key Points:
- UI collects structured inputs
- API validates and returns consistent JSON
- Mock mode keeps things stable while you build layers

Notes Received:
${notes || "(none)"}

Next Step:
Database save active.`

  const { data, error } = await supabase
    .from("reports")
    .insert([
  {
    mode: "database",
    topic,
    audience,
    tone,
    length,
    notes,
    report: mockReport,
  },
])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    mode: "database",
    report: mockReport,
    saved: data[0],
  })
}