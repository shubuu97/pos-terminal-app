
let parseData = {
    companyDetails: {
        CompanyName:'LEGALNAME',
        IndustryType:'INDUSTRYTYPE',
        LegalEntityType:'LEGALENTITYTYPE',
        IncorporationDate:'INCORPORATIONDATE',
        TaxId:'TAXID',
        RegistrationNumber:'REGISTRATIONNUMBER',
        LicenseNumber:'LICENSENUMBER',
        NumberOfEmployees:'NUMBEROFEMPLOYEES',
    },
    address: {
        'Street-1':'ADDRESS_LINE1',
        'Street-2':'ADDRESS_LINE2',
        City:'ADDRESS_CITY',
        ZipCode:'ADDRESS_ZIPCODE',
        Country:'ADDRESS_COUNTRY',
        Region:'ADDRESS_REGION',
        PhoneNumber:'PHONENUMBER',
        Email:'EMAIL',
    },
    loanProvider:'FINANCIALINFO_LOANPROVIDER_PROVIDERNAME',
    legal: {
        'RegistrationCertificateLink':'REGISTRATIONCERTIFICATELINK',
        'OrganizationalChartLink':'ORGANIZATIONALCHARTLINK',
        'TaxCertificateLink':'TAXCERTIFICATELINK',
    },
    financials: {
        BalanceSheet:'FINANCIALINFO_BALANCESHEET',
        IncomeStatement:'FINANCIALINFO_INCOMESTATEMENT',
        Forecast:'FINANCIALINFO_FORECAST',
        BusinessPlan:'FINANCIALINFO_BUSINESSPLAN',
        CashFlow:'FINANCIALINFO_CASHFLOW',
    },
    financialData:'FINANCIALINFO_FINANCIALDATA_YEAR',
    // team: {},
    // benificiaryShareholders: {},
    marketingMaterials: {
        PresentationLink:'PRESENTATIONLINK',
        OrganizationLink:'URL',
        VideoLink:'VIDEOLINK',
    },
}

export default parseData;