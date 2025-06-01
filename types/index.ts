import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type ChartData = {
  timestamp: string;
  value1: string;
  value2: string;
};

export type ServerEvent = {
  id: string;
  timestamp: string;
  type: "API Request" | "User Login" | "System Update" | "ErrorLog";
  message: string;
  status: "success" | "error" | "info" | "warning";
};
