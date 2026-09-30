import { api } from "./api";

export interface User {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    role: string;
    technicianId: string | null;
    status: string;
    specialization: string | null;
    ability: string | null;
    license: string[] | null;
    companyId: number | null;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deleted: boolean;
    deletedAt: string | null;
    deletedBy: string | null;
}

export interface CreateUserRequest {
    name: string;
    phone: string;
    email?: string;
    role: string;
    status?: string;
    specialization?: string;
    ability?: string;
    license?: string[];
    companyId?: number | null;
    createdBy: string;
}

export interface UpdateUserRequest {
    id: number;
    name?: string;
    phone?: string;
    email?: string;
    role?: string;
    status?: string;
    specialization?: string;
    ability?: string;
    license?: string[];
    companyId?: number | null;
    updatedBy?: string;
}

export interface DeleteUserRequest {
    id: number;
    deletedBy: string;
}

export interface UserIdRequest {
    id: number;
}

export interface LoginRequest {
    phone: string;
}

export interface OtpRequest {
    phone: string;
    otp: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export const getUserById = async (
    data: UserIdRequest
): Promise<User> => {
    return api.post<User>("/users/get", data);
};

export const getAllUsers = async (): Promise<User[]> => {
    return api.post<User[]>("/users/list");
};

export const createUser = async (
    data: CreateUserRequest
): Promise<User> => {
    return api.post<User>("/users/create", data);
};

export const updateUser = async (
    data: UpdateUserRequest
): Promise<User> => {
    return api.post<User>("/users/update", data);
};

export const deleteUser = async (
    data: DeleteUserRequest
): Promise<void> => {
    return api.post<void>("/users/delete", data);
};

export const loginUser = async (
    data: LoginRequest
): Promise<User> => {
    return api.post<User>("/users/login", data);
};

export const verifyOtp = async (
    data: OtpRequest
): Promise<LoginResponse> => {
    return api.post<LoginResponse>("/users/verify-otp", data);
};

