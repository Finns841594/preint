"use client";
import { useState, useEffect } from "react";

import { title } from "@/components/primitives";
import { ChartAreaGradient } from "@/components/AreaChartDemo";
import { ChartData } from "@/types";
import { ChartBarLabelCustom } from "@/components/BarChartDemo";
import { ChartPieLabelList } from "@/components/PieChartDemo";

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
    <section className="flex flex-col items-center justify-center gap-8">
      <div className="inline-block max-w-xl text-start self-start">
        <span className={title()}>Dashboard&nbsp;</span>
      </div>

      <div className="flex gap-3">
        <ChartAreaGradient data={data} />
        <ChartBarLabelCustom />
        <ChartPieLabelList />
      </div>
    </section>
  );
}
