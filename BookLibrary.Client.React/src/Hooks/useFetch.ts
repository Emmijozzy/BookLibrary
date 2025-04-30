import { useCallback, useState } from "react";
import camelcaseKeys from "camelcase-keys";
import { ApiError, ApiResponse, FetchOptions } from "../Types";
import { useApi } from "./useApi";


const useFetch = <T extends Record<string, unknown> = Record<string, unknown>>() => {
    const [data, setData] = useState<T | null>(null);
    const [metadata, setMetadata] = useState<Record<string, unknown> | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { api, fileApi } = useApi();

    const fetchData = useCallback(async <R = T>(url = "", options: FetchOptions, apiInstance: "api" | "fileApi" = "api"): Promise<R> => {
        const { method, data: requestData, config } = options;

        try {
            setLoading(true);
            setError(null);

            const response = apiInstance == "api" ? await api({
                method: method.toLowerCase(),
                url,
                data: requestData,
                ...config,
            }) : await fileApi({
                method: method.toLowerCase(),
                url,
                data: requestData,
                ...config,
            });

            if (response.data) {
                response.data = camelcaseKeys(response.data, { deep: true });
                console.log('API Response (camelcased):', response.data);
            }

            console.log('API Response:', response);

            const responseData = response.data as ApiResponse<R>;

            if (responseData.data) {
                setData(responseData.data as unknown as T);
                setIsSuccess(true);
            }

            if (responseData.metadata) {
                setMetadata(responseData.metadata);
            }

            return responseData.data;
        } catch (err) {
            const apiError = camelcaseKeys(err as Record<string, unknown>, {deep: true}) as unknown as ApiError;
          
            console.log('API Error:', apiError);
            // Handle different error scenarios
            if (apiError.data) {
                console.log('API Error:', apiError.data?.code, apiError.data?.errors);
                const errorMessage = `${apiError.data?.message || 'Error'}: ${apiError?.data?.errors?.join(', ') || 'An unexpected error occurred'}`;
                setError(errorMessage);
                throw new Error(errorMessage);
            } else {
                const errorMessage = 'Network error or server unavailable';
                setError(errorMessage);
                console.error('Network Error:', err);
                throw new Error(errorMessage);
            }        
        } finally {
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        data,
        metadata,
        error,
        isSuccess,
        loading,
        fetchData,
        clearError: () => setError(null),
        clearData: () => setData(null)
    };
};export default useFetch;
