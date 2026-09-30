
import { api } from "./api";

export interface Ticket {
    id: number;
    ticketId: string;
    serviceTypeId: number;
    customerId: number;
    ticketNote: string;
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
    deleted?: boolean;
    deletedAt?: string;
    deletedBy?: string;
}

export interface CreateTicketRequest {
    serviceTypeId: number;
    customerId: number;
    ticketNote: string;
    createdBy: string;
}

export interface UpdateTicketRequest {
    id: number;
    serviceTypeId: number;
    customerId: number;
    ticketNote: string;
    updatedBy: string;
}

export interface TicketIdRequest {
    id: number;
    deletedBy?: string;
}

export const createTicket = (
    data: CreateTicketRequest
): Promise<Ticket> => {
    return api.post<Ticket>(
        "/tickets/create",
        data
    );
};

export const getAllTickets = (): Promise<Ticket[]> => {
    return api.post<Ticket[]>(
        "/tickets/all"
    );
};

export const getTicketById = (
    data: TicketIdRequest
): Promise<Ticket> => {
    return api.post<Ticket>(
        "/tickets/get",
        data
    );
};

export const updateTicket = (
    data: UpdateTicketRequest
): Promise<Ticket> => {
    return api.post<Ticket>(
        "/tickets/update",
        data
    );
};

export const deleteTicket = (
    data: TicketIdRequest
): Promise<void> => {
    return api.post<void>(
        "/tickets/delete",
        data
    );
};

