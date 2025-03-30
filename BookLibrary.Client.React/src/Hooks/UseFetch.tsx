import { useCallback, useState } from "react";
import { ApiError, ApiResponse, FetchOptions } from "../Types";
import { useApi } from "./useApi";


const useFetch = <T extends Record<string, unknown> = Record<string, unknown>>() => {
    const [data, setData] = useState<T | null>(null);
    const [metadata, setMetadata] = useState<Record<string, unknown> | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { api } = useApi();

    const fetchData = useCallback(async <R = T>(url = "", options: FetchOptions): Promise<R> => {
        const { method, data: requestData, config } = options;

        try {
            setLoading(true);
            setError(null);

            const response = await api({
                method: method.toLowerCase(),
                url,
                data: requestData,
                ...config,
            });

            const responseData = response.data as ApiResponse<R>;

            // console.log('API Response:', responseData);

            if (responseData.data) {
                setData(responseData.data as unknown as T);
            }

            if (responseData.metadata) {
                setMetadata(responseData.metadata);
            }

            return responseData.data;
        } catch (err) {
            const apiError = err as ApiError;

            // Handle different error scenarios
            if (apiError.data) {
                const errorMessage = apiError.data.message || apiError.data.errors?.join(', ') || 'An error occurred';
                setError(errorMessage);
                console.error('API Error:', apiError.data.code, apiError.data.errors);
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
        loading,
        fetchData,
        clearError: () => setError(null),
        clearData: () => setData(null)
    };
};

export default useFetch;
