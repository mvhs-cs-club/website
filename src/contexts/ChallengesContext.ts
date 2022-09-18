// react
import { createContext } from 'react';

// types
import type { ChallengeType } from 'types/challenge';

export const ChallengesContext = createContext<ChallengeType[] | null>(null);
