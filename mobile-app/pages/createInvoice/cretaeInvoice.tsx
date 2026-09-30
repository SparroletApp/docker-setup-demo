import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Services
import { getJobById, updateJob } from "../../lib/jobservice";
import { getTicketById } from "../../lib/ticketservice";
import { getCustomerById } from "../../lib/customerservice";
import { getAllCategories } from "../../lib/categoryservice";
import { getAllParts } from "../../lib/partservice";
import { createInvoice } from "../../lib/invoiceservice";
import { getCompanyById } from "../../lib/companyservice";

import styles from "./createInvoice.styles";

type CreateInvoiceProps = {
    jobId: number | string;
    onBack?: () => void;
    onSuccess?: () => void;
};

type Job = {
    id: number;

    jobId?: string | null;
    jobTitle?: string | null;
    jobDescription?: string | null;

    status?: string | null;
    priority?: string | null;

    expectedDate?: string | null;
    startingDateTime?: string | null;
    endingDateTime?: string | null;

    employeeStatus?: string | null;

    workingHours?: number | null;

    ticketId?: number | null;
    categoryId?: number | null;
    partId?: number | null;
    userId?: number | null;

    category?: {
        id?: number | null;
        categoryName?: string | null;
        name?: string | null;
    } | null;

    part?: {
        id?: number | null;
        partName?: string | null;
        price?: number | null;
    } | null;
};

type Ticket = {
    id: number;

    customerId?: number | null;
    serviceTypeId?: number | null;

    ticketId?: string | null;
    title?: string | null;
};

type Customer = {
    id: number;
    name?: string | null;
    phone?: string | number | null;
    address?: string | null;

    email?: string | null;
};

type Category = {
    id: number;

    categoryId?: string | null;
    categoryName?: string | null;
    name?: string | null;
};

type Part = {
    id: number;

    name?: string | null;
    sku?: string | null;

    categoryId?: number | null;
    categoryName?: string | null;

    stockQuantity?: number | null;
    thresholdAlert?: number | null;

    unitPrice?: number | null;
    retailPrice?: number | null;

    supplier?: string | null;

    createdBy?: string | null;
    createdAt?: string | null;

    updatedBy?: string | null;
    updatedAt?: string | null;
};
type SelectedPart = {
    partId: number;

    partName: string;
    partNumber: string;

    quantity: number;
    unitPrice: number;

    lineTotal: number;
};

type User = {
    id?: number | null;
    name?: string | null;
    phone?: string | null;
    email?: string | null;
    companyId?: number | null;
    upiId?: string | null;
    role?: string | null;
    technicianId?: string | null;
};

type Company = {
    id?: number | null;

    legalName?: string | null;
    brandName?: string | null;

    phone?: string | null;
    email?: string | null;
    address?: string | null;

    gstNumber?: string | null;

    logo?: string | null;
    logoPath?: string | null;

    /*
     * Tax configuration
     */
    taxPercentage?: number | null;
    taxIncluded?: boolean | null;
};




const USER_STORAGE_KEY = "user";


const CreateInvoice = ({
    jobId,
    onBack,
    onSuccess,
}: CreateInvoiceProps) => {
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const [job, setJob] = useState<Job | null>(null);
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [customer, setCustomer] =
        useState<Customer | null>(null);

    const [user, setUser] =
        useState<User | null>(null);

    const [company, setCompany] =
        useState<Company | null>(null);

    const [categories, setCategories] =
        useState<Category[]>([]);

    const [parts, setParts] =
        useState<Part[]>([]);

    const [selectedCategoryId, setSelectedCategoryId] =
        useState<number | null>(null);

    const [selectedParts, setSelectedParts] =
        useState<SelectedPart[]>([]);

    const [serviceCharge, setServiceCharge] =
        useState("");

    const [paymentStatus, setPaymentStatus] =
        useState("PENDING");

    const [paymentMethod, setPaymentMethod] =
        useState("");

    const [showCategoryDropdown, setShowCategoryDropdown] =
        useState(false);

    const [showPartDropdown, setShowPartDropdown] =
        useState(false);

    const [
        showPaymentStatusDropdown,
        setShowPaymentStatusDropdown,
    ] = useState(false);

    const [
        showPaymentMethodDropdown,
        setShowPaymentMethodDropdown,
    ] = useState(false);

    const businessUpiId = user?.upiId?.trim() || "";

    const businessUpiName =
        user?.name?.trim() ||
        "User";



    const [showUpiPaymentModal, setShowUpiPaymentModal] =
        useState(false);

    const [upiPaymentConfirmed, setUpiPaymentConfirmed] =
        useState(false);


    const unwrapResponse = <T,>(
        response: any
    ): T => {
        return (
            response?.data ??
            response
        ) as T;
    };


    useEffect(() => {
        loadInvoiceData();
    }, [jobId]);

    const loadInvoiceData = async () => {
        try {
            setLoading(true);



            let loadedUser: User | null = null;

            try {
                const storedUser =
                    await AsyncStorage.getItem(
                        USER_STORAGE_KEY
                    );

                if (storedUser) {
                    loadedUser =
                        JSON.parse(
                            storedUser
                        );

                    setUser(
                        loadedUser
                    );

                    console.log(
                        "INVOICE USER:",
                        loadedUser
                    );
                }
            } catch (userError) {
                console.error(
                    "User load error:",
                    userError
                );
            }

            const jobResponse =
                await getJobById({
                    id: Number(jobId),
                });

            const loadedJob =
                unwrapResponse<Job>(
                    jobResponse
                );

            if (!loadedJob) {
                Alert.alert(
                    "Error",
                    "Job could not be loaded."
                );

                return;
            }

            setJob(
                loadedJob
            );


            const companyId =
                loadedUser?.companyId ??
                null;

            console.log(
                "INVOICE COMPANY ID:",
                companyId
            );

            if (companyId) {
                try {
                    const companyResponse =
                        await getCompanyById(
                            Number(
                                companyId
                            )
                        );

                    const loadedCompany =
                        unwrapResponse<Company>(
                            companyResponse
                        );

                    if (
                        loadedCompany
                    ) {
                        setCompany(
                            loadedCompany
                        );

                        console.log(
                            "INVOICE COMPANY:",
                            loadedCompany
                        );

                        console.log(
                            "TAX PERCENTAGE:",
                            loadedCompany.taxPercentage
                        );

                        console.log(
                            "TAX INCLUDED:",
                            loadedCompany.taxIncluded
                        );
                    }
                } catch (
                companyError
                ) {
                    console.error(
                        "Company load error:",
                        companyError
                    );
                }
            }



            const loadedTicketId =
                loadedJob.ticketId ??
                null;

            if (loadedTicketId) {
                try {
                    const ticketResponse =
                        await getTicketById({
                            id: Number(
                                loadedTicketId
                            ),
                        });

                    const loadedTicket =
                        unwrapResponse<Ticket>(
                            ticketResponse
                        );

                    if (
                        loadedTicket
                    ) {
                        setTicket(
                            loadedTicket
                        );



                        if (
                            loadedTicket.customerId
                        ) {
                            try {
                                const customerResponse =
                                    await getCustomerById(
                                        Number(
                                            loadedTicket.customerId
                                        )
                                    );

                                const loadedCustomer =
                                    unwrapResponse<Customer>(
                                        customerResponse
                                    );

                                setCustomer(
                                    loadedCustomer
                                );
                            } catch (
                            customerError
                            ) {
                                console.error(
                                    "Customer load error:",
                                    customerError
                                );
                            }
                        }
                    }
                } catch (
                ticketError
                ) {
                    console.error(
                        "Ticket load error:",
                        ticketError
                    );
                }
            }


            try {
                const categoryResponse =
                    await getAllCategories();

                const loadedCategories =
                    unwrapResponse<Category[]>(
                        categoryResponse
                    );

                setCategories(
                    Array.isArray(
                        loadedCategories
                    )
                        ? loadedCategories
                        : []
                );
            } catch (
            categoryError
            ) {
                console.error(
                    "Category load error:",
                    categoryError
                );

                setCategories([]);
            }



            try {
                const partsResponse =
                    await getAllParts();

                const loadedParts =
                    unwrapResponse<Part[]>(
                        partsResponse
                    );

                setParts(
                    Array.isArray(
                        loadedParts
                    )
                        ? loadedParts
                        : []
                );
            } catch (
            partsError
            ) {
                console.error(
                    "Parts load error:",
                    partsError
                );

                setParts([]);
            }


            const initialCategoryId =
                loadedJob.categoryId ??
                loadedJob.category?.id ??
                null;

            if (
                initialCategoryId
            ) {
                setSelectedCategoryId(
                    Number(
                        initialCategoryId
                    )
                );
            }
        } catch (
        error
        ) {
            console.error(
                "Create invoice load error:",
                error
            );

            Alert.alert(
                "Error",
                "Unable to load invoice details."
            );
        } finally {
            setLoading(false);
        }
    };



    const selectedCategory =
        useMemo(() => {
            if (
                selectedCategoryId ===
                null
            ) {
                return null;
            }

            return (
                categories.find(
                    (category) =>
                        Number(
                            category.id
                        ) ===
                        Number(
                            selectedCategoryId
                        )
                ) ?? null
            );
        }, [
            categories,
            selectedCategoryId,
        ]);



    const filteredParts = useMemo(() => {
        if (selectedCategoryId === null) {
            return [];
        }

        return parts.filter((part) => {
            if (
                part.categoryId === null ||
                part.categoryId === undefined
            ) {
                return false;
            }

            return (
                Number(part.categoryId) ===
                Number(selectedCategoryId)
            );
        });
    }, [parts, selectedCategoryId]);

    const partsTotal =
        useMemo(() => {
            return selectedParts.reduce(
                (
                    total,
                    part
                ) =>
                    total +
                    Number(
                        part.lineTotal ||
                        0
                    ),
                0
            );
        }, [selectedParts]);



    const serviceChargeValue =
        useMemo(() => {
            const value =
                Number(
                    serviceCharge
                );

            if (
                Number.isNaN(
                    value
                )
            ) {
                return 0;
            }

            return Math.max(
                0,
                value
            );
        }, [serviceCharge]);


    const taxPercentage =
        useMemo(() => {
            const value =
                Number(
                    company?.taxPercentage ??
                    0
                );

            if (
                Number.isNaN(
                    value
                )
            ) {
                return 0;
            }

            return Math.max(
                0,
                value
            );
        }, [
            company?.taxPercentage,
        ]);



    const taxIncluded =
        Boolean(
            company?.taxIncluded
        );



    const subtotal =
        useMemo(() => {
            return (
                serviceChargeValue +
                partsTotal
            );
        }, [
            serviceChargeValue,
            partsTotal,
        ]);


    const taxCalculation =
        useMemo(() => {
            const totalTaxRate =
                Math.max(
                    0,
                    Number(
                        taxPercentage
                    ) || 0
                );

            const componentTaxRate =
                totalTaxRate / 2;

            if (
                totalTaxRate <= 0 ||
                subtotal <= 0
            ) {
                return {
                    taxableAmount:
                        subtotal,

                    taxAmount:
                        0,

                    cgstAmount:
                        0,

                    sgstAmount:
                        0,

                    totalAmount:
                        subtotal,

                    totalTaxRate,

                    componentTaxRate,
                };
            }

            if (taxIncluded) {
                const divisor =
                    1 +
                    totalTaxRate /
                    100;

                const taxableAmount =
                    subtotal /
                    divisor;

                const taxAmount =
                    subtotal -
                    taxableAmount;

                const cgstAmount =
                    taxAmount / 2;

                const sgstAmount =
                    taxAmount / 2;

                return {
                    taxableAmount,

                    taxAmount,

                    cgstAmount,

                    sgstAmount,

                    totalAmount:
                        subtotal,

                    totalTaxRate,

                    componentTaxRate,
                };
            }

            const taxAmount =
                subtotal *
                (totalTaxRate /
                    100);

            const cgstAmount =
                taxAmount / 2;

            const sgstAmount =
                taxAmount / 2;

            return {
                taxableAmount:
                    subtotal,

                taxAmount,

                cgstAmount,

                sgstAmount,

                totalAmount:
                    subtotal +
                    taxAmount,

                totalTaxRate,

                componentTaxRate,
            };
        }, [
            subtotal,
            taxPercentage,
            taxIncluded,
        ]);



    const taxAmountValue =
        taxCalculation.taxAmount;

    const cgstAmount =
        taxCalculation.cgstAmount;

    const sgstAmount =
        taxCalculation.sgstAmount;

    const totalGstRate =
        taxCalculation.totalTaxRate;

    const gstComponentRate =
        taxCalculation.componentTaxRate;


    const totalPrice =
        taxCalculation.totalAmount;



    const workingHours =
        useMemo(() => {
            if (!job) {
                return 0;
            }

            if (
                job.workingHours !==
                null &&
                job.workingHours !==
                undefined
            ) {
                return Number(
                    job.workingHours
                );
            }

            if (
                job.startingDateTime &&
                job.endingDateTime
            ) {
                const start =
                    new Date(
                        job.startingDateTime
                    ).getTime();

                const end =
                    new Date(
                        job.endingDateTime
                    ).getTime();

                if (
                    !Number.isNaN(
                        start
                    ) &&
                    !Number.isNaN(
                        end
                    ) &&
                    end > start
                ) {
                    return (
                        (end - start) /
                        (1000 *
                            60 *
                            60)
                    );
                }
            }

            return 0;
        }, [job]);


    const getCategoryName = (
        category: Category
    ) => {
        return (
            category.categoryName ||
            category.name ||
            category.categoryId ||
            `Category ${category.id}`
        );
    };


    const getPartName = (part: Part) => {
        return (
            part.name ||
            part.sku ||
            `Part ${part.id}`
        );
    };

    const getPartNumber = (part: Part) => {
        return part.sku || "";
    };





    const handleCategorySelect = (
        categoryId: number
    ) => {
        setSelectedCategoryId(
            categoryId
        );

        setSelectedParts([]);

        setShowCategoryDropdown(
            false
        );

        setShowPartDropdown(
            false
        );
    };



    const addPart = (part: Part) => {
        const existingPart = selectedParts.find(
            (item) =>
                Number(item.partId) ===
                Number(part.id)
        );

        if (existingPart) {
            Alert.alert(
                "Part already added",
                "This part is already included in the invoice."
            );

            return;
        }

        const unitPrice = Math.max(
            0,
            Number(
                part.retailPrice ??
                part.unitPrice ??
                0
            )
        );

        const newPart: SelectedPart = {
            partId: Number(part.id),

            partName: getPartName(part),

            partNumber: getPartNumber(part),

            quantity: 1,

            unitPrice,

            lineTotal: unitPrice,
        };

        setSelectedParts((current) => [
            ...current,
            newPart,
        ]);

        setShowPartDropdown(false);
    };


    const removePart = (
        partId: number
    ) => {
        setSelectedParts(
            (
                current
            ) =>
                current.filter(
                    (
                        part
                    ) =>
                        Number(
                            part.partId
                        ) !==
                        Number(
                            partId
                        )
                )
        );
    };


    const updatePartQuantity = (
        partId: number,
        value: string
    ) => {
        const numericValue =
            Number(
                value
            );

        const quantity =
            Number.isNaN(
                numericValue
            )
                ? 0
                : Math.max(
                    0,
                    numericValue
                );

        setSelectedParts(
            (
                current
            ) =>
                current.map(
                    (
                        part
                    ) => {
                        if (
                            Number(
                                part.partId
                            ) !==
                            Number(
                                partId
                            )
                        ) {
                            return part;
                        }

                        return {
                            ...part,

                            quantity,

                            lineTotal:
                                quantity *
                                part.unitPrice,
                        };
                    }
                )
        );
    };


    const updatePartPrice = (
        partId: number,
        value: string
    ) => {
        const numericValue =
            Number(
                value
            );

        const unitPrice =
            Number.isNaN(
                numericValue
            )
                ? 0
                : Math.max(
                    0,
                    numericValue
                );

        setSelectedParts(
            (
                current
            ) =>
                current.map(
                    (
                        part
                    ) => {
                        if (
                            Number(
                                part.partId
                            ) !==
                            Number(
                                partId
                            )
                        ) {
                            return part;
                        }

                        return {
                            ...part,

                            unitPrice,

                            lineTotal:
                                part.quantity *
                                unitPrice,
                        };
                    }
                )
        );
    };



    const upiQrValue = useMemo(() => {
        if (!businessUpiId) {
            return "";
        }

        const amount = totalPrice.toFixed(2);

        const transactionNote = `Invoice ${job?.jobId ||
            job?.id ||
            ""
            }`;

        return (
            `upi://pay?pa=${encodeURIComponent(
                businessUpiId
            )}` +
            `&pn=${encodeURIComponent(
                businessUpiName
            )}` +
            `&am=${encodeURIComponent(
                amount
            )}` +
            `&cu=INR` +
            `&tn=${encodeURIComponent(
                transactionNote
            )}`
        );
    }, [
        businessUpiId,
        businessUpiName,
        totalPrice,
        job,
    ]);

    const openUpiPayment = () => {
        if (totalPrice <= 0) {
            Alert.alert(
                "Amount required",
                "Please enter a service charge or add a part before accepting UPI payment."
            );

            return;
        }

        if (!businessUpiId) {
            Alert.alert(
                "UPI ID Required",
                "The logged-in user does not have a UPI ID configured."
            );

            return;
        }

        setUpiPaymentConfirmed(false);

        setShowUpiPaymentModal(true);
    };



    const confirmUpiPayment = () => {
        Alert.alert(
            "Confirm Payment",
            `Have you received ₹${totalPrice.toFixed(
                2
            )} from the customer?`,
            [
                {
                    text: "Not Yet",
                    style: "cancel",
                },
                {
                    text: "Yes, Payment Received",
                    onPress: () => {
                        setPaymentStatus(
                            "PAID"
                        );

                        setPaymentMethod(
                            "UPI"
                        );

                        setUpiPaymentConfirmed(
                            true
                        );

                        setShowUpiPaymentModal(
                            false
                        );
                    },
                },
            ]
        );
    };

    /*
     * ============================================================
     * CREATE PAYLOAD
     * ============================================================
     */

    const generateInvoicePayload =
        () => {
            if (!job) {
                return null;
            }

            const ticketId =
                job.ticketId ??
                ticket?.id ??
                null;

            if (!ticketId) {
                throw new Error(
                    "Ticket ID is missing for this job."
                );
            }

            if (
                selectedCategoryId ===
                null
            ) {
                throw new Error(
                    "Please select a category."
                );
            }

            const invoiceJobIds = [
                Number(
                    job.id
                ),
            ];

            return {
                /*
                 * BASIC
                 */
                ticketId:
                    Number(
                        ticketId
                    ),

                jobIds:
                    invoiceJobIds,

                serviceTypeId:
                    ticket?.serviceTypeId ??
                    null,

                categoryId:
                    Number(
                        selectedCategoryId
                    ),

                /*
                 * COMPANY
                 */
                companyId:
                    user?.companyId ??
                    null,

                /*
                 * AMOUNTS
                 */
                serviceCharge:
                    Number(
                        serviceChargeValue.toFixed(
                            2
                        )
                    ),

                partsCharge:
                    Number(
                        partsTotal.toFixed(
                            2
                        )
                    ),

                /*
                 * TAX
                 */
                taxPercentage:
                    Number(
                        taxPercentage.toFixed(
                            2
                        )
                    ),

                taxIncluded:
                    taxIncluded,

                taxAmount:
                    Number(
                        taxAmountValue.toFixed(
                            2
                        )
                    ),

                sgstAmount:
                    Number(
                        sgstAmount.toFixed(
                            2
                        )
                    ),

                /*
                 * The current backend uses the existing igstAmount
                 * field name for the second GST component.
                 * In this invoice flow that component is CGST.
                 * The UI and calculation are CGST + SGST.
                 */
                igstAmount:
                    Number(
                        cgstAmount.toFixed(
                            2
                        )
                    ),

                /*
                 * TOTAL
                 */
                totalPrice:
                    Number(
                        totalPrice.toFixed(
                            2
                        )
                    ),

                workingHours:
                    Number(
                        workingHours.toFixed(
                            2
                        )
                    ),

                /*
                 * STATUS
                 */
                status:
                    "ISSUED",

                paymentStatus:
                    paymentStatus,

                paymentMethod:
                    paymentMethod.trim() ||
                    null,

                /*
                 * PART
                 *
                 * Keep first part for
                 * compatibility with
                 * your current backend.
                 */
                partId:
                    selectedParts.length >
                        0
                        ? Number(
                            selectedParts[0]
                                .partId
                        )
                        : null,

                /*
                 * CREATED BY
                 */
                createdBy:
                    user?.phone ||
                    String(
                        job.userId ??
                        "technician"
                    ),
            };
        };

    /*
     * ============================================================
     * CREATE INVOICE
     * ============================================================
     */
const handleCreateInvoice = async () => {
    if (creating) {
        return;
    }

    if (!job) {
        Alert.alert(
            "Error",
            "Job information is missing."
        );

        return;
    }

    /*
     * ============================================================
     * CHECK JOB COMPLETION
     *
     * employeeStatus is the completion state used by this
     * invoice screen.
     * ============================================================
     */
    const normalizedEmployeeStatus = String(
        job.employeeStatus || ""
    )
        .trim()
        .toLowerCase();

    const normalizedJobStatus = String(
        job.status || ""
    )
        .trim()
        .toLowerCase();

    const isCompleted =
        normalizedEmployeeStatus === "completed" ||
        normalizedJobStatus === "completed";

    if (!isCompleted) {
        Alert.alert(
            "Job not completed",
            "An invoice can only be created for a completed job."
        );

        return;
    }

    /*
     * ============================================================
     * CHECK AMOUNT
     * ============================================================
     */
    if (
        serviceChargeValue <= 0 &&
        partsTotal <= 0
    ) {
        Alert.alert(
            "Amount required",
            "Please enter a service charge or add at least one part."
        );

        return;
    }

    /*
     * ============================================================
     * UPI PAYMENT
     * ============================================================
     */
    if (
        paymentMethod === "UPI" &&
        paymentStatus !== "PAID"
    ) {
        openUpiPayment();

        return;
    }

    try {
        /*
         * ========================================================
         * GENERATE INVOICE PAYLOAD
         * ========================================================
         */
        const payload =
            generateInvoicePayload();

        if (!payload) {
            return;
        }

        setCreating(true);

        console.log(
            "================================"
        );

        console.log(
            "CREATE INVOICE PAYLOAD"
        );

        console.log(
            JSON.stringify(
                payload,
                null,
                2
            )
        );

        /*
         * ========================================================
         * CREATE INVOICE
         * ========================================================
         */
        const invoiceResponse =
            await createInvoice(
                payload as any
            );

        const createdInvoice =
            unwrapResponse<any>(
                invoiceResponse
            );

        if (!createdInvoice) {
            throw new Error(
                "Invoice could not be created."
            );
        }

        console.log(
            "================================"
        );

        console.log(
            "INVOICE CREATED SUCCESSFULLY"
        );

        console.log(
            JSON.stringify(
                createdInvoice,
                null,
                2
            )
        );

        /*
         * ========================================================
         * IMPORTANT
         *
         * DO NOT UPDATE THE JOB HERE.
         *
         * Creating an invoice must NOT:
         *
         * 1. Remove userId
         * 2. Change assigned technician
         * 3. Change status
         * 4. Change employeeStatus
         * 5. Change CLOSED -> UNASSIGNED
         *
         * The job should remain exactly as it was.
         * ========================================================
         */

        /*
         * ========================================================
         * SUCCESS
         * ========================================================
         */
        Alert.alert(
            "Invoice Created",
            `Invoice ${
                createdInvoice.invoiceId || ""
            } was created successfully.\n\n` +
                `Subtotal: ₹${subtotal.toFixed(
                    2
                )}\n` +
                `GST: ${totalGstRate.toFixed(
                    2
                )}% = ₹${taxAmountValue.toFixed(
                    2
                )}\n` +
                `CGST ${gstComponentRate.toFixed(
                    2
                )}%: ₹${cgstAmount.toFixed(
                    2
                )}\n` +
                `SGST ${gstComponentRate.toFixed(
                    2
                )}%: ₹${sgstAmount.toFixed(
                    2
                )}\n` +
                `Total: ₹${totalPrice.toFixed(
                    2
                )}\n\n` +
                `Payment Status: ${
                    paymentStatus
                }\n` +
                `Payment Method: ${
                    paymentMethod ||
                    "Not specified"
                }`,
            [
                {
                    text: "OK",
                    onPress: () => {
                        onSuccess?.();
                    },
                },
            ]
        );
    } catch (
        error: any
    ) {
        console.error(
            "Create invoice error:",
            error
        );

        const backendMessage =
            error?.response
                ?.data
                ?.message ||
            error?.response
                ?.data
                ?.error ||
            error?.message;

        Alert.alert(
            "Unable to create invoice",
            backendMessage ||
                "Something went wrong while creating the invoice."
        );
    } finally {
        setCreating(false);
    }
};
   

    if (loading) {
        return (
            <View
                style={
                    styles.loadingScreen
                }
            >
                <ActivityIndicator
                    size="large"
                    color="#111111"
                />

                <Text
                    style={
                        styles.loadingText
                    }
                >
                    Preparing invoice...
                </Text>
            </View>
        );
    }


    if (!job) {
        return (
            <View
                style={
                    styles.emptyScreen
                }
            >
                <Ionicons
                    name="receipt-outline"
                    size={60}
                    color="#111111"
                />

                <Text
                    style={
                        styles.emptyTitle
                    }
                >
                    Job not found
                </Text>

                <TouchableOpacity
                    style={
                        styles.backButton
                    }
                    onPress={
                        onBack
                    }
                >
                    <Ionicons
                        name="arrow-back"
                        size={20}
                        color="#FFFFFF"
                    />

                    <Text
                        style={
                            styles.backButtonText
                        }
                    >
                        Back
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    const selectedPartIds =
        selectedParts.map(
            (
                part
            ) =>
                part.partId
        );

    const availableParts =
        filteredParts.filter(
            (
                part
            ) =>
                !selectedPartIds.includes(
                    Number(
                        part.id
                    )
                )
        );



    return (
        <KeyboardAvoidingView
            style={
                styles.screen
            }
            behavior={
                Platform.OS ===
                    "ios"
                    ? "padding"
                    : undefined
            }
        >
            {/* HEADER */}
            <View
                style={
                    styles.header
                }
            >
                <TouchableOpacity
                    style={
                        styles.headerBackButton
                    }
                    onPress={
                        onBack
                    }
                    disabled={
                        creating
                    }
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <Text
                    style={
                        styles.headerTitle
                    }
                >
                    Create Invoice
                </Text>

                <View
                    style={
                        styles.headerRight
                    }
                />
            </View>

            <ScrollView
                style={
                    styles.scrollView
                }
                contentContainerStyle={
                    styles.scrollContent
                }
                showsVerticalScrollIndicator={
                    false
                }
                keyboardShouldPersistTaps="handled"
            >

                <View
                    style={
                        styles.card
                    }
                >
                    <View
                        style={
                            styles.cardTitleRow
                        }
                    >
                        <View
                            style={
                                styles.iconContainer
                            }
                        >
                            <Ionicons
                                name="business-outline"
                                size={20}
                                color="#111111"
                            />
                        </View>

                        <Text
                            style={
                                styles.cardTitle
                            }
                        >
                            Company
                        </Text>
                    </View>

                    <View
                        style={
                            styles.detailRow
                        }
                    >
                        <Text
                            style={
                                styles.detailLabel
                            }
                        >
                            Company
                        </Text>

                        <Text
                            style={
                                styles.detailValue
                            }
                        >
                            {company?.brandName ||
                                company?.legalName ||
                                "Not available"}
                        </Text>
                    </View>

                    {company?.gstNumber ? (
                        <View
                            style={
                                styles.detailRow
                            }
                        >
                            <Text
                                style={
                                    styles.detailLabel
                                }
                            >
                                GSTIN
                            </Text>

                            <Text
                                style={
                                    styles.detailValue
                                }
                            >
                                {
                                    company.gstNumber
                                }
                            </Text>
                        </View>
                    ) : null}

                    <View
                        style={
                            styles.detailRow
                        }
                    >
                        <Text
                            style={
                                styles.detailLabel
                            }
                        >
                            Tax
                        </Text>

                        <Text
                            style={
                                styles.detailValue
                            }
                        >
                            {taxPercentage >
                                0
                                ? `${taxPercentage.toFixed(
                                    2
                                )}% ${taxIncluded
                                    ? "(Included)"
                                    : "(Extra)"
                                }`
                                : "No Tax"}
                        </Text>
                    </View>
                </View>

                {/* ==================================================
                    JOB DETAILS
                   ================================================== */}

                <View
                    style={
                        styles.card
                    }
                >
                    <View
                        style={
                            styles.cardTitleRow
                        }
                    >
                        <View
                            style={
                                styles.iconContainer
                            }
                        >
                            <Ionicons
                                name="briefcase-outline"
                                size={20}
                                color="#111111"
                            />
                        </View>

                        <Text
                            style={
                                styles.cardTitle
                            }
                        >
                            Job Details
                        </Text>
                    </View>

                    <View
                        style={
                            styles.detailRow
                        }
                    >
                        <Text
                            style={
                                styles.detailLabel
                            }
                        >
                            Job
                        </Text>

                        <Text
                            style={
                                styles.detailValue
                            }
                        >
                            {job.jobId ||
                                `JOB-${job.id}`}
                        </Text>
                    </View>

                    <View
                        style={
                            styles.detailRow
                        }
                    >
                        <Text
                            style={
                                styles.detailLabel
                            }
                        >
                            Title
                        </Text>

                        <Text
                            style={
                                styles.detailValue
                            }
                        >
                            {job.jobTitle ||
                                "Service Job"}
                        </Text>
                    </View>

                    <View
                        style={
                            styles.detailRow
                        }
                    >
                        <Text
                            style={
                                styles.detailLabel
                            }
                        >
                            Status
                        </Text>

                        <View
                            style={
                                styles.completedBadge
                            }
                        >
                            <Text
                                style={
                                    styles.completedBadgeText
                                }
                            >
                                Completed
                            </Text>
                        </View>
                    </View>

                    <View
                        style={
                            styles.detailRow
                        }
                    >
                        <Text
                            style={
                                styles.detailLabel
                            }
                        >
                            Customer
                        </Text>

                        <Text
                            style={
                                styles.detailValue
                            }
                        >
                            {customer?.name ||
                                "Not available"}
                        </Text>
                    </View>

                    {customer?.phone ? (
                        <View
                            style={
                                styles.detailRow
                            }
                        >
                            <Text
                                style={
                                    styles.detailLabel
                                }
                            >
                                Phone
                            </Text>

                            <Text
                                style={
                                    styles.detailValue
                                }
                            >
                                {String(
                                    customer.phone
                                )}
                            </Text>
                        </View>
                    ) : null}

                    <View
                        style={
                            styles.detailRow
                        }
                    >
                        <Text
                            style={
                                styles.detailLabel
                            }
                        >
                            Working Hours
                        </Text>

                        <Text
                            style={
                                styles.detailValue
                            }
                        >
                            {workingHours.toFixed(
                                2
                            )}{" "}
                            hrs
                        </Text>
                    </View>
                </View>

                {/* ==================================================
                    CATEGORY
                   ================================================== */}

                <View
                    style={
                        styles.card
                    }
                >
                    <View
                        style={
                            styles.cardTitleRow
                        }
                    >
                        <View
                            style={
                                styles.iconContainer
                            }
                        >
                            <Ionicons
                                name="grid-outline"
                                size={20}
                                color="#111111"
                            />
                        </View>

                        <Text
                            style={
                                styles.cardTitle
                            }
                        >
                            Category
                        </Text>
                    </View>

                    <Text
                        style={
                            styles.inputLabel
                        }
                    >
                        Category
                    </Text>

                    <TouchableOpacity
                        style={
                            styles.dropdown
                        }
                        onPress={() =>
                            setShowCategoryDropdown(
                                (
                                    value
                                ) =>
                                    !value
                            )
                        }
                        disabled={
                            creating
                        }
                    >
                        <Text
                            style={[
                                styles.dropdownText,

                                !selectedCategory &&
                                styles.dropdownPlaceholder,
                            ]}
                        >
                            {selectedCategory
                                ? getCategoryName(
                                    selectedCategory
                                )
                                : "Select category"}
                        </Text>

                        <Ionicons
                            name={
                                showCategoryDropdown
                                    ? "chevron-up"
                                    : "chevron-down"
                            }
                            size={20}
                            color="#555555"
                        />
                    </TouchableOpacity>

                    {showCategoryDropdown && (
                        <View
                            style={
                                styles.dropdownList
                            }
                        >
                            {categories.length ===
                                0 ? (
                                <Text
                                    style={
                                        styles.emptyDropdownText
                                    }
                                >
                                    No categories
                                    available.
                                </Text>
                            ) : (
                                categories.map(
                                    (
                                        category
                                    ) => (
                                        <TouchableOpacity
                                            key={
                                                category.id
                                            }
                                            style={
                                                styles.dropdownItem
                                            }
                                            onPress={() =>
                                                handleCategorySelect(
                                                    Number(
                                                        category.id
                                                    )
                                                )
                                            }
                                        >
                                            <Text
                                                style={
                                                    styles.dropdownItemText
                                                }
                                            >
                                                {getCategoryName(
                                                    category
                                                )}
                                            </Text>

                                            {Number(
                                                category.id
                                            ) ===
                                                Number(
                                                    selectedCategoryId
                                                ) && (
                                                    <Ionicons
                                                        name="checkmark"
                                                        size={
                                                            20
                                                        }
                                                        color="#111111"
                                                    />
                                                )}
                                        </TouchableOpacity>
                                    )
                                )
                            )}
                        </View>
                    )}

                    <Text
                        style={
                            styles.helperText
                        }
                    >
                        Parts are filtered by the
                        selected category.
                    </Text>
                </View>

                {/* ==================================================
                    PARTS
                   ================================================== */}

                <View
                    style={
                        styles.card
                    }
                >
                    <View
                        style={
                            styles.cardTitleRow
                        }
                    >
                        <View
                            style={
                                styles.iconContainer
                            }
                        >
                            <Ionicons
                                name="construct-outline"
                                size={20}
                                color="#111111"
                            />
                        </View>

                        <Text
                            style={
                                styles.cardTitle
                            }
                        >
                            Parts
                        </Text>
                    </View>

                    {!selectedCategoryId ? (
                        <View
                            style={
                                styles.infoBox
                            }
                        >
                            <Ionicons
                                name="information-circle-outline"
                                size={22}
                                color="#555555"
                            />

                            <Text
                                style={
                                    styles.infoText
                                }
                            >
                                Select a category first
                                to view available
                                parts.
                            </Text>
                        </View>
                    ) : (
                        <>
                            <TouchableOpacity
                                style={
                                    styles.addPartButton
                                }
                                onPress={() =>
                                    setShowPartDropdown(
                                        (
                                            value
                                        ) =>
                                            !value
                                    )
                                }
                                disabled={
                                    creating
                                }
                            >
                                <Ionicons
                                    name="add-circle-outline"
                                    size={20}
                                    color="#FFFFFF"
                                />

                                <Text
                                    style={
                                        styles.addPartButtonText
                                    }
                                >
                                    Add Part
                                </Text>

                                <Ionicons
                                    name={
                                        showPartDropdown
                                            ? "chevron-up"
                                            : "chevron-down"
                                    }
                                    size={18}
                                    color="#FFFFFF"
                                />
                            </TouchableOpacity>

                            {showPartDropdown && (
                                <View
                                    style={
                                        styles.partDropdownList
                                    }
                                >
                                    {availableParts.length ===
                                        0 ? (
                                        <Text
                                            style={
                                                styles.emptyDropdownText
                                            }
                                        >
                                            No more parts
                                            available for
                                            this category.
                                        </Text>
                                    ) : (
                                        availableParts.map(
                                            (
                                                part
                                            ) => (
                                                <TouchableOpacity
                                                    key={
                                                        part.id
                                                    }
                                                    style={
                                                        styles.partDropdownItem
                                                    }
                                                    onPress={() =>
                                                        addPart(
                                                            part
                                                        )
                                                    }
                                                >
                                                    <View
                                                        style={
                                                            styles.partDropdownInfo
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                styles.partDropdownName
                                                            }
                                                        >
                                                            {getPartName(
                                                                part
                                                            )}
                                                        </Text>

                                                        {getPartNumber(
                                                            part
                                                        ) ? (
                                                            <Text
                                                                style={
                                                                    styles.partDropdownNumber
                                                                }
                                                            >
                                                                Part No:{" "}
                                                                {getPartNumber(
                                                                    part
                                                                )}
                                                            </Text>
                                                        ) : null}
                                                    </View>

                                                    <Text style={styles.partDropdownPrice}>
                                                        ₹
                                                        {Number(
                                                            part.retailPrice ??
                                                            part.unitPrice ??
                                                            0
                                                        ).toFixed(2)}
                                                    </Text>
                                                </TouchableOpacity>
                                            )
                                        )
                                    )}
                                </View>
                            )}

                            {selectedParts.length ===
                                0 ? (
                                <View
                                    style={
                                        styles.noPartsContainer
                                    }
                                >
                                    <Ionicons
                                        name="cube-outline"
                                        size={30}
                                        color="#AAAAAA"
                                    />

                                    <Text
                                        style={
                                            styles.noPartsText
                                        }
                                    >
                                        No parts added yet.
                                    </Text>
                                </View>
                            ) : (
                                selectedParts.map(
                                    (
                                        part
                                    ) => (
                                        <View
                                            key={
                                                part.partId
                                            }
                                            style={
                                                styles.partCard
                                            }
                                        >
                                            <View
                                                style={
                                                    styles.partHeader
                                                }
                                            >
                                                <View
                                                    style={
                                                        styles.partIcon
                                                    }
                                                >
                                                    <Ionicons
                                                        name="cube-outline"
                                                        size={
                                                            20
                                                        }
                                                        color="#111111"
                                                    />
                                                </View>

                                                <View
                                                    style={
                                                        styles.partHeaderInfo
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.partName
                                                        }
                                                    >
                                                        {
                                                            part.partName
                                                        }
                                                    </Text>

                                                    {part.partNumber ? (
                                                        <Text
                                                            style={
                                                                styles.partNumber
                                                            }
                                                        >
                                                            Part No:{" "}
                                                            {
                                                                part.partNumber
                                                            }
                                                        </Text>
                                                    ) : null}
                                                </View>

                                                <TouchableOpacity
                                                    style={
                                                        styles.removePartButton
                                                    }
                                                    onPress={() =>
                                                        removePart(
                                                            part.partId
                                                        )
                                                    }
                                                    disabled={
                                                        creating
                                                    }
                                                >
                                                    <Ionicons
                                                        name="trash-outline"
                                                        size={
                                                            19
                                                        }
                                                        color="#222222"
                                                    />
                                                </TouchableOpacity>
                                            </View>

                                            <View
                                                style={
                                                    styles.partInputsRow
                                                }
                                            >
                                                <View
                                                    style={
                                                        styles.partInputContainer
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.inputLabel
                                                        }
                                                    >
                                                        Quantity
                                                    </Text>

                                                    <TextInput
                                                        style={
                                                            styles.numberInput
                                                        }
                                                        value={String(
                                                            part.quantity
                                                        )}
                                                        onChangeText={(
                                                            value
                                                        ) =>
                                                            updatePartQuantity(
                                                                part.partId,
                                                                value
                                                            )
                                                        }
                                                        keyboardType="decimal-pad"
                                                        editable={
                                                            !creating
                                                        }
                                                    />
                                                </View>

                                                <View
                                                    style={
                                                        styles.partInputContainer
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.inputLabel
                                                        }
                                                    >
                                                        Unit Price
                                                    </Text>

                                                    <TextInput
                                                        style={
                                                            styles.numberInput
                                                        }
                                                        value={String(
                                                            part.unitPrice
                                                        )}
                                                        onChangeText={(
                                                            value
                                                        ) =>
                                                            updatePartPrice(
                                                                part.partId,
                                                                value
                                                            )
                                                        }
                                                        keyboardType="decimal-pad"
                                                        editable={
                                                            !creating
                                                        }
                                                    />
                                                </View>

                                                <View
                                                    style={
                                                        styles.lineTotalContainer
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.inputLabel
                                                        }
                                                    >
                                                        Total
                                                    </Text>

                                                    <Text
                                                        style={
                                                            styles.lineTotal
                                                        }
                                                    >
                                                        ₹
                                                        {part.lineTotal.toFixed(
                                                            2
                                                        )}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                )
                            )}

                            {selectedParts.length >
                                0 && (
                                    <View
                                        style={
                                            styles.partsTotalRow
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.partsTotalLabel
                                            }
                                        >
                                            Parts Charge
                                        </Text>

                                        <Text
                                            style={
                                                styles.partsTotalValue
                                            }
                                        >
                                            ₹
                                            {partsTotal.toFixed(
                                                2
                                            )}
                                        </Text>
                                    </View>
                                )}
                        </>
                    )}
                </View>

                {/* ==================================================
                    SERVICE CHARGE
                   ================================================== */}

                <View
                    style={
                        styles.card
                    }
                >
                    <View
                        style={
                            styles.cardTitleRow
                        }
                    >
                        <View
                            style={
                                styles.iconContainer
                            }
                        >
                            <Ionicons
                                name="cash-outline"
                                size={20}
                                color="#111111"
                            />
                        </View>

                        <Text
                            style={
                                styles.cardTitle
                            }
                        >
                            Service Charge
                        </Text>
                    </View>

                    <Text
                        style={
                            styles.inputLabel
                        }
                    >
                        Service Charge
                    </Text>

                    <View
                        style={
                            styles.currencyInputWrapper
                        }
                    >
                        <Text
                            style={
                                styles.currencySymbol
                            }
                        >
                            ₹
                        </Text>

                        <TextInput
                            style={
                                styles.currencyInput
                            }
                            value={
                                serviceCharge
                            }
                            onChangeText={
                                setServiceCharge
                            }
                            placeholder="0.00"
                            placeholderTextColor="#999999"
                            keyboardType="decimal-pad"
                            editable={
                                !creating
                            }
                        />
                    </View>
                </View>

                {/* ==================================================
                    TAX INFORMATION
                   ================================================== */}

                <View
                    style={
                        styles.card
                    }
                >
                    <View
                        style={
                            styles.cardTitleRow
                        }
                    >
                        <View
                            style={
                                styles.iconContainer
                            }
                        >
                            <Ionicons
                                name="receipt-outline"
                                size={20}
                                color="#111111"
                            />
                        </View>

                        <Text
                            style={
                                styles.cardTitle
                            }
                        >
                            Tax Summary
                        </Text>
                    </View>

                    {taxPercentage <=
                        0 ? (
                        <View
                            style={{
                                padding: 14,
                                borderRadius: 10,
                                backgroundColor:
                                    "#F5F5F5",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: "#444444",
                                    fontWeight:
                                        "600",
                                }}
                            >
                                No tax configured for
                                this company.
                            </Text>
                        </View>
                    ) : (
                        <>
                            <View
                                style={
                                    styles.detailRow
                                }
                            >
                                <Text
                                    style={
                                        styles.detailLabel
                                    }
                                >
                                    Tax Percentage
                                </Text>

                                <Text
                                    style={
                                        styles.detailValue
                                    }
                                >
                                    {taxPercentage.toFixed(
                                        2
                                    )}
                                    %
                                </Text>
                            </View>

                            <View
                                style={
                                    styles.detailRow
                                }
                            >
                                <Text
                                    style={
                                        styles.detailLabel
                                    }
                                >
                                    Tax Mode
                                </Text>

                                <Text
                                    style={
                                        styles.detailValue
                                    }
                                >
                                    {taxIncluded
                                        ? "Tax Included"
                                        : "Tax Extra"}
                                </Text>
                            </View>

                            <View
                                style={
                                    styles.detailRow
                                }
                            >
                                <Text
                                    style={
                                        styles.detailLabel
                                    }
                                >
                                    Taxable Amount
                                </Text>

                                <Text
                                    style={
                                        styles.detailValue
                                    }
                                >
                                    ₹
                                    {taxCalculation.taxableAmount.toFixed(
                                        2
                                    )}
                                </Text>
                            </View>

                            <View
                                style={
                                    styles.detailRow
                                }
                            >
                                <Text
                                    style={
                                        styles.detailLabel
                                    }
                                >
                                    CGST ({gstComponentRate.toFixed(2)}%)
                                </Text>

                                <Text
                                    style={
                                        styles.detailValue
                                    }
                                >
                                    ₹
                                    {cgstAmount.toFixed(
                                        2
                                    )}
                                </Text>
                            </View>

                            <View
                                style={
                                    styles.detailRow
                                }
                            >
                                <Text
                                    style={
                                        styles.detailLabel
                                    }
                                >
                                    SGST ({gstComponentRate.toFixed(2)}%)
                                </Text>

                                <Text
                                    style={
                                        styles.detailValue
                                    }
                                >
                                    ₹
                                    {sgstAmount.toFixed(
                                        2
                                    )}
                                </Text>
                            </View>

                            <View
                                style={
                                    styles.detailRow
                                }
                            >
                                <Text
                                    style={
                                        styles.detailLabel
                                    }
                                >
                                    Total GST ({totalGstRate.toFixed(2)}%)
                                </Text>

                                <Text
                                    style={[
                                        styles.detailValue,
                                        {
                                            fontWeight:
                                                "800",
                                        },
                                    ]}
                                >
                                    ₹
                                    {taxAmountValue.toFixed(
                                        2
                                    )}
                                </Text>
                            </View>
                        </>
                    )}
                </View>

                {/* ==================================================
                    PAYMENT
                   ================================================== */}

                <View
                    style={
                        styles.card
                    }
                >
                    <View
                        style={
                            styles.cardTitleRow
                        }
                    >
                        <View
                            style={
                                styles.iconContainer
                            }
                        >
                            <Ionicons
                                name="card-outline"
                                size={20}
                                color="#111111"
                            />
                        </View>

                        <Text
                            style={
                                styles.cardTitle
                            }
                        >
                            Payment
                        </Text>
                    </View>

                    <Text
                        style={
                            styles.inputLabel
                        }
                    >
                        Payment Status
                    </Text>

                    <TouchableOpacity
                        style={
                            styles.dropdown
                        }
                        onPress={() =>
                            setShowPaymentStatusDropdown(
                                (
                                    value
                                ) =>
                                    !value
                            )
                        }
                        disabled={
                            creating
                        }
                    >
                        <Text
                            style={
                                styles.dropdownText
                            }
                        >
                            {
                                paymentStatus
                            }
                        </Text>

                        <Ionicons
                            name={
                                showPaymentStatusDropdown
                                    ? "chevron-up"
                                    : "chevron-down"
                            }
                            size={20}
                            color="#555555"
                        />
                    </TouchableOpacity>

                    {showPaymentStatusDropdown && (
                        <View
                            style={
                                styles.dropdownList
                            }
                        >
                            {[
                                "PENDING",
                                "PAID",
                                "PARTIAL",
                                "FAILED",
                            ].map(
                                (
                                    status
                                ) => (
                                    <TouchableOpacity
                                        key={
                                            status
                                        }
                                        style={
                                            styles.dropdownItem
                                        }
                                        onPress={() => {
                                            setPaymentStatus(
                                                status
                                            );

                                            setShowPaymentStatusDropdown(
                                                false
                                            );
                                        }}
                                    >
                                        <Text
                                            style={
                                                styles.dropdownItemText
                                            }
                                        >
                                            {
                                                status
                                            }
                                        </Text>

                                        {paymentStatus ===
                                            status && (
                                                <Ionicons
                                                    name="checkmark"
                                                    size={
                                                        20
                                                    }
                                                    color="#111111"
                                                />
                                            )}
                                    </TouchableOpacity>
                                )
                            )}
                        </View>
                    )}

                    <Text
                        style={[
                            styles.inputLabel,
                            styles.paymentMethodLabel,
                        ]}
                    >
                        Payment Method
                    </Text>

                    <TouchableOpacity
                        style={
                            styles.dropdown
                        }
                        onPress={() =>
                            setShowPaymentMethodDropdown(
                                (
                                    value
                                ) =>
                                    !value
                            )
                        }
                        disabled={
                            creating
                        }
                    >
                        <Text
                            style={[
                                styles.dropdownText,

                                !paymentMethod &&
                                styles.dropdownPlaceholder,
                            ]}
                        >
                            {paymentMethod ||
                                "Select payment method"}
                        </Text>

                        <Ionicons
                            name={
                                showPaymentMethodDropdown
                                    ? "chevron-up"
                                    : "chevron-down"
                            }
                            size={20}
                            color="#555555"
                        />
                    </TouchableOpacity>

                    {showPaymentMethodDropdown && (
                        <View
                            style={
                                styles.dropdownList
                            }
                        >
                            {[
                                "CASH",
                                "UPI",
                                "CARD",
                                "BANK_TRANSFER",
                                "OTHER",
                            ].map(
                                (
                                    method
                                ) => (
                                    <TouchableOpacity
                                        key={
                                            method
                                        }
                                        style={
                                            styles.dropdownItem
                                        }
                                        onPress={() => {
                                            setPaymentMethod(
                                                method
                                            );

                                            setShowPaymentMethodDropdown(
                                                false
                                            );

                                            if (
                                                method ===
                                                "UPI"
                                            ) {
                                                setTimeout(
                                                    () => {
                                                        openUpiPayment();
                                                    },
                                                    250
                                                );
                                            }
                                        }}
                                    >
                                        <Text
                                            style={
                                                styles.dropdownItemText
                                            }
                                        >
                                            {
                                                method
                                            }
                                        </Text>

                                        {paymentMethod ===
                                            method && (
                                                <Ionicons
                                                    name="checkmark"
                                                    size={
                                                        20
                                                    }
                                                    color="#111111"
                                                />
                                            )}
                                    </TouchableOpacity>
                                )
                            )}
                        </View>
                    )}

                    {paymentMethod ===
                        "UPI" &&
                        paymentStatus ===
                        "PAID" && (
                            <View
                                style={{
                                    marginTop: 16,
                                    padding: 14,
                                    borderRadius: 12,
                                    backgroundColor:
                                        "#F2F2F2",
                                    flexDirection:
                                        "row",
                                    alignItems:
                                        "center",
                                }}
                            >
                                <Ionicons
                                    name="checkmark-circle"
                                    size={24}
                                    color="#111111"
                                />

                                <View
                                    style={{
                                        marginLeft: 10,
                                        flex: 1,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight:
                                                "700",
                                            color: "#111111",
                                        }}
                                    >
                                        Payment Received
                                    </Text>

                                    <Text
                                        style={{
                                            marginTop: 3,
                                            fontSize: 12,
                                            color: "#555555",
                                        }}
                                    >
                                        UPI payment of ₹
                                        {totalPrice.toFixed(
                                            2
                                        )}{" "}
                                        confirmed.
                                    </Text>
                                </View>
                            </View>
                        )}
                </View>

                {/* ==================================================
                    STANDARD INVOICE SUMMARY
                   ================================================== */}

                <View
                    style={
                        styles.totalCard
                    }
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight:
                                "800",
                            color: "#111111",
                            marginBottom: 16,
                        }}
                    >
                        Invoice Summary
                    </Text>

                    <View
                        style={
                            styles.totalRow
                        }
                    >
                        <Text
                            style={
                                styles.totalLabel
                            }
                        >
                            Service Charge
                        </Text>

                        <Text
                            style={
                                styles.totalValue
                            }
                        >
                            ₹
                            {serviceChargeValue.toFixed(
                                2
                            )}
                        </Text>
                    </View>

                    <View
                        style={
                            styles.totalRow
                        }
                    >
                        <Text
                            style={
                                styles.totalLabel
                            }
                        >
                            Parts Charge
                        </Text>

                        <Text
                            style={
                                styles.totalValue
                            }
                        >
                            ₹
                            {partsTotal.toFixed(
                                2
                            )}
                        </Text>
                    </View>

                    <View
                        style={
                            styles.totalRow
                        }
                    >
                        <Text
                            style={
                                styles.totalLabel
                            }
                        >
                            Taxable Amount
                        </Text>

                        <Text
                            style={
                                styles.totalValue
                            }
                        >
                            ₹
                            {taxCalculation.taxableAmount.toFixed(
                                2
                            )}
                        </Text>
                    </View>

                    {taxPercentage >
                        0 && (
                            <>
                                <View
                                    style={
                                        styles.totalRow
                                    }
                                >
                                    <Text
                                        style={
                                            styles.totalLabel
                                        }
                                    >
                                        CGST ({gstComponentRate.toFixed(2)}%)
                                    </Text>

                                    <Text
                                        style={
                                            styles.totalValue
                                        }
                                    >
                                        ₹
                                        {cgstAmount.toFixed(
                                            2
                                        )}
                                    </Text>
                                </View>

                                <View
                                    style={
                                        styles.totalRow
                                    }
                                >
                                    <Text
                                        style={
                                            styles.totalLabel
                                        }
                                    >
                                        SGST ({gstComponentRate.toFixed(2)}%)
                                    </Text>

                                    <Text
                                        style={
                                            styles.totalValue
                                        }
                                    >
                                        ₹
                                        {sgstAmount.toFixed(
                                            2
                                        )}
                                    </Text>
                                </View>

                                <View
                                    style={
                                        styles.totalRow
                                    }
                                >
                                    <Text
                                        style={
                                            styles.totalLabel
                                        }
                                    >
                                        Total GST ({totalGstRate.toFixed(2)}%)
                                    </Text>

                                    <Text
                                        style={
                                            styles.totalValue
                                        }
                                    >
                                        ₹
                                        {taxAmountValue.toFixed(
                                            2
                                        )}
                                    </Text>
                                </View>
                            </>
                        )}

                    <View
                        style={
                            styles.grandTotalDivider
                        }
                    />

                    <View
                        style={
                            styles.totalRow
                        }
                    >
                        <Text
                            style={
                                styles.grandTotalLabel
                            }
                        >
                            Total Price
                        </Text>

                        <Text
                            style={
                                styles.grandTotalValue
                            }
                        >
                            ₹
                            {totalPrice.toFixed(
                                2
                            )}
                        </Text>
                    </View>
                </View>

                {/* ==================================================
                    CREATE
                   ================================================== */}

                <TouchableOpacity
                    style={[
                        styles.createButton,

                        creating &&
                        styles.createButtonDisabled,
                    ]}
                    onPress={
                        handleCreateInvoice
                    }
                    disabled={
                        creating
                    }
                >
                    {creating ? (
                        <ActivityIndicator
                            color="#FFFFFF"
                        />
                    ) : (
                        <>
                            <Ionicons
                                name="receipt-outline"
                                size={21}
                                color="#FFFFFF"
                            />

                            <Text
                                style={
                                    styles.createButtonText
                                }
                            >
                                Create Invoice
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* BACK */}

                <TouchableOpacity
                    style={
                        styles.bottomBackButton
                    }
                    onPress={
                        onBack
                    }
                    disabled={
                        creating
                    }
                >
                    <Ionicons
                        name="arrow-back"
                        size={20}
                        color="#FFFFFF"
                    />

                    <Text
                        style={
                            styles.bottomBackButtonText
                        }
                    >
                        Back
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* ====================================================
                UPI PAYMENT MODAL
               ==================================================== */}

            <Modal
                visible={
                    showUpiPaymentModal
                }
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setShowUpiPaymentModal(
                        false
                    )
                }
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor:
                            "rgba(0,0,0,0.60)",
                        justifyContent:
                            "center",
                        alignItems:
                            "center",
                        padding: 20,
                    }}
                >
                    <View
                        style={{
                            width: "100%",
                            maxWidth: 390,
                            backgroundColor:
                                "#FFFFFF",
                            borderRadius: 20,
                            padding: 22,
                            alignItems:
                                "center",
                        }}
                    >
                        <TouchableOpacity
                            onPress={() =>
                                setShowUpiPaymentModal(
                                    false
                                )
                            }
                            style={{
                                position:
                                    "absolute",
                                right: 16,
                                top: 16,
                                width: 36,
                                height: 36,
                                borderRadius:
                                    18,
                                backgroundColor:
                                    "#F2F2F2",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                            }}
                        >
                            <Ionicons
                                name="close"
                                size={22}
                                color="#111111"
                            />
                        </TouchableOpacity>

                        <View
                            style={{
                                width: 58,
                                height: 58,
                                borderRadius:
                                    29,
                                backgroundColor:
                                    "#F2F2F2",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                marginBottom: 12,
                            }}
                        >
                            <Ionicons
                                name="qr-code-outline"
                                size={30}
                                color="#111111"
                            />
                        </View>

                        <Text
                            style={{
                                fontSize: 21,
                                fontWeight:
                                    "800",
                                color: "#111111",
                            }}
                        >
                            Pay with UPI
                        </Text>

                        <Text
                            style={{
                                marginTop: 6,
                                fontSize: 13,
                                color: "#666666",
                                textAlign:
                                    "center",
                                lineHeight: 19,
                            }}
                        >
                            Ask the customer to scan
                            this QR code using any
                            UPI app.
                        </Text>

                        <View
                            style={{
                                marginTop: 16,
                                paddingHorizontal:
                                    20,
                                paddingVertical:
                                    10,
                                borderRadius:
                                    12,
                                backgroundColor:
                                    "#F5F5F5",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: "#666666",
                                    textAlign:
                                        "center",
                                }}
                            >
                                Amount to Pay
                            </Text>

                            <Text
                                style={{
                                    marginTop: 2,
                                    fontSize: 28,
                                    fontWeight:
                                        "800",
                                    color: "#111111",
                                }}
                            >
                                ₹
                                {totalPrice.toFixed(
                                    2
                                )}
                            </Text>
                        </View>

                        <View
                            style={{
                                marginTop: 20,
                                padding: 18,
                                backgroundColor:
                                    "#FFFFFF",
                                borderRadius:
                                    18,
                                borderWidth: 1,
                                borderColor:
                                    "#DDDDDD",
                            }}
                        >
                            <QRCode
                                value={
                                    upiQrValue
                                }
                                size={220}
                                backgroundColor="#FFFFFF"
                                color="#111111"
                            />
                        </View>

                        <View
                            style={{
                                marginTop: 15,
                                alignItems:
                                    "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 11,
                                    color: "#888888",
                                }}
                            >
                                UPI ID
                            </Text>

                            <Text
                                style={{
                                    marginTop: 3,
                                    fontSize: 14,
                                    fontWeight: "700",
                                    color: "#111111",
                                }}
                            >
                                {businessUpiId || "UPI ID not configured"}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={{
                                width: "100%",
                                marginTop: 20,
                                minHeight: 52,
                                borderRadius:
                                    12,
                                backgroundColor:
                                    "#111111",
                                flexDirection:
                                    "row",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                            }}
                            onPress={
                                confirmUpiPayment
                            }
                        >
                            <Ionicons
                                name="checkmark-circle-outline"
                                size={22}
                                color="#FFFFFF"
                            />

                            <Text
                                style={{
                                    marginLeft: 9,
                                    fontSize: 15,
                                    fontWeight:
                                        "700",
                                    color: "#FFFFFF",
                                }}
                            >
                                Payment Received
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                width: "100%",
                                marginTop: 10,
                                minHeight: 48,
                                borderRadius:
                                    12,
                                backgroundColor:
                                    "#F2F2F2",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                            }}
                            onPress={() =>
                                setShowUpiPaymentModal(
                                    false
                                )
                            }
                        >
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight:
                                        "600",
                                    color: "#333333",
                                }}
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

export default CreateInvoice;