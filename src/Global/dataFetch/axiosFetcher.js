import axios from 'axios';
import generateV1uuid from '../Uuid';
import {APPLICATION_BFF_URL} from '../../Redux/urlConstants'


const axiosFetcher = ({method,
  url,
  reqObj,
  successCb,
  successText,
  dispatch,
  extraArgs,
  errorCb})=>
{
let requestObject = {};
  requestObject.method = method;
  requestObject.url = `${APPLICATION_BFF_URL}${url}`;

  if (reqObj)
    requestObject.data = {...reqObj};

  requestObject.headers = {
    originURL: window.origin,
    correlationid: generateV1uuid(),
    Authorization:`Bearer ${localStorage.getItem("Token")}`,
    'Content-Type': 'application/json',
  }
  console.log(requestObject,"requestObject")

  return axios(
    requestObject
  )
    .then(responseData => {
        successCb(responseData,dispatch,extraArgs)
    })
.catch((err)=>
{
errorCb(err)
})

}
export default axiosFetcher