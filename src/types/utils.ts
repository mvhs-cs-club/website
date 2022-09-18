export interface PointHistory {
  date: string;
  timestamp: number;
  reason: string;
  amount: number;
}

export interface RouteType {
  path: string;
  element: React.ReactNode;
  rule?: boolean;
}

export interface PathType {
  path: string;
  name: string | React.ReactNode;
  icon: React.ReactNode;
}

export interface ErrorRuleType {
  rule: boolean;
  error: string;
}

export interface ColorProps {
  readonly [key: string]: string;
}
