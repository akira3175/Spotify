import { User } from "./user";

export interface Friend {
  id: number;
  user: User;
  status: string;
  created_at: string;
}

