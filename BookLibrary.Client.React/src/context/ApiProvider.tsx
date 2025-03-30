import axios from "axios";
import camelcaseKeys from "camelcase-keys";
import { jwtDecode } from "jwt-decode";
import { ReactNode, useEffect, useState, useRef } from "react";
import { ApiResponse } from "../Types";
import { ApiContext, ApiContextType } from "./ApiContext";

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider = ({ children }: ApiProviderProps) => {
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [appUser, setAppUser] = useState<string | null>(localStorage.getItem('appUser'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  //Creation of api instance 
  const apiInstance = useRef(axios.create({
    baseURL: 'https://localhost:7257/api',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  })).current;
    
  //Authenticate the log in user 
  const isAuthenticate = (token: string) => {
    try {
      const decode = jwtDecode(token as string);
      return (decode.sub === appUser);
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }
  
  // Token refresh function
  const refreshAuthToken = async (): Promise<{ AccessToken: string }> => {
    try {
      const response = await apiInstance.post<ApiResponse<{ AccessToken: string }>>('AuthApi/RefreshToken');
      return response.data.data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  };
  
  // Update auth token
  const updateAuthToken = (token: string | null) => {
    if (token) {
      localStorage.setItem('authToken', token);
      apiInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticate(token)));
      setIsAuthenticated(isAuthenticate(token));
    } else {
      localStorage.removeItem('authToken');
      delete apiInstance.defaults.headers.common['Authorization'];
      setAppUser(null);
      localStorage.setItem('isAuthenticated', JSON.stringify(false));
      setIsAuthenticated(false);
    }
    setAuthToken(token);
  };
  
  // Initialize the API instance
  useEffect(() => {
    // Set up camelCase conversion interceptor
    apiInstance.interceptors.response.use((response) => {
      if (response.data) {
        response.data = camelcaseKeys(response.data, { deep: true });
      }
      return response;
    });
    
    // Set up token refresh interceptor
    const interceptor = apiInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 &&
            error.response?.data?.code === 'EXPIRED_TOKEN' &&
            !originalRequest._retry) {
          
          originalRequest._retry = true;
          
          try {
            const data = await refreshAuthToken();
            const newAuthToken = data.AccessToken;
            
            updateAuthToken(newAuthToken);
            originalRequest.headers['Authorization'] = `Bearer ${newAuthToken}`;
            
            return apiInstance(originalRequest);
          } catch (refreshError) {
            updateAuthToken(null);
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error.response || error);
      }
    );
    
    // Set initial auth token if available
    if (authToken) {
      apiInstance.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticate(authToken)));
      setIsAuthenticated(isAuthenticate(authToken));
    }
    
    setIsInitialized(true);
    
    return () => {
      apiInstance.interceptors.response.eject(interceptor);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const contextValue: ApiContextType = {
    api: apiInstance,
    setAuthToken: (token: string) => updateAuthToken(token),
    setAppUser,
    appUser,
    clearAuthToken: () => updateAuthToken(null),
    isAuthenticated,
    isInitialized
  };
  
  // Only render children when initialization is complete
  if (!isInitialized) {
    return null; // Or a loading indicator
  }
  
  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  );
};
