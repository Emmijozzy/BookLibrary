export interface User {
  id: string;
  email: string;
  fullName: string;
  roles: ("User" | "Admin")[];
  locked: boolean;
}