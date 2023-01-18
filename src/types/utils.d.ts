export declare interface PointHistory {
  date: string;
  timestamp: number;
  reason: string;
  amount: number;
}

export declare interface RouteType {
  path: string;
  element: React.ReactNode;
  rule?: boolean;
}

export declare interface PathType {
  path: string;
  name: string | React.ReactNode;
  icon: React.ReactNode;
}

export declare interface ErrorRuleType {
  rule: boolean;
  error: string;
}

export declare interface ColorProps {
  readonly [key: string]: string;
}
