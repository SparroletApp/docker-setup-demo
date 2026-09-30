
import { api } from "./api";

/*
 * =========================================================
 * DASHBOARD REQUEST
 * =========================================================
 */

export interface DashboardRequest {

    /*
     * Company whose dashboard should be loaded.
     */
    companyId: number;

    /*
     * Logged-in user's phone.
     * Used by backend if required for authorization/audit.
     */
    userPhone?: string;

    /*
     * Optional date filters.
     * Can be used later for dashboard date-wise reports.
     */
    fromDate?: string;

    toDate?: string;
}


/*
 * =========================================================
 * DASHBOARD RESPONSE
 * =========================================================
 *
 * Current backend response:
 *
 * {
 *     "customerCount": 0,
 *     "pendingJobCount": 0,
 *     "pendingTicketCount": 0,
 *     "technicianCount": 3
 * }
 *
 */

export interface DashboardResponse {

    /*
     * =====================================================
     * CUSTOMERS
     * =====================================================
     */

    customerCount: number;


    /*
     * =====================================================
     * PENDING JOBS
     * =====================================================
     */

    pendingJobCount: number;


    /*
     * =====================================================
     * PENDING TICKETS
     * =====================================================
     */

    pendingTicketCount: number;


    /*
     * =====================================================
     * TECHNICIANS
     * =====================================================
     */

    technicianCount: number;
}


/*
 * =========================================================
 * GET DASHBOARD
 * =========================================================
 */

export const getDashboard = async (
    request: DashboardRequest
): Promise<DashboardResponse> => {

    const response =
        await api.post<DashboardResponse>(
            "/dashboard/get",
            request
        );


    /*
     * Axios response contains:
     *
     * response.data
     *
     * Return only the actual dashboard JSON.
     */

    return response;
};
