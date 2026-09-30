
import { api } from "./api";

export interface Category {
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

export interface CategoryCreateRequest {
    name: string;
    description: string;
    createdBy: string;
    updatedBy: string;
}

export interface CategoryGetRequest {
    id: number;
}

export interface CategoryUpdateRequest {
    id: number;
    name: string;
    description: string;
    updatedBy: string;
}

export interface CategoryDeleteRequest {
    id: number;
    deletedBy: string;
}

export const getAllCategories = async (): Promise<Category[]> => {
    return api.post<Category[]>("/category/list", {});
};

export const createCategory = async (
    data: CategoryCreateRequest
): Promise<Category> => {
    return api.post<Category>("/category/create", data);
};

export const getCategoryById = async (
    data: CategoryGetRequest
): Promise<Category> => {
    return api.post<Category>("/category/get", data);
};

export const updateCategory = async (
    data: CategoryUpdateRequest
): Promise<Category> => {
    return api.post<Category>("/category/update", data);
};

export const deleteCategory = async (
    data: CategoryDeleteRequest
): Promise<void> => {
    return api.post<void>("/category/delete", data);
};
