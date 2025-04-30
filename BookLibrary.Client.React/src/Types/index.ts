import { AxiosRequestConfig } from "axios";
import { Book } from "./book";

// Define more precise types
type HttpMethod = 'post' | 'get' | 'put' | 'delete' | 'patch' | 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';

export interface FetchOptions {
    method: HttpMethod;
    data?: Record<string, unknown> | Book | FormData;
    config?: AxiosRequestConfig;
}

// interface ApiErrorMetadataAdditional {
//   ServerTime: string;
//   ErrorType: string;
//   StackTrace?: string;
//   Source?: string;
// }

// interface ApiErrorMetadata {
//   traceId: string;
//   additional: ApiErrorMetadataAdditional;
// }

export interface ApiResponse<T> {
    status: string;
    code: string;
    message: string;
    data: T;
    metadata?: Record<string, unknown>;
    errors: string[];
    isSuccess: boolean;
}

export interface ApiError {
    data: ApiResponse<null>;
    status: number;
    statusText: string;
    headers: Record<string, string>;
}