"use client";

import "./create-invoice.css";

interface InvoiceHeaderProps {
    onClose?: () => void;
}

export default function InvoiceHeader({ onClose }: InvoiceHeaderProps) {
    return (
        <>
            <div className="invoice-header">
                <div className="invoice-header-icon">
                    <i className="bi bi-receipt-cutoff"></i>
                </div>

                <div className="invoice-header-content">
                    <div className="invoice-header-title-row">
                        <h2>Create New Invoice</h2>
                        <span className="invoice-auto-billing">
                            Auto-Billing
                        </span>
                    </div>

                    <p>
                        Draft and issue client invoice linked to
                        <br />
                        field jobs, parts, and labor charges.
                    </p>
                </div>

                <button
                    type="button"
                    className="invoice-header-close"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <i className="bi bi-x-lg"></i>
                </button>
            </div>
            <div className="invoice-create-body">
                <div className="invocie-craete-form">
                    <div className="invoice-create-head">
                        <div className="left-customer">
                            <span><i className="bi bi-file-earmark-ruled"></i></span>
                            1. INVOICE & CUSTOMER BASICS
                        </div>
                        <h5>REQUIRED DETAILS</h5>
                    </div>

                    <div className="forms-settings">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="input-label">
                                    <div className="label-form">
                                        Invoice Number
                                    </div>
                                    <input className="form-input">
                                    </input>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="input-label">
                                    <div className="label-form">
                                        Issue Date *
                                    </div>
                                    <input className="form-input">
                                    </input>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="input-label">
                                    <div className="label-form">
                                        Payment Terms & Due Date *
                                    </div>
                                    <input className="form-input">
                                    </input>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="input-label">
                                    <div className="label-form">
                                        Currency & Tax Regime
                                    </div>
                                    <input className="form-input">
                                    </input>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="input-label">
                                    <div className="label-form">
                                        Customer Account *
                                    </div>
                                    <input className="form-input">
                                    </input>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="input-label">
                                    <div className="label-form">
                                        Linked Completed Job / Work Order *
                                    </div>
                                    <input className="form-input">
                                    </input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="invoice-line-items-section">
                        <div className="invoice-create-head invoice-line-items-head">
                            <div className="left-customer">
                                <span>
                                    <i className="bi bi-receipt"></i>
                                </span>
                                2. BILLABLE LINE ITEMS (PARTS & LABOR)
                            </div>

                            <h5>3 Items Selected</h5>
                        </div>

                        <div className="invoice-line-items">

                            <div className="invoice-line-item-card">
                                <div className="invoice-line-item-top">
                                    <div className="invoice-line-item-title">
                                        <span className="invoice-item-badge invoice-item-part">
                                            PART
                                        </span>

                                        <h3>Carrier Chiller Heavy-Duty Run Capacitor</h3>
                                    </div>

                                    <button
                                        type="button"
                                        className="invoice-item-delete"
                                        aria-label="Delete item"
                                    >
                                        <i className="bi bi-trash3"></i>
                                    </button>
                                </div>

                                <div className="invoice-line-item-content">
                                    <div className="invoice-item-field">
                                        <label>Qty</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="invoice-item-field">
                                        <label>Unit Price</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="invoice-item-amount">
                                        <span>Amount</span>
                                        <strong>$240.00</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="invoice-line-item-card">
                                <div className="invoice-line-item-top">
                                    <div className="invoice-line-item-title">
                                        <span className="invoice-item-badge invoice-item-labor">
                                            LABOR
                                        </span>

                                        <h3>Master HVAC Diagnostic & Field Labor</h3>
                                    </div>

                                    <button
                                        type="button"
                                        className="invoice-item-delete"
                                        aria-label="Delete item"
                                    >
                                        <i className="bi bi-trash3"></i>
                                    </button>
                                </div>

                                <div className="invoice-line-item-content">
                                    <div className="invoice-item-field">
                                        <label>Hours</label>
                                        <input
                                            type="text"
                                            className="form-input"

                                        />
                                    </div>

                                    <div className="invoice-item-field">
                                        <label>Hourly Rate</label>
                                        <input
                                            type="text"
                                            className="form-input"

                                        />
                                    </div>

                                    <div className="invoice-item-amount">
                                        <span>Amount</span>
                                        <strong>$427.50</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="invoice-line-item-card">
                                <div className="invoice-line-item-top">
                                    <div className="invoice-line-item-title">
                                        <span className="invoice-item-badge invoice-item-service">
                                            SERVICE
                                        </span>

                                        <h3>Refrigerant Recovery & System Recharge</h3>
                                    </div>

                                    <button
                                        type="button"
                                        className="invoice-item-delete"
                                        aria-label="Delete item"
                                    >
                                        <i className="bi bi-trash3"></i>
                                    </button>
                                </div>

                                <div className="invoice-line-item-content">
                                    <div className="invoice-item-field">
                                        <label>Qty</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="invoice-item-field">
                                        <label>Flat Rate</label>
                                        <input
                                            type="text"
                                            className="form-input"

                                        />
                                    </div>

                                    <div className="invoice-item-amount">
                                        <span>Amount</span>
                                        <strong>$180.00</strong>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="invoice-add-line-item"
                            >
                                <i className="bi bi-plus-lg"></i>
                                <span>Add Billable Item</span>
                            </button>

                        </div>
                    </div>

                </div>
            </div>
        </>

    );
}