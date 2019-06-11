/* Lodash Import */
import _get from 'lodash/get';
import _forEach from 'lodash/forEach';
/* Redux Import */
import { commonActionCreater } from '../../Redux/commonAction';

const limitCalculations = (cartItem, cannabisLimits, cannabisCartContent) => {
    console.log(cartItem, cannabisLimits, 'Mayuk - cartItem, cannabisTaxes')
    let cannabisContent = _get(cartItem, 'doc.product.cannabisContent', 0)
    let packageQty = _get(cartItem, 'packages[0].quantity', 0)
    let cannabisWeight = cannabisContent * packageQty
    let productType = _get(cartItem, 'doc.product.productType', 0)

    // * ProductType Enums in backend
    // enum ProductType {
    //     NON_CANNABIS = 0;
    //     CANNABIS = 1;
    //     MEDICAL_ONLY_CANNABIS = 2;
    // }

    _forEach(cannabisCartContent, (value, key) => {
        switch (key) {
            case 'concentrateLimit':
                if(productType)
                break;
            case 'weightLimit':

                break;
            case 'plantCountLimit':

                break;
        }
    });

}

export default limitCalculations;