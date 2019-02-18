import _get from 'lodash/get';

const parseApiData = (allData)=>
{

let parseData = {
    companyDetails: {
        CompanyName: _get(allData, 'LEGALNAME'),
        IndustryType: _get(allData, 'INDUSTRYTYPE'),
        LegalEntityType: _get(allData, 'LEGALENTITYTYPE'),
        IncorporationDate: _get(allData, 'INCORPORATIONDATE'),
        TaxId: _get(allData, 'TAXID'),
        RegistrationNumber: _get(allData, 'REGISTRATIONNUMBER'),
        LicenseNumber: _get(allData, 'LICENSENUMBER'),
        NumberOfEmployees: _get(allData, 'NUMBEROFEMPLOYEES'),
    },
    address: {
        'Street-1': _get(allData, 'ADDRESS_LINE1'),
        'Street-2': _get(allData, 'ADDRESS_LINE2'),
        City: _get(allData, 'ADDRESS_CITY'),
        ZipCode: _get(allData, 'ADDRESS_ZIPCODE'),
        Country: _get(allData, 'ADDRESS_COUNTRY'),
        Region: _get(allData, 'ADDRESS_REGION'),
        PhoneNumber: _get(allData, 'PHONENUMBER'),
        Email: _get(allData, 'EMAIL'),
    },
    loanProvider: _get(allData, 'FINANCIALINFO_LOANPROVIDER_PROVIDERNAME', []),
    legal: {
        'RegistrationCertificateLink': _get(allData, 'REGISTRATIONCERTIFICATELINK'),
        'OrganizationalChartLink': _get(allData, 'ORGANIZATIONALCHARTLINK'),
        'TaxCertificateLink': _get(allData, 'TAXCERTIFICATELINK'),
    },
    financials: {
        BalanceSheet: _get(allData, 'FINANCIALINFO_BALANCESHEET'),
        IncomeStatement:_get(allData,'FINANCIALINFO_INCOMESTATEMENT'),
        Forecast:_get(allData,'FINANCIALINFO_FORECAST'),
        BusinessPlan: _get(allData, 'FINANCIALINFO_BUSINESSPLAN'),
        CashFlow: _get(allData, 'FINANCIALINFO_CASHFLOW'),
    },
    financialData: _get(allData, 'FINANCIALINFO_FINANCIALDATA_YEAR', []),
    team: {},
    benificiaryShareholders: {},
    marketingMaterials: {
        PresentationLink: _get(allData, 'PRESENTATIONLINK'),
        OrganizationLink: _get(allData, 'URL'),
        VideoLink: _get(allData, 'VIDEOLINK'),
    },
}
return parseData;
}

export default parseApiData