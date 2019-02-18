import _get from 'lodash/get';
import _find from 'lodash/find'
import { getData } from '../../Redux/getAction';
import { APPLICATION_BFF_URL } from '../../Redux/urlConstants'


const transactionDataFetcher = (dispatch,id) => {


       return  dispatch(
            getData(`${APPLICATION_BFF_URL}/api/TransactionHistory/${id}`, 'TransactionDetails', {
                init: 'TransactionDetails_init',
                success: 'TransactionDetails_success',
                error: 'TransactionDetails_error'
            })
        )
}

export default transactionDataFetcher;