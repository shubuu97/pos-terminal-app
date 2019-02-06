/*
    Module for writing common helper functions across the app
*/
import { monthNames } from '../constants/index.js';

const replaceFieldBySeparator =
    ({ value, separator = '.', joinBy = '.' }) => value.split(separator).slice(1).join(joinBy);


export {
    replaceFieldBySeparator
}


/*date format */

export const dateFormatted =
    ({ value }) => value.getDate() + '-' + monthNames[value.getMonth()] + '-' + value.getFullYear();

    export const dateFormattedUSA =
    ({ value }) => {
        const date = value.toISOString().slice(0, 10);
        const dateTemp = date.slice(0,4);
        return(date.slice(5,10)+'-'+dateTemp) ;
    }
    export function formatDate(separator,date) {
    let tempDay = date.getDate()<10 ? "0"+date.getDate(): date.getDate();
    let tempMonth = date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
    return date.getFullYear() + separator + tempMonth +separator + tempDay;
}

    export const dateFormattedUSAReadable =
    ({ value }) =>  monthNames[value.getMonth()] + ' ' + value.getDate() + ', ' + value.getFullYear();
    