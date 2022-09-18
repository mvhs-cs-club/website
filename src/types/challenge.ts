// language dependant
export interface TestIOType {
  java?: string;
}

export interface ParsedTestIOType {
  java?: string[];
}

export type CodeType = TestIOType;

interface TestCasesType {
	inputs: string;
	outputs: string;
}

export interface ChallengeType {
	name: string;
	description: string;
	languages: string[];
	boilerplate: any;
	id: string;
	testCases: TestCasesType;
	amount: number;
}

export type BoilerplateType = TestIOType;

export interface TestRes {
	success: boolean;
	test: string;
	output: string;
	expectedOutput: string;
}

export interface ChallengeStatus {
	id: string;
	status: 'complete' | 'inprogress',
	code: CodeType;
}
