// language dependant
export declare interface TestIOType {
  java?: string;
}

export declare interface ParsedTestIOType {
  java?: string[];
}

export declare type CodeType = TestIOType;

declare interface TestCasesType {
  inputs: string;
  outputs: string;
}

export declare interface ChallengeType {
  name: string;
  description: string;
  languages: string[];
  boilerplate: any;
  id: string;
  testCases: TestCasesType;
  amount: number;
}

export declare type BoilerplateType = TestIOType;

export declare interface TestRes {
  success: boolean;
  test: string;
  output: string;
  expectedOutput: string;
}

export declare interface ChallengeStatus {
  id: string;
  status: 'complete' | 'inprogress';
  code: CodeType;
}
