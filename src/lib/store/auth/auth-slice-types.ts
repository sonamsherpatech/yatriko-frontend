import { Status } from "@/lib/types";

export interface IUserData {
  username: string;
}

export interface IUserInitialState {
  user: IUserData;
  status: Status;
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
}
