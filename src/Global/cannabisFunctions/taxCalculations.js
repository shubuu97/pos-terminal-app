/* Lodash Import */
import _get from 'lodash/get';
/* Redux Import */
import { commonActionCreater } from '../../Redux/commonAction';


const taxCalculations = (cartItem, cannabisTaxes) => {
    let taxes = _get(cannabisTaxes, 'taxes', [])
    // * AppliedTo enums as defined in backend
    // enum AppliedTo {
    //     DUMMY_PRODUCT =0;
    //     MEDICAL_CANNABIS_TAX = 1;
    //     RECREATIONAL_CANNABIS_TAX =2;
    //     ALL_CANNABIS_TAX =3;
    //     NON_CANNABIS_TAX =4;
    //     ALL_PRODUCTS_TAX =5 ;
    // }
    //  * ProductType enums as defined in backend
    // enum ProductType {
    //     
    //     CANNABIS = 1;
    //     MEDICAL_ONLY_CANNABIS = 2;
    //     NON_CANNABIS = 3;
    // }

    let productType = _get(cartItem, 'doc.product.productType', 3)
    let itemTax = 0

    taxes.map((data, index) => {
        switch (data.appliedTo) {
            case 1:
                if (productType == 2) {
                    itemTax += data.percentage
                }
                break;
            case 2:
                if (productType == 1) {
                    itemTax += data.percentage
                }
                break;
            case 3:
                if (productType == 2 || productType == 1) {
                    itemTax += data.percentage
                }
                break;
            case 4:
                if (productType == 3) {
                    itemTax += data.percentage
                }
                break;
            case 5:
                itemTax += data.percentage
                break;
        }
    })
    return itemTax
}

export default taxCalculations;