/* STRAT :: API Constants */

//export const ADD_NEW_ENTRY_STEP1 = 'http://admin-bff.getsandbox.com/registerSupplierStep1';


export const ADD_NEW_ENTRY_STEP1 =
    `${process.env.APPLICATION_BFF_URL}/registration?companyid=${process.env.DEFAULT_COMPANY_ID}&step=1`;

export const SUPPLIER_REG = `${process.env.APPLICATION_BFF_URL}/registration`;

export const SUPPLIER_LIST = `${process.env.APPLICATION_BFF_URL}/suppliers?companyid=abc`;

export const VIEW_HOSTORY =
    `${process.env.APPLICATION_BFF_URL}/suppliers/history?
companyid=${process.env.DEFAULT_COMPANY_ID}&supplierid=`;
//export const VIEW_HOSTORY = 'http://13.127.9.218:8081/supplier-bff/suppliers/history?companyid=abc&supplierid=';

export const SUPPLIER_ORG_DATA = `${process.env.APPLICATION_BFF_URL}/suppliers/registration/organization`;

/* END :: API Constants */



/* STRAT :: Supplier Page Constants */

export const REQUEST_ADD_NEW_ENTRY_FOR_SUPPLIER = 'REQUEST_ADD_NEW_ENTRY_FOR_SUPPLIER';
export const RECEIVED_ADD_NEW_ENTRY_FOR_SUPPLIER = 'RECEIVED_ADD_NEW_ENTRY_FOR_SUPPLIER';
export const REG_FORM_RESPONSE = 'REG_FORM_RESPONSE';
export const REG_FORM_REQUEST = 'REG_FORM_REQUEST';
export const REQUEST_SUPPLIER_LIST = 'REQUEST_SUPPLIER_LIST';
export const RECEIVED_SUPPLIER_LIST = 'RECEIVED_SUPPLIER_LIST';
export const RECEIVED_SUPPLIER_HISTORY = 'RECEIVED_SUPPLIER_HISTORY';
export const REQUEST_SUPPLIER_HISTORY = 'REQUEST_SUPPLIER_HISTORY';


/* END :: Supplier Page Constants */


export const monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
];

