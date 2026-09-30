
import { api } from "./api";

export interface Customer {
    id: number;
    name: string;
    customerId: string;
    phone: string;
    address: string;
    pincode: string;
    companyId: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CustomerRequest {
    name: string;
    phone: string;
    address: string;
    pincode: string;
    companyId: number;
    createdBy?: string;
    updatedBy?: string;
}

export interface UpdateCustomerRequest extends CustomerRequest {
    id: number;
}

export interface DeleteCustomerRequest {
    id: number;
    deletedBy: string;
}

export const getAllCustomers = async (): Promise<Customer[]> => {
    return api.post<Customer>("/customer/list", {}).then((response) => {
        return response as unknown as Customer[];
    });
};

export const getCustomerById = async (
    id: number
): Promise<Customer> => {
    return api.post<Customer>("/customer/get", {
        id,
    });
};

export const createCustomer = async (
    data: CustomerRequest
): Promise<Customer> => {
    return api.post<Customer>("/customer/create", data);
};

export const updateCustomer = async (
    data: UpdateCustomerRequest
): Promise<Customer> => {
    return api.post<Customer>("/customer/update", data);
};

export const deleteCustomer = async (
    data: DeleteCustomerRequest
): Promise<void> => {
    return api.post<void>("/customer/delete", data);
};
