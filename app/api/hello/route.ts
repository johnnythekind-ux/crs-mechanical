import OpenAI from "openai";

export async function POST(request: Request) {
  const body = await request.json();

  const apiKey = process.env.OPENAI_API_KEY;
  console.log("OPENAI_API_KEY exists:", !!apiKey);
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Missing env var: OPENAI_API_KEY" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const client = new OpenAI({ apiKey });

  const prompt = body?.input ?? "Write a 3-sentence neutral report about the importance of testing in production.";

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You produce concise, structured, neutral reports." },
      { role: "user", content: prompt }
    ],
    temperature: 0.4
  });

  const text = completion.choices?.[0]?.message?.content ?? "";

  return new Response(
    JSON.stringify({ input: prompt, output: text }),
    { headers: { "Content-Type": "application/json" } }
  );
}
