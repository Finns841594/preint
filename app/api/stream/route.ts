import { NextRequest } from "next/server";

import { generateRandomEvent } from "@/app/devData";

export const GET = async (req: NextRequest) => {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  const sendEvent = (eventName: string, data: any) => {
    writer.write(encoder.encode(`event: ${eventName}\n`));
    writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  };

  const interval = setInterval(() => {
    const chartData = {
      timestamp: new Date().toISOString(),
      value1: Math.random().toFixed(3),
      value2: Math.random().toFixed(3),
    };

    sendEvent("chartDataUpdate", chartData);

    if (Math.random() > 0.3) {
      const serverEventData = generateRandomEvent();

      sendEvent("newServerEvent", serverEventData);
    }
  }, 1000);

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
};
