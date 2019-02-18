import { withHandlers } from "recompose";


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
//when checkboxes are checked this function being called
const handleChange = props => name => event => {
    let allFields = { ...props.allFields };
    //Logic to change the names according to sending to ui
    name = modifyName(name)
    allFields[name] = JSON.parse(event.target.checked);
    if (name == 'FINANCIALINFO_LOANPROVIDER_PROVIDERNAME') {
        allFields['FINANCIALINFO_LOANPROVIDER_PROVIDERNAME'] = event.target.checked;
        allFields['FINANCIALINFO_LOANPROVIDER_AMOUNT'] = event.target.checked;
    };
    if (name == 'FINANCIALINFO_FINANCIALDATA_YEAR') {
        //delete allFields.FINANCIALINFO_FINANCIALDATA;
        allFields['FINANCIALINFO_FINANCIALDATA_YEAR'] = event.target.checked;
        allFields['FINANCIALINFO_FINANCIALDATA_SALES'] = event.target.checked
        allFields['FINANCIALINFO_FINANCIALDATA_EBITDA'] = event.target.checked;
        allFields['FINANCIALINFO_FINANCIALDATA_INTERESTEXPENSE'] = event.target.checked;
        allFields['FINANCIALINFO_FINANCIALDATA_CASH'] = event.target.checked;
        allFields['FINANCIALINFO_FINANCIALDATA_TOTALFINALDEBT'] = event.target.checked;
        allFields['FINANCIALINFO_FINANCIALDATA_TOTALSHAREHOLDEREQUITY'] = event.target.checked;
    }
    props.FieldAccessReqTask(allFields);
    return { [name]: event.target.checked };
};
//when switch are checked this function being called

const withSwitchState = props => (name, value) => {

    let allFields = { ...props.allFields };
    //Logic to change the names according to sending to ui
    

    if (name == 'Company Details') {
        allFields['LEGALNAME'] = props.companyDetails.CompanyName ? value : null
        allFields['INCORPORATIONDATE'] = props.companyDetails.IncorporationDate ? value : null
        allFields['INDUSTRYTYPE'] = props.companyDetails.IndustryType ? value : null
        allFields['LEGALENTITYTYPE'] = props.companyDetails.LegalEntityType ? value : null
        allFields['REGISTRATIONNUMBER'] = props.companyDetails.RegistrationNumber ? value : null
        allFields['TAXID'] = props.companyDetails.TaxId ? value : null
        allFields['LICENSENUMBER'] = props.companyDetails.LicenseNumber ? value : null
        allFields['NUMBEROFEMPLOYEES'] = props.companyDetails.NumberOfEmployees ? value : null;
    }
    else if (name == 'Address Details') {
        allFields['ADDRESS_LINE1'] = props.companyDetails['Street-1'] ? value : null
        allFields['ADDRESS_LINE2'] = props.companyDetails['Street-2'] ? value : null
        allFields['ADDRESS_CITY'] = props.companyDetails.City ? value : null
        allFields['ADDRESS_ZIPCODE'] = props.companyDetails.ZipCode ? value : null
        allFields['ADDRESS_COUNTRY'] = props.companyDetails.Country ? value : null
        allFields['ADDRESS_REGION'] = props.companyDetails.Region ? value : null
        allFields['PHONENUMBER'] = props.companyDetails.PhoneNumber ? value : null
        allFields['EMAIL'] = props.companyDetails.Email ? value : null
    }
    else if (name == 'Financial Links') {
        allFields['FINANCIALINFO_BALANCESHEET'] = props.companyDetails['BalanceSheet'] ? value : null
        allFields['FINANCIALINFO_INCOMESTATEMENT'] = props.companyDetails['IncomeStatement'] ? value : null
        allFields['FINANCIALINFO_FORECAST'] = props.companyDetails['Forecast'] ? value : null
        allFields['FINANCIALINFO_BUSINESSPLAN'] = props.companyDetails['BusinessPlan'] ? value : null
        allFields['FINANCIALINFO_CASHFLOW'] = props.companyDetails['CashFlow'] ? value : null
    }
    else if (name == 'Marketing Materials Links') {
        allFields['PRESENTATIONLINK'] = props.companyDetails['PresentationLink'] ? value : null
        allFields['URL'] = props.companyDetails['OrganizationLink'] ? value : null
        allFields['VIDEOLINK'] = props.companyDetails['VideoLink'] ? value : null
    }
    else if (name == 'Legal Links') {
        allFields['REGISTRATIONCERTIFICATELINK'] = props.companyDetails.RegistrationCertificateLink ? value : null
        allFields['ORGANIZATIONALCHARTLINK'] = props.companyDetails.OrganizationalChartLink ? value : null
        allFields['TAXCERTIFICATELINK'] = props.companyDetails.TaxCertificateLink ? value : null
    }
    else if (name == 'Provider Details') {
        allFields['FINANCIALINFO_LOANPROVIDER_PROVIDERNAME'] = value;
        allFields['FINANCIALINFO_LOANPROVIDER_AMOUNT'] = value;
    }
    else if (name == 'Financial Details') {
        allFields['FINANCIALINFO_FINANCIALDATA_YEAR'] = value;
        allFields['FINANCIALINFO_FINANCIALDATA_SALES'] = value
        allFields['FINANCIALINFO_FINANCIALDATA_EBITDA'] = value;
        allFields['FINANCIALINFO_FINANCIALDATA_INTERESTEXPENSE'] = value;
        allFields['FINANCIALINFO_FINANCIALDATA_CASH'] = value;
        allFields['FINANCIALINFO_FINANCIALDATA_TOTALFINALDEBT'] = value;
        allFields['FINANCIALINFO_FINANCIALDATA_TOTALSHAREHOLDEREQUITY'] = value
    }
    console.log(allFields,'allFields')
    props.FieldAccessReqTask(allFields);
    return { [name]: false };
};

const withCheckBoxStates = withHandlers({ handleChange, withSwitchState });

export default withCheckBoxStates;