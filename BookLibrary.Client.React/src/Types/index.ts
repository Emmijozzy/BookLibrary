import { AxiosRequestConfig } from "axios";
import { Book } from "./book";
import { User } from "./User";

// Define more precise types
type HttpMethod = 'post' | 'get' | 'put' | 'delete' | 'patch' | 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';

export interface FetchOptions {
    method: HttpMethod;
    data?: Record<string, unknown> | Book | FormData | User;
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

export interface JwtDecode {
    FullName: string;
    Id: string;
    sub: string;
    Roles: string[];
    exp: number
}