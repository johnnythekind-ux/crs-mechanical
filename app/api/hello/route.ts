export async function POST(request: Request) {
  const body = await request.json();

  const required = process.env.CRS_TEST_SECRET;
  if (!required) {
    return new Response(
      JSON.stringify({
        error: "Missing env var: CRS_TEST_SECRET",
        hint: "Set CRS_TEST_SECRET in Vercel environment variables"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Hello from backend",
      received: body,
      secretPresent: true
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
