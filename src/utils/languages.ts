import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';

export const languages = ['java', 'C++', 'python'];

export const boilerplates: any = {
  java: `public class Runner {\n  public static void main(String[] args) {\n    \n  }\n}\n`,
  'C++': `int main() {\n  return 0;\n}\n`,
  python: '\n'
};

export const extDict: {
  [key: string]: string;
} = {
  java: 'java',
  'C++': 'cpp',
  python: 'py'
};

export const extensions: any = {
  java: [java()],
  'C++': [cpp()],
  python: [python()]
};
