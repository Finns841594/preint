"use client";
import { useState, useEffect } from "react";

import { title } from "@/components/primitives";
import { ChartAreaGradient } from "@/components/AreaChartDemo";
import { ChartData, ServerEvent } from "@/types";
import { ChartBarLabelCustom } from "@/components/BarChartDemo";
import { ChartPieLabelList } from "@/components/PieChartDemo";
import { EventTable } from "@/components/EventTable";

const MAX_EVENTS_IN_TABLE_STATE = 100;

export default function Home() {
  const [chartStreamData, setChartStreamData] = useState<ChartData[]>([]);
  const [eventTableStreamData, setEventTableStreamData] = useState<
    ServerEvent[]
  >([]);

  useEffect(() => {
    const eventSource = new EventSource("/api/stream");

    eventSource.addEventListener("chartDataUpdate", (event) => {
      try {
        const parsed: ChartData = JSON.parse(event.data);

        setChartStreamData((prev) => [...prev.slice(-29), parsed]);
      } catch (error) {
        console.error("Failed to parse chart data:", error);
      }
    });

    eventSource.addEventListener("newServerEvent", (event) => {
      try {
        const newEvent: ServerEvent = JSON.parse(event.data);

        setEventTableStreamData((prevEvents) => {
          const updatedEvents = [newEvent, ...prevEvents];

          if (updatedEvents.length > MAX_EVENTS_IN_TABLE_STATE + 20) {
            // Keep a buffer
            return updatedEvents.slice(0, MAX_EVENTS_IN_TABLE_STATE);
          }

          return updatedEvents;
        });
      } catch (error) {
        console.error("Failed to parse server event data for table:", error);
      }
    });

    eventSource.onerror = (error) => {
      console.error("EventSource failed for chart data:", error);
      eventSource.close();
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

      <div className="flex justify-between w-full gap-4">
        <ChartAreaGradient data={chartStreamData} />
        <ChartBarLabelCustom />
        <ChartPieLabelList />
      </div>
      <div className="w-full">
        <EventTable data={eventTableStreamData} />
      </div>
    </section>
  );
}
