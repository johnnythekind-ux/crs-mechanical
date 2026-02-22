export async function POST(request: Request) {
  const body = await request.json();
  return new Response(
    JSON.stringify({ message: "Hello from backend", received: body }),
    { headers: { "Content-Type": "application/json" } }
  );
}

