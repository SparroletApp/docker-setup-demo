import { api } from "./api";

export interface CreateInvoiceRequest {
    ticketId: number;

    serviceTypeId?: number | null;

    jobIds: number[];

    serviceCharge: number;

    partsCharge: number;

    taxAmount: number;

    totalPrice: number;

    workingHours?: number;

    status?: string;

    paymentStatus?: string;

    paymentMethod?: string | null;

    notes?: string | null;

    createdBy?: string;
}

export interface UpdateInvoiceRequest {
    id: number;

    ticketId?: number;

    serviceTypeId?: number | null;

    jobIds?: number[];

    serviceCharge?: number;

    partsCharge?: number;

    taxAmount?: number;

    totalPrice?: number;

    workingHours?: number;

    status?: string;

    paymentStatus?: string;

    paymentMethod?: string | null;

    notes?: string | null;

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

    serviceTypeId?: number | null;

    jobIds: number[];

    serviceCharge: number;

    partsCharge: number;

    taxAmount: number;

    totalPrice: number;

    workingHours?: number | null;

    status: string;

    paymentStatus: string;

    paymentMethod?: string | null;

    notes?: string | null;

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