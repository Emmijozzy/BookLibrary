import axios from "axios";
import camelcaseKeys from "camelcase-keys";
import { jwtDecode } from "jwt-decode";
import { ReactNode, useEffect, useRef, useState } from "react";
import { ApiResponse, JwtDecode } from "../Types";
import { ApiContext, ApiContextType } from "./ApiContext";
import { useApp } from "../Hooks/useApp";

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider = ({ children }: ApiProviderProps) => {
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [appUser, setAppUser] = useState<string | null>(localStorage.getItem('appUser'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const { setCurrentRole, currentRole } = useApp();

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
    
  //Authenticate the log in user  // ahm trying to save the userRole in state but it keep disturbing the whole app so i comment it out
  const isAuthenticate = (token: string) => {
    try {
      const decode = jwtDecode(token as string) as JwtDecode;
      // console.log("Decoded Token:", decode);
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
      // localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticate(token)));
      setIsAuthenticated(isAuthenticate(token));
    } else {
      localStorage.removeItem('authToken');
      delete api.json.defaults.headers.common['Authorization'];
      delete api.formData.defaults.headers.common['Authorization'];
      setAppUser(null);
      // localStorage.setItem('isAuthenticated', JSON.stringify(false));
      setIsAuthenticated(false);
    }
    setAuthToken(token);
  };
  
  // Initialize the API instance
  const isRefreshing = useRef(false);
  const refreshQueue = useRef<Array<(token: string) => void>>([]);

  const setupInterceptors = () => {
    const interceptors = [api.json, api.formData].map(instance =>
      instance.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;
          
          if (error.response?.status === 401 &&
              error.response?.data?.code === 'EXPIRED_TOKEN' &&
              !originalRequest._retry) {
            
            originalRequest._retry = true;
            
            // If already refreshing, add to queue instead of making a new refresh request
            if (isRefreshing.current) {
              return new Promise((resolve) => {
                refreshQueue.current.push((token) => {
                  originalRequest.headers['Authorization'] = `Bearer ${token}`;
                  resolve(instance(originalRequest));
                });
              });
            }
            
            isRefreshing.current = true;
            
            try {
              const data = await refreshAuthToken();
              
              if (data.accessToken) {       
                const newAuthToken = data.accessToken;
                updateAuthToken(newAuthToken);
                originalRequest.headers['Authorization'] = `Bearer ${newAuthToken}`;
                
                // Process any queued requests with the new token
                refreshQueue.current.forEach(callback => callback(newAuthToken));
                refreshQueue.current = [];
              } else {
                throw new Error('Failed to refresh token');
              }
              
              isRefreshing.current = false;
              return instance(originalRequest);
            } catch (refreshError) {
              console.error('Error refreshing token:', refreshError);
              updateAuthToken(null);
              isRefreshing.current = false;
              refreshQueue.current = [];
              return Promise.reject(refreshError);
            }
          }
          
          return Promise.reject(error.response || error);
        }
      )
    );
    
    return interceptors;
  };

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
    
    // Set up token refresh interceptor with queue pattern
    const interceptors = setupInterceptors();
    
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
  
  
  //initialize User Roles
  useEffect(() => {
    try {
      if (authToken) {
        const decode = jwtDecode(authToken as string) as JwtDecode;
        if (decode.Roles) {
          setUserRoles(decode.Roles);
          if (!currentRole) {
            setCurrentRole(Array.isArray(decode.Roles) ? decode.Roles[0] as "User" | "Admin" : decode.Roles as "User" | "Admin");
            localStorage.setItem('currentRole', decode.Roles[0] as "User" | "Admin");
          }
        }
        else {
          setUserRoles(["User"]);
          setCurrentRole("User");
          localStorage.setItem('currentRole', "User");
        }
      }
    } catch(e) {
      console.error("Error decoding JWT:", e);
    }
  }, [authToken, currentRole, setCurrentRole])  
  const contextValue: ApiContextType = {
    api: api.json,
    fileApi: api.formData,
    setAuthToken: (token: string) => updateAuthToken(token),
    setAppUser,
    appUser,
    clearAuthToken: () => updateAuthToken(null),
    isAuthenticated,
    isInitialized,
    userRoles
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