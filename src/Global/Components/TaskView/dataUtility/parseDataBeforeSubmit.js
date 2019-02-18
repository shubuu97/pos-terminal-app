const modifyName = (name) => {
    switch (name) {
        case 'CompanyName':
            return 'LEGALNAME'
            break;
        case 'BalanceSheet':
            return 'FINANCIALINFO_BALANCESHEET'
            break;
        case 'IncomeStatement':
            return 'FINANCIALINFO_INCOMESTATEMENT'
            break;
        case 'Forecast':
            return 'FINANCIALINFO_FORECAST'
            break;
        case 'BusinessPlan':
            return 'FINANCIALINFO_BUSINESSPLAN'
            break;
        case 'CashFlow':
            return 'FINANCIALINFO_CASHFLOW'
            break;
        case 'OrganizationLink':
            return 'URL'
            break;
        case 'Street-1':
            return 'ADDRESS_LINE1'
            break;
        case 'Street-2':
            return 'ADDRESS_LINE2'
            break;
        case 'City':
            return 'ADDRESS_CITY'
            break;
        case 'ZipCode':
            return 'ADDRESS_ZIPCODE'
            break;
        case 'Country':
            return 'ADDRESS_COUNTRY'
            break;
        case 'Region':
            return 'ADDRESS_REGION'
            break;
        case 'PhoneNumber':
            return 'PHONENUMBER'
            break;
        case 'Email':
            return 'EMAIL'
            break;
        default:
            return name
            break;
    }
}
export default modifyName;