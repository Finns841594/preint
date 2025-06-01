"use client";
import { useState, useEffect } from "react";
import { addToast } from "@heroui/toast";

import { title } from "@/components/primitives";
import { ChartAreaGradient } from "@/components/AreaChartDemo";
import { ChartData, ServerEvent } from "@/types";
import { ChartBarLabelCustom } from "@/components/BarChartDemo";
import { ChartPieLabelList } from "@/components/PieChartDemo";
import { EventTable } from "@/components/EventTable";

const MAX_EVENTS_IN_TABLE_STATE = 100;
const MAX_CHART_DATA_POINTS = 30;

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

        setChartStreamData((prev) => [
          ...prev.slice(-MAX_CHART_DATA_POINTS),
          parsed,
        ]);
      } catch (error) {
        addToast({
          title: "Error",
          description: "Failed to parse chart data: " + error,
        });
      }
    });

    eventSource.addEventListener("newServerEvent", (event) => {
      try {
        const newEvent: ServerEvent = JSON.parse(event.data);

        setEventTableStreamData((prevEvents) => {
          const updatedEvents = [newEvent, ...prevEvents];

          if (updatedEvents.length > MAX_EVENTS_IN_TABLE_STATE + 20) {
            return updatedEvents.slice(0, MAX_EVENTS_IN_TABLE_STATE);
          }

          return updatedEvents;
        });
      } catch (error) {
        addToast({
          title: "Error",
          description: "Failed to parse new server event: " + error,
        });
      }
    });

    eventSource.onerror = (error) => {
      addToast({
        title: "Error",
        description: "An error occurred with the event stream: " + error,
      });
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
