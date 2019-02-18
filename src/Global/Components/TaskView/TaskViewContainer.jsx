import React from 'react';
import _get from 'lodash/get';
/* Component Imports */
import FinancialData from './components/FinancialData';
import LoanProvider from './components/LoanProvider';
import GeneralView from './components/GeneralView';
/* Parse Data Imports */
import parseDefaultData from './dataUtility/parseDefaultData';
import parseApiData from './dataUtility/parseApiData';

const PopulateDataDetails = (props) => {

    let requestedFields = _get(props, 'requestedFields', []);

    //logic to categorize requestedFields;
    let allData = {};
    requestedFields.map(key => {
        allData[key] = key;
    });
    let parseData;

    //For privacy this is used
    if (props.defaultTask) {
        parseData = parseDefaultData;
    }else {
        parseData = parseApiData(allData);
    }
    let data = {
        companyDetails: [],
        address: [],
        loanProvider: [],
        legal: [],
        financials: [],
        marketingMaterials: [],
        financialData: []
    };
    
    Object.keys(parseData).map((header, index) => {

        switch (header) {
            case 'companyDetails': {
                let everyUndfined = Object.keys(parseData['companyDetails']).every((key) => parseData['companyDetails'][key] == undefined);
                if (everyUndfined) {
                    delete data.companyDetails
                }
                let obj = {}
                obj['LEGALENTITYTYPE'] = props.fields['LEGALENTITYTYPE'];
                obj['INCORPORATIONDATE'] = props.fields['INCORPORATIONDATE'];
                obj['INDUSTRYTYPE'] = props.fields['INDUSTRYTYPE'];
                obj['LEGALNAME'] = props.fields['LEGALNAME']
                obj['LICENSENUMBER'] = props.fields['LICENSENUMBER']
                obj['NUMBEROFEMPLOYEES'] = props.fields['NUMBEROFEMPLOYEES']
                obj['REGISTRATIONNUMBER'] = props.fields['REGISTRATIONNUMBER']
                obj['TAXID'] = props.fields['TAXID']
                !everyUndfined && data[header].push(
                    <GeneralView
                        allFields={props.fields}
                        fields={obj}
                        FieldAccessReqTask={props.FieldAccessReqTask}
                        companyDetails={parseData[header]}
                        header="Company Details"
                    />
                )
                break;
            }
            case 'address': {

                let everyUndfined = Object.keys(parseData['address']).every((key) => parseData['address'][key] == undefined)
                if (everyUndfined) {
                    delete data.address
                }
                let obj = {}
                obj['ADDRESS_CITY'] = props.fields['ADDRESS_CITY'];
                obj['ADDRESS_COUNTRY'] = props.fields['ADDRESS_COUNTRY'];
                obj['ADDRESS_LINE1'] = props.fields['ADDRESS_LINE1'];
                obj['ADDRESS_LINE2'] = props.fields['ADDRESS_LINE2']
                obj['ADDRESS_REGION'] = props.fields['ADDRESS_REGION']
                obj['ADDRESS_ZIPCODE'] = props.fields['ADDRESS_ZIPCODE']
                obj['EMAIL'] = props.fields['EMAIL']
                obj['PHONENUMBER'] = props.fields['PHONENUMBER']
                !everyUndfined && data[header].push(
                    <GeneralView
                        allFields={props.fields}
                        fields={obj}
                        FieldAccessReqTask={props.FieldAccessReqTask}
                        companyDetails={parseData[header]}
                        header="Address Details"
                    />
                )
                break;
            }
            case 'loanProvider': {
                let everyUndfined = Object.keys(parseData['loanProvider']).every((key) => parseData['loanProvider'][key] == undefined)
                if (everyUndfined) {
                    delete data.loanProvider
                }
                let obj = {}
                obj['FINANCIALINFO_LOANPROVIDER_AMOUNT'] = props.fields['FINANCIALINFO_LOANPROVIDER_AMOUNT'];
                obj['FINANCIALINFO_LOANPROVIDER_PROVIDERNAME'] = props.fields['FINANCIALINFO_LOANPROVIDER_PROVIDERNAME'];
                !everyUndfined && data[header].push(
                    <LoanProvider
                        allFields={props.fields}
                        fields={obj}
                        FieldAccessReqTask={props.FieldAccessReqTask}
                        companyDetails={parseData[header]}
                        loanProvider={parseData[header]}
                    />
                )
                break;
            }
            case 'financialData': {
                let everyUndfined = Object.keys(parseData['financialData']).every((key) => parseData['financialData'][key] == undefined)
                if (everyUndfined) {
                    delete data.financialData
                }
                let obj = {}
                obj['FINANCIALINFO_FINANCIALDATA_CASH'] = props.fields['FINANCIALINFO_FINANCIALDATA_CASH'];
                obj['FINANCIALINFO_FINANCIALDATA_EBITDA'] = props.fields['FINANCIALINFO_FINANCIALDATA_EBITDA'];
                obj['FINANCIALINFO_FINANCIALDATA_INTERESTEXPENSE'] = props.fields['FINANCIALINFO_FINANCIALDATA_INTERESTEXPENSE'];
                obj['FINANCIALINFO_FINANCIALDATA_TOTALFINALDEBT'] = props.fields['FINANCIALINFO_FINANCIALDATA_TOTALFINALDEBT']
                obj['FINANCIALINFO_FINANCIALDATA_TOTALSHAREHOLDEREQUITY'] = props.fields['FINANCIALINFO_FINANCIALDATA_TOTALSHAREHOLDEREQUITY']
                obj['FINANCIALINFO_FINANCIALDATA_YEAR'] = props.fields['FINANCIALINFO_FINANCIALDATA_YEAR']
                !everyUndfined && data[header].push(
                    <FinancialData
                        allFields={props.fields}
                        fields={obj}
                        FieldAccessReqTask={props.FieldAccessReqTask}
                        companyDetails={parseData[header]}
                        financialData={parseData[header]}
                    />
                );
                break;
            }
            case 'financials': {
                let everyUndfined = Object.keys(parseData['financials']).every((key) => parseData['financials'][key] == undefined)
                if (everyUndfined) {
                    delete data.financials
                }
                let obj = {}
                obj['FINANCIALINFO_BALANCESHEET'] = props.fields['FINANCIALINFO_BALANCESHEET'];
                obj['FINANCIALINFO_BUSINESSPLAN'] = props.fields['FINANCIALINFO_BUSINESSPLAN'];
                obj['FINANCIALINFO_CASHFLOW'] = props.fields['FINANCIALINFO_CASHFLOW'];
                obj['FINANCIALINFO_FORECAST'] = props.fields['FINANCIALINFO_FORECAST']
                obj['FINANCIALINFO_INCOMESTATEMENT'] = props.fields['FINANCIALINFO_INCOMESTATEMENT']
                !everyUndfined && data[header].push(
                    <GeneralView
                        allFields={props.fields}
                        fields={obj}
                        FieldAccessReqTask={props.FieldAccessReqTask}
                        companyDetails={parseData[header]}
                        companyDetails={parseData[header]}
                        header='Financial Links'
                    />
                );
                break;
            }
            case 'legal': {
                let everyUndfined = Object.keys(parseData['legal']).every((key) => parseData['legal'][key] == undefined)
                if (everyUndfined) {
                    delete data.legal
                }
                let obj = {}
                obj['ORGANIZATIONALCHARTLINK'] = props.fields['ORGANIZATIONALCHARTLINK'];
                obj['REGISTRATIONCERTIFICATELINK'] = props.fields['REGISTRATIONCERTIFICATELINK'];
                obj['TAXCERTIFICATELINK'] = props.fields['TAXCERTIFICATELINK'];
                !everyUndfined && data[header].push(
                    <GeneralView
                        allFields={props.fields}
                        fields={obj}
                        FieldAccessReqTask={props.FieldAccessReqTask}
                        companyDetails={parseData[header]}
                        companyDetails={parseData[header]}
                        header='Legal Links'
                    />
                );
                break;
            }
            case 'marketingMaterials': {
                let everyUndfined = Object.keys(parseData['marketingMaterials']).every((key) => parseData['marketingMaterials'][key] == undefined)
                if (everyUndfined) {
                    delete data.marketingMaterials
                }
                let obj = {}
                obj['PRESENTATIONLINK'] = props.fields['PRESENTATIONLINK'];
                obj['URL'] = props.fields['URL'];
                obj['VIDEOLINK'] = props.fields['VIDEOLINK'];
                !everyUndfined && data[header].push(
                    <GeneralView
                        allFields={props.fields}
                        fields={obj}
                        FieldAccessReqTask={props.FieldAccessReqTask}
                        companyDetails={parseData[header]}
                        header='Marketing Materials Links'
                    />
                );
                break;
            }
            default: {

            }
        }
    });

    return (
        <div>
            <div className="row">
                {
                    Object.keys(data).map((key, index) => {
                        let title = key.replace(/([A-Z])/g, '$1');
                        return (
                            <div className="col-sm-4 pb-30">
                                <div>
                                    <div className="inner-wrap">
                                        <div>{data[key]}</div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}

export default PopulateDataDetails 