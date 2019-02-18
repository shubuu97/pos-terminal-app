import _get from 'lodash/get';
import _find from 'lodash/find'
import { getData } from '../../Redux/getAction';
import { APPLICATION_BFF_URL } from '../../Redux/urlConstants'

var jwtDecode = require('jwt-decode');

const basicDataFetcher = (dispatch) => {
    if (localStorage.getItem('authToken')) {
        let decodeData = jwtDecode(localStorage.getItem('authToken'));
        
        let role = decodeData.role


       return  dispatch(
            getData(`${APPLICATION_BFF_URL}/api/${role}/${encodeURIComponent(decodeData.id)}`, 'fetchingbasicdata', {
                init: 'basicdata_init',
                success: 'basicdata_success',
                error: 'basicdata_error'
            })
        )
    }
    else {
        // this.props.history.push('/')
    }
}

export default basicDataFetcher;