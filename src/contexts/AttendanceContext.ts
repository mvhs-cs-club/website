// react
import { createContext } from 'react';

// types
import { type AttendanceMap } from 'src/types/attendance';

export const AttendanceRequestContext = createContext<AttendanceMap>({});
