export interface IUser {
  id: number;
  username: string;
  locate_code: string;
  status_id: number;
  referal_id?: number | null;
  daily?: {
    streak: number;
    timestamp: Date;
  };
}
