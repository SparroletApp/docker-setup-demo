import { api } from "./api";

export interface Company {
    id: number;
    legalName: string;
    brandName: string;
    logo: string;
    phone: string;
    email: string;
    officeAddress: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    isGstRegistered: boolean;
    gstIdentificationNumber: string;
    gstName: string;
    registeredGstAddress: string;
    registeredState: string;
    registeredPin: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deleted: boolean;
    deletedAt: string | null;
    deletedBy: string | null;
}

export interface CompanyRequest {
    legalName: string;
    brandName: string;
    logo: File | null;
    phone: string;
    email: string;
    officeAddress: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    isGstRegistered: boolean;
    gstIdentificationNumber: string;
    gstName: string;
    registeredGstAddress: string;
    registeredState: string;
    registeredPin: string;
    id?: number;
}

const createCompanyFormData = (
    data: CompanyRequest
): FormData => {

    const formData = new FormData();

    if (data.id !== undefined) {
        formData.append("id", String(data.id));
    }

    formData.append("legalName", data.legalName);
    formData.append("brandName", data.brandName);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("officeAddress", data.officeAddress);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("pincode", data.pincode);
    formData.append("country", data.country);

    formData.append(
        "isGstRegistered",
        String(data.isGstRegistered)
    );

    formData.append(
        "gstIdentificationNumber",
        data.gstIdentificationNumber
    );

    formData.append(
        "gstName",
        data.gstName
    );

    formData.append(
        "registeredGstAddress",
        data.registeredGstAddress
    );

    formData.append(
        "registeredState",
        data.registeredState
    );

    formData.append(
        "registeredPin",
        data.registeredPin
    );

    if (data.logo instanceof File) {
        formData.append(
            "logo",
            data.logo
        );
    }

    return formData;
};

export const getAllCompanies = async (): Promise<Company[]> => {
    return api.post<Company[]>(
        "/company/list"
    );
};

export const getCompanyById = async (
    id: number
): Promise<Company> => {

    return api.post<Company>(
        "/company/get",
        {
            id,
        }
    );
};

export const createCompany = async (
    data: CompanyRequest
): Promise<Company> => {

    const formData = createCompanyFormData(data);

    return api.post<Company>(
        "/company/create",
        formData
    );
};

export const updateCompany = async (
    data: CompanyRequest
): Promise<Company> => {

    const formData = createCompanyFormData(data);

    return api.post<Company>(
        "/company/update",
        formData
    );
};