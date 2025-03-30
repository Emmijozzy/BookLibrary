import axios, { AxiosInstance } from "axios";
import camelcaseKeys from "camelcase-keys";
import { ApiResponse } from "../Types";

let token = '';

export const setToken = (newToken: string) => {
    console.log("set token", newToken)
    token = newToken;
};

console.log(token)

console.log(localStorage.getItem('authToken'), "localtoken")

const authToken = token || localStorage.getItem('authToken');

console.log(authToken, "authToken")

    // Token refresh function
const refreshAuthToken = async (): Promise<{ AccessToken: string }> => {
    try {
        const response = await api.post<ApiResponse<{ AccessToken: string }>>('AuthApi/RefreshToken');
        return response.data.data;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};

console.log('authToken:', authToken);

// Create API instance
export const api: AxiosInstance = axios.create({
    baseURL: 'https://localhost:7257/api',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken ? `Bearer ${authToken}` : ''
    },

})

api.interceptors.response.use((response) => {
    if (response.data) {
        response.data = camelcaseKeys(response.data, { deep: true });
    }
    return response;
});;

    // Response interceptor for handling token expiration
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            console.log(error);

            // Only attempt to refresh token once to prevent infinite loops
            if (error.response?.status === 401 &&
                error.response?.data?.code === 'EXPIRED_TOKEN' &&
                !originalRequest._retry) {

                originalRequest._retry = true;

                try {
                    const data = await refreshAuthToken();
                    const newAuthToken = data.AccessToken;

                    localStorage.setItem('authToken', newAuthToken);

                    // Update the Authorization header with the new token
                    api.defaults.headers['Authorization'] = `Bearer ${newAuthToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${newAuthToken}`;

                    return api(originalRequest);
                } catch (refreshError) {
                    // Clear token on refresh failure
                    localStorage.removeItem('authToken');
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error.response || error);
        }
    );