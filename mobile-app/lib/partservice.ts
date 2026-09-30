import { api } from "./api";

export interface Part {
    id: number;
    name: string;
    sku: string;
    categoryId: number;
    categoryName: string;
    stockQuantity: number;
    thresholdAlert: number;
    unitPrice: number;
    retailPrice: number;
    supplier: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string | null;
    updatedAt: string | null;
}

export interface CreatePartRequest {
    name: string;
    sku: string;
    categoryId: number;
    stockQuantity: number;
    thresholdAlert: number;
    unitPrice: number;
    retailPrice: number;
    supplier: string;
    createdBy: string;
}

export interface UpdatePartRequest {
    id: number;
    name: string;
    sku: string;
    categoryId: number;
    stockQuantity: number;
    thresholdAlert: number;
    unitPrice: number;
    retailPrice: number;
    supplier: string;
    updatedBy: string;
}

export interface DeletePartRequest {
    id: number;
    deletedBy: string;
}

export interface GetPartRequest {
    id: number;
}

export const createPart = async (
    data: CreatePartRequest
): Promise<Part> => {
    return api.post<Part>("/parts/create", data);
};

export const getAllParts = async (): Promise<Part[]> => {
    return api.post<Part[]>("/parts/list");
};

export const getPartById = async (
    data: GetPartRequest
): Promise<Part> => {
    return api.post<Part>("/parts/view", data);
};

export const updatePart = async (
    data: UpdatePartRequest
): Promise<Part> => {
    return api.put<Part>("/parts/update", data);
};

export const deletePart = async (
    data: DeletePartRequest
): Promise<void> => {
    return api.post<void>("/parts/delete", data);
};