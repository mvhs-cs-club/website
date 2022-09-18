import type { PointHistory } from 'types/utils';

export interface UserType {
  uid: string;
  name: string;
  photoUrl: string;
  history: PointHistory[];
  email: string;
}
