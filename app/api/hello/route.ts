export async function POST(request: Request) {
  const body = await request.json();

  const mockReport =
    `MOCK REPORT:\n` +
    `Input received: ${body.input ?? "(no input provided)"}\n\n` +
    `Summary: You are building disciplined infrastructure execution by shipping, breaking, and fixing.\n` +
    `Next step: Add billing later to enable real AI output.`;

  return new Response(
    JSON.stringify({
      mode: "mock",
      report: mockReport,
      received: body,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
