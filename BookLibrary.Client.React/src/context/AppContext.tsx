import { createContext, Dispatch, SetStateAction } from "react";

interface App  {
  currentRole: "User" | "Admin" | undefined;
  setCurrentRole: Dispatch<SetStateAction<"User" | "Admin" | undefined>>;
  appUserId: string | undefined;
  setAppUserId: Dispatch<SetStateAction<string | undefined>>;
 }

export const AppContext = createContext<App | undefined>(undefined);