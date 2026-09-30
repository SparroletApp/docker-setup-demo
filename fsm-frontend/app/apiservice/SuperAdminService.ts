import { api } from "./api";


export interface SuperAdminLoginRequest {
    email: string;
    password: string;
}

export interface SuperAdminLoginResponse {
    id: number;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    token: string;
}

export const superAdminService = {
    login: async (
        data: SuperAdminLoginRequest
    ): Promise<SuperAdminLoginResponse> => {
        return api.post<SuperAdminLoginResponse>(
            "/super-admin/login",
            data,
            {
                auth: false,
            }
        );
    },
};
