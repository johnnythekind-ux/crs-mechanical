import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

const rawTopic = body?.topic
const rawAudience = body?.audience
const rawTone = body?.tone
const rawLength = body?.length
const rawNotes = body?.notes

const topic = typeof rawTopic === "string" ? rawTopic.trim() : ""
const audience = typeof rawAudience === "string" ? rawAudience.trim() : ""
const tone = typeof rawTone === "string" ? rawTone.trim() : ""
const length = typeof rawLength === "string" ? rawLength.trim() : ""
const notes = typeof rawNotes === "string" ? rawNotes.trim() : ""

    if (!topic || !audience || !tone || !length) {
  return NextResponse.json(
    { error: "Missing required fields." },
    { status: 400 }
  )
}

if (topic.length < 4) {
  return NextResponse.json(
    { error: "Topic must be more specific." },
    { status: 400 }
  )
}

if (topic.length > 300) {
  return NextResponse.json(
    { error: "Topic is too long." },
    { status: 400 }
  )
}

if (audience.length > 120) {
  return NextResponse.json(
    { error: "Audience is too long." },
    { status: 400 }
  )
}

if (notes.length > 1000) {
  return NextResponse.json(
    { error: "Notes are too long." },
    { status: 400 }
  )
}

    const prompt = `
You are a professional report writer.

Your job is to create a practical, useful report based only on the user's inputs.

USER INPUTS
Topic: ${topic}
Audience: ${audience}
Tone: ${tone}
Length: ${length}
Notes: ${notes || "(none)"}

INSTRUCTIONS
- Write clearly for the stated audience.
- Match the requested tone.
- If the topic is vague, unclear, or possibly misspelled, do not invent false facts.
- Instead, acknowledge the uncertainty and give a practical evaluation framework, clarification guidance, or next-step recommendations.
- Keep the report grounded, professional, and useful.
- Do not pretend to know hidden facts.
- Do not use filler.
- Use markdown headings.

OUTPUT STRUCTURE
# Title

## Executive Summary
A short summary of the situation.

## Key Points
3 to 5 practical bullet points.

## Recommended Next Steps
Concrete next actions.

## Final Recommendation
A short closing recommendation.
`

    const response = await openai.responses.create({
      model: "gpt-5.4",
      input: prompt,
    })

    const generatedReport = response.output_text?.trim()

if (!generatedReport) {
  return NextResponse.json(
    { error: "The AI did not return a usable report." },
    { status: 500 }
  )
}

    const { data, error } = await supabase
      .from("reports")
      .insert([
        {
          mode: "openai",
          topic,
          audience,
          tone,
          length,
          notes,
          report: generatedReport,
        },
      ])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      {
        mode: "openai",
        report: generatedReport,
        saved: data?.[0] ?? null,
      },
      { status: 200 }
    )
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unexpected server error" },
      { status: 500 }
    )
  }
}