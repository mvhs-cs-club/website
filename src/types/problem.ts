export type SeverityType = 'low' | 'medium' | 'high';

export interface ProblemType {
	title: string;
	description: string;
	severity: SeverityType;
}
