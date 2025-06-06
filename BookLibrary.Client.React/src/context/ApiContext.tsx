import { AxiosInstance } from 'axios';
import { createContext } from 'react';

export interface ApiContextType {
  api: AxiosInstance;
  fileApi: AxiosInstance;
  setAuthToken: (token: string) => void;
  setAppUser: React.Dispatch<React.SetStateAction<string | null>>;
  appUser: string | null;
  clearAuthToken: () => void;
  isAuthenticated: boolean;
  isInitialized: boolean;
  userRoles: string[];
}

export const ApiContext = createContext<ApiContextType | undefined>(undefined);


