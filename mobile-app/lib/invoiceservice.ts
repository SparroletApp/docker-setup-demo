
import { api } from "./api";

export interface CreateInvoiceRequest {
    ticketId: number;
    jobIds: number[];
    totalPrice: number;
    status?: string;
    paymentStatus?: string;
    createdBy?: string;
}

export interface UpdateInvoiceRequest {
    id: number;
    ticketId?: number;
    jobIds?: number[];
    totalPrice?: number;
    status?: string;
    paymentStatus?: string;
    updatedBy?: string;
}

export interface InvoiceDeleteRequest {
    id: number;
    deletedBy?: string;
}

export interface Invoice {
    id: number;
    invoiceId: string;

    ticketId: number;

    jobIds: number[];

    totalPrice: number;

    status: string;

    paymentStatus: string;

    createdAt?: string;

    createdBy?: string;

    updatedAt?: string;

    updatedBy?: string;
}

export const createInvoice = async (
    data: CreateInvoiceRequest
): Promise<Invoice> => {

    return api.post<Invoice>(
        "/invoices/create",
        data
    );
};

export const getInvoiceById = async (
    id: number
): Promise<Invoice> => {

    return api.post<Invoice>(
        "/invoices/get",
        {
            id,
        }
    );
};

export const getAllInvoices = async (): Promise<
    Invoice[]
> => {

    return api.post<Invoice[]>(
        "/invoices/all"
    );
};

export const updateInvoice = async (
    data: UpdateInvoiceRequest
): Promise<Invoice> => {

    return api.post<Invoice>(
        "/invoices/update",
        data
    );
};

export const deleteInvoice = async (
    data: InvoiceDeleteRequest
): Promise<string> => {

    return api.post<string>(
        "/invoices/delete",
        data
    );
};
