/* Lodash Import */
import _get from 'lodash/get';
import _forEach from 'lodash/forEach';
/* Redux Import */
import { commonActionCreater } from '../../Redux/commonAction';

const limitCalculations = (cartItem, cannabisCartContent) => {
    let cannabisContent = _get(cartItem, 'doc.product.cannabisContent', 0)
    let packageQty = _get(cartItem, 'packages[0].quantity', 0)
    let cannabisWeight = cannabisContent * packageQty
    let limitType = _get(cartItem, 'doc.product.limitType', 0)

    // * ProductType Enums in backend
    // enum limitType {
    //     NON_CANNABIS = 0;
    //     Concentrate = 1;
    //     Weight = 2;
    //     plant = 3;
    // }
    _forEach(cannabisCartContent, (value, key) => {
        switch (key) {
            case 'concentrateLimit':
                if (limitType == 1) {
                    cannabisCartContent.concentrateLimit += cannabisWeight
                }
                break;
            case 'weightLimit':
                if (limitType == 2) {
                    cannabisCartContent.weightLimit += cannabisWeight
                }
                break;
            case 'plantCountLimit':
                if (limitType == 3) {
                    cannabisCartContent.plantCountLimit += cannabisWeight
                }
                break;
        }
    });

}

export default limitCalculations;