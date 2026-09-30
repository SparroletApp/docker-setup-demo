
import axios from "axios";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface RequestOptions {
    headers?: Record<string, string>;
    auth?: boolean;
}

const getToken = (): string | null => {
    if (typeof window === "undefined") {
        return null;
    }

    return sessionStorage.getItem("access_token");
};

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        Accept: "application/json",
    },
});

const request = async <T>(
    endpoint: string,
    options: RequestOptions = {},
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
    body?: unknown
): Promise<T> => {

    const {
        headers = {},
        auth = true,
    } = options;

    const token = getToken();

    const requestHeaders: Record<string, string> = {
        ...headers,
    };

    if (auth && token) {
        requestHeaders.Authorization = `Bearer ${token}`;
    }

    const isFormData = body instanceof FormData;

    if (!isFormData) {
        requestHeaders["Content-Type"] = "application/json";
    }

    try {
        const response = await axiosInstance.request<T>({
            url: endpoint,
            method,
            data: body,
            headers: requestHeaders,
        });

        return response.data;

    } catch (error: unknown) {

        if (axios.isAxiosError(error)) {

            const errorData = error.response?.data as {
                message?: string;
                error?: string;
            } | undefined;

            throw new Error(
                errorData?.message ||
                errorData?.error ||
                error.message ||
                `Request failed with status ${error.response?.status}`
            );
        }

        throw new Error("Something went wrong");
    }
};

export const api = {

    get: <T>(
        endpoint: string,
        options?: RequestOptions
    ): Promise<T> => {
        return request<T>(
            endpoint,
            options,
            "GET"
        );
    },

    post: <T>(
        endpoint: string,
        body?: unknown,
        options?: RequestOptions
    ): Promise<T> => {
        return request<T>(
            endpoint,
            options,
            "POST",
            body
        );
    },

    put: <T>(
        endpoint: string,
        body?: unknown,
        options?: RequestOptions
    ): Promise<T> => {
        return request<T>(
            endpoint,
            options,
            "PUT",
            body
        );
    },

    patch: <T>(
        endpoint: string,
        body?: unknown,
        options?: RequestOptions
    ): Promise<T> => {
        return request<T>(
            endpoint,
            options,
            "PATCH",
            body
        );
    },

    delete: <T>(
        endpoint: string,
        options?: RequestOptions
    ): Promise<T> => {
        return request<T>(
            endpoint,
            options,
            "DELETE"
        );
    },
};
