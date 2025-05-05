export type User = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email?: string;
  avatar?: string;
  bio?: string;
  [key: string]: any;
};
