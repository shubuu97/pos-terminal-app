let APPLICATION_BFF_URL, APP_QUICKBOOK_KEY, APP_DUNS_NO_KEY,
    APP_QUICKBOOK_CLIENT_ID,
    APP_QUICKBOOK_REDIRECT_URI,
    APP_QUICKBOOK_RESPONSE_TYPE,
    APP_QUICKBOOK_SCOPE;

console.log("ENV ++", process.env);

if (process.env.NODE_ENV !== 'production') {
    APPLICATION_BFF_URL = "http://13.126.59.19:20029/api/"; //"https://devcreliasmb.allonblock.com";
    APP_QUICKBOOK_KEY = 'quickBook';
    APP_DUNS_NO_KEY = 'DUNSNumber';
    APP_QUICKBOOK_CLIENT_ID = "L0OFwSJQITuLU2dWoJfmOalAC694VXbMOR6KfkQyXUXRHQesfp";
    APP_QUICKBOOK_REDIRECT_URI = "http://localhost:3000/quickbook";
    APP_QUICKBOOK_RESPONSE_TYPE = "code";
    APP_QUICKBOOK_SCOPE = "com.intuit.quickbooks.accounting";
}
else {

    APPLICATION_BFF_URL = process.env.APPLICATION_BFF_URL;
    // APP_QUICKBOOK_KEY = 'quickBook';
    // APP_DUNS_NO_KEY = 'DUNSNumber';


    // APP_QUICKBOOK_CLIENT_ID = process.env.APP_QUICKBOOK_CLIENT_ID;
    // APP_QUICKBOOK_REDIRECT_URI = process.env.APP_QUICKBOOK_REDIRECT_URI;
    // APP_QUICKBOOK_RESPONSE_TYPE = process.env.APP_QUICKBOOK_RESPONSE_TYPE;
    // APP_QUICKBOOK_SCOPE = process.env.APP_QUICKBOOK_SCOPE;



    console.log('process -- env', process.env);

}

export {
    APPLICATION_BFF_URL,
    APP_QUICKBOOK_KEY,
    APP_DUNS_NO_KEY,
    APP_QUICKBOOK_CLIENT_ID,
    APP_QUICKBOOK_REDIRECT_URI,
    APP_QUICKBOOK_RESPONSE_TYPE,
    APP_QUICKBOOK_SCOPE,
};
