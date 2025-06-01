"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useMemo, useState } from "react";
import { Select, SelectItem } from "@heroui/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartData } from "@/types";

export const description = "An area chart with gradient fill";

const chartConfig = {
  value1: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  value2: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface ChartAreaGradientProps {
  data: ChartData[];
}

const fitlerOpitions = [
  "last minute",
  "last 5 minutes",
  "last 10 minutes",
  "last 30 minutes",
];

export const ChartAreaGradient = ({ data }: ChartAreaGradientProps) => {
  const [selectedKeys, setSelectedKeys] = useState(["last minute"]);

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
    [selectedKeys],
  );

  return (
    <Card className="w-[500px] flex flex-col justify-between">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>Total visit</CardTitle>
          <CardDescription>
            Showing total visitors for the past minutes
          </CardDescription>
        </div>
        <Select
          className="w-[150px]"
          defaultSelectedKeys={["last minute"]}
          value={selectedValue}
          onChange={(event) => setSelectedKeys([event.target.value])}
        >
          {fitlerOpitions.map((opition) => (
            <SelectItem key={opition}>{opition}</SelectItem>
          ))}
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 6,
              right: 6,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="timestamp"
              tickFormatter={(value) => value.slice(14, 19)}
              tickLine={false}
              tickMargin={8}
            />
            <YAxis tick={{ fontSize: 10 }} width={20} />
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
            <defs>
              <linearGradient id="fillDesktop" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-1))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-1))"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-2))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-2))"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="value1"
              fill="url(#fillMobile)"
              fillOpacity={0.4}
              isAnimationActive={false}
              stackId="a"
              stroke="hsl(var(--chart-2))"
              type="natural"
            />
            <Area
              dataKey="value2"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              isAnimationActive={false}
              stackId="a"
              stroke="hsl(var(--chart-1))"
              type="natural"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% today <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              May 2025
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
