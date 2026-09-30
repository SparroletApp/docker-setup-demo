import { api } from "./api";

export interface Job {
    id: number;

    jobId: string;

    userId: number | null;
    ticketId: number;

    categoryId: number | null;
    partId: number | null;

    jobTitle: string;
    priority: string;

    expectedDate: string | null;
    startingDateTime: string | null;
    endingDateTime: string | null;

    employeeStatus: string | null;

    jobDescription: string | null;
    status: string;

    createdAt: string;
    createdBy: string | null;

    updatedAt: string;
    updatedBy: string | null;

    deleted: boolean;
    deletedAt: string | null;
    deletedBy: string | null;
}

export interface CreateJobRequest {
    userId?: number | null;

    ticketId: number;

    categoryId?: number | null;
    partId?: number | null;

    jobTitle: string;
    priority: string;

    expectedDate?: string | null;
    startingDateTime?: string | null;
    endingDateTime?: string | null;

    employeeStatus?: string | null;

    jobDescription?: string | null;

    createdBy?: string;
    updatedBy?: string;
}

export interface UpdateJobRequest {
    id: number;

    userId?: number | null;

    customerId?: number | null;

    ticketId?: number;

    categoryId?: number | null;
    partId?: number | null;

    jobTitle?: string;
    priority?: string;

    expectedDate?: string | null;
    startingDateTime?: string | null;
    endingDateTime?: string | null;

    employeeStatus?: string | null;

    jobDescription?: string | null;

    status?: string;

    updatedBy?: string;
}

export interface JobIdRequest {
    id: number;
}

export interface DeleteJobRequest {
    id: number;
    deletedBy: string;
}

export interface UserJobRequest {
    userId: number;
}

export const getJobById = async (
    data: JobIdRequest
): Promise<Job> => {
    return api.post<Job>(
        "/jobs/get",
        data
    );
};

export const getAllJobs = async (): Promise<Job[]> => {
    return api.post<Job[]>(
        "/jobs/list",
        {}
    );
};

export const getJobsByUserId = async (
    data: UserJobRequest
): Promise<Job[]> => {
    return api.post<Job[]>(
        "/jobs/list/user",
        data
    );
};

export const getUnassignedJobs = async (): Promise<Job[]> => {
    return api.post<Job[]>(
        "/jobs/list/unassigned",
        {}
    );
};

export const createJob = async (
    data: CreateJobRequest
): Promise<Job> => {
    return api.post<Job>(
        "/jobs/create",
        data
    );
};

export const updateJob = async (
    data: UpdateJobRequest
): Promise<Job> => {
    return api.post<Job>(
        "/jobs/update",
        data
    );
};

export const deleteJob = async (
    data: DeleteJobRequest
): Promise<void> => {
    return api.post<void>(
        "/jobs/delete",
        data
    );
};