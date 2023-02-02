import { UserType } from './user';

export declare type AttendanceUser = Omit<UserType, 'history'>;

export declare type AttendanceMap = {
  [key: string]: {
    [key: string]: AttendanceUser;
  };
};
