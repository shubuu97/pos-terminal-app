 const  codes = (code) => {
     code = parseInt(code);
     debugger;
    switch (code) {
        case 101:
            return {
                descripton: 'One or more required fields missing from the request',
                recommendAction: ['Cancel', 'Retry', 'Contact']
            }
            break;
        case 102:
            return {
                descripton: 'One or more fields in the request contain invalid data',
                recommendAction: ['Cancel', 'Retry']
            }
            break;
        case 103:
            return {
                descripton: 'An invalid combination of services was requested',
                recommendAction: ['Retry']
            }
            break;
        case 104:
            return {
                descripton: 'Duplicate transaction',
                recommendAction: ['Cancel']
            }
            break;
        case 111:
            return {
                descripton: 'One or more fields contains invalid data',
                recommendAction: ['Cancel', 'Retry']
            }
            break;
        case 112:
            return {
                descripton: 'One or more required fields missing',
                recommendAction: ['Cancel', 'Retry']
            }
            break;
        case 149:
            return {
                descripton: 'Issue occurred processing request; unknown error',
                recommendAction: ['Cancel', 'Retry', 'Contact']
            }
            break;
        case 150:
            return {
                descripton: 'Issue occurred processing request application error',
                recommendAction: ['Contact']
            }
            break;
        case 151:
            return {
                descripton: 'An internal timeout occurred while processing the request',
                recommendAction: ['Retry', 'Cancel']
            }
            break;
        case 152:
            return {
                descripton: 'An internal error occurred while communicating with the card processor',
                recommendAction: ['Retry','Cancel', 'Contact']
            }
            break;
        case 153:
            return {
                descripton: 'Unable to communicate with card processor',
                recommendAction: ['Retry', 'Cancel']
            }
            break;
        case 154:

            break;
        case 161:

            break;
        case 201:

            break;
        case 201:

            break;
        case 202:

            break;
        case 203:

            break;
        case 204:

            break;
        case 205:

            break;
        case 206:

            break;
        case 207:

            break;
        case 208:

            break;
        case 209:

            break;
        case 210:

            break;
        case 211:

            break;
        case 212:

            break;
        case 213:

            break;
        case 214:

            break;
        case 220:

            break;
        case 221:

            break;
        case 212:

            break;
        case 213:

            break;
        case 214:

            break;
        case 220:

            break;
        case 221:

            break;


        default:
            break;
    }
}

export default codes 