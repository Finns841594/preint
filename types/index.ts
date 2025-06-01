import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type ChartData = {
  timestamp: string;
  value1: string;
  value2: string;
};
