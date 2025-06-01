"use client";
import { useState, useEffect } from "react";

import { title } from "@/components/primitives";
import { ChartAreaGradient } from "@/components/ChartGraph";
import { ChartData } from "@/types";

export default function Home() {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("/api/stream");

    eventSource.onmessage = (event) => {
      const parsed: ChartData = JSON.parse(event.data);

      setData((prev) => [...prev.slice(-19), parsed]); // keep last 20 points
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Make&nbsp;</span>
        <span className={title({ color: "violet" })}>beautiful&nbsp;</span>
        <br />
        <span className={title()}>
          websites regardless of your design experience.
        </span>
      </div>

      <div className="flex gap-3">
        <ChartAreaGradient data={data} />
      </div>
    </section>
  );
}
