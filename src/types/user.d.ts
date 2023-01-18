import { type PointHistory } from 'types/utils';

export declare interface UserType {
  uid: string;
  name: string;
  photoUrl: string;
  history: PointHistory[];
  email: string;
}
