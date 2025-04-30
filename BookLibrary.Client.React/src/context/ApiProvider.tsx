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

  //Creation of api instances with different content types
  const api = useRef({
    json: axios.create({
      baseURL: 'https://localhost:7257/api',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }),
    formData: axios.create({
      baseURL: 'https://localhost:7257/api',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    })
  }).current;
    
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
  const refreshAuthToken = async (): Promise<{ accessToken: string }> => {
    try {
      const response = await api.json.post<ApiResponse<{ accessToken: string }>>('AuthApi/RefreshToken');
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
      api.json.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.formData.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticate(token)));
      setIsAuthenticated(isAuthenticate(token));
    } else {
      localStorage.removeItem('authToken');
      delete api.json.defaults.headers.common['Authorization'];
      delete api.formData.defaults.headers.common['Authorization'];
      setAppUser(null);
      localStorage.setItem('isAuthenticated', JSON.stringify(false));
      setIsAuthenticated(false);
    }
    setAuthToken(token);
  };
  
  // Initialize the API instance
  useEffect(() => {
    // console.log("Initialize the API instance");
    // Set up camelCase conversion interceptor for both instances
    [api.json, api.formData].forEach(instance => {
      instance.interceptors.response.use((response) => {
        // console.log("Original response:", response);
        
        if (response.data) {
          // Make sure we're properly converting all properties to camelCase
          response.data = camelcaseKeys(response.data, { 
            deep: true,
            pascalCase: false
          });
          
          // console.log("Camelcased response:", response.data);
        }
        return response;
      });
    });
    
    // Set up token refresh interceptor for both instances
    const interceptors = [api.json, api.formData].map(instance =>
      instance.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;
          
          if (error.response?.status === 401 &&
              error.response?.data?.code === 'EXPIRED_TOKEN' &&
              !originalRequest._retry) {
            
            originalRequest._retry = true;
            
            try {
              const data = await refreshAuthToken();
              
              if (data.accessToken) {       
                const newAuthToken = data.accessToken;
                updateAuthToken(newAuthToken);
                originalRequest.headers['Authorization'] = `Bearer ${newAuthToken}`;
              } else {
                throw new Error('Failed to refresh token');
              }        
              return instance(originalRequest);
            } catch (refreshError) {
              console.error('Error refreshing token:', refreshError);
              updateAuthToken(null);
              return Promise.reject(refreshError);
            }
          }
          
          return Promise.reject(error.response || error);
        }
      )
    );
    
    // Set initial auth token if available
    if (authToken) {
      api.json.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      api.formData.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticate(authToken)));
      setIsAuthenticated(isAuthenticate(authToken));
    }
    
    setIsInitialized(true);
    
    return () => {
      interceptors.forEach((interceptor, index) => {
        [api.json, api.formData][index].interceptors.response.eject(interceptor);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  
  const contextValue: ApiContextType = {
    api: api.json,
    fileApi: api.formData,
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