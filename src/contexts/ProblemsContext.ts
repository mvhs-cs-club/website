// react
import { createContext } from 'react';

// types
import type { ProblemType } from 'src/types/problem';

export const ProblemsContext = createContext<ProblemType[] | null>(null);
