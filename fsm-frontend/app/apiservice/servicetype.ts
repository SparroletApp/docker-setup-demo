import { api } from "./api";

export interface ServiceType {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deleted: boolean;
    deletedAt: string | null;
    deletedBy: string | null;
}

export interface CreateServiceTypeRequest {
    id?: number;
    name: string;
    description: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface ServiceTypeIdRequest {
    id: number;
    deletedBy?: string;
}

export const createServiceType = async (
    data: CreateServiceTypeRequest
): Promise<ServiceType> => {
    return api.post<ServiceType>(
        "/service-type/create",
        data
    );
};

export const getAllServiceTypes = async (): Promise<ServiceType[]> => {
    return api.post<ServiceType[]>(
        "/service-type/get-all"
    );
};

export const getServiceTypeById = async (
    data: ServiceTypeIdRequest
): Promise<ServiceType> => {
    return api.post<ServiceType>(
        "/service-type/get-by-id",
        data
    );
};

export const updateServiceType = async (
    data: CreateServiceTypeRequest
): Promise<ServiceType> => {
    return api.post<ServiceType>(
        "/service-type/update",
        data
    );
};

export const deleteServiceType = async (
    data: ServiceTypeIdRequest
): Promise<void> => {
    await api.post(
        "/service-type/delete",
        data
    );
};