import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  const encoder = new TextEncoder();

  const interval = setInterval(() => {
    const data = {
      timestamp: new Date().toISOString(),
      value1: Math.random().toFixed(3),
      value2: Math.random().toFixed(3),
    };

    writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  }, 1000);

  // Automatically stop streaming when the connection is closed
  req.signal.addEventListener("abort", () => {
    clearInterval(interval);
    writer.close();
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
