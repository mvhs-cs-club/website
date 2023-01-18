export declare type SeverityType = 'low' | 'medium' | 'high';

export declare interface ProblemType {
  title: string;
  description: string;
  severity: SeverityType;
}
