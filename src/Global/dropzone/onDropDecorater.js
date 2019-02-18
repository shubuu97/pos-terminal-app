import { withHandlers } from 'recompose';
import { connect } from 'tls';
import { postData } from '../../Redux/postAction';
import { getData } from '../../Redux/getAction'
import showMessage from '../../Redux/toastAction';
import { APPLICATION_BFF_URL } from '../../Redux/urlConstants'

const decorateWithOnDrop = withHandlers({
    onDrop: (props) => (accept, reject, name, parseData, afterParseFunction) => {
        console.log(parseData, afterParseFunction, "accept is here");
        let formData = new FormData();
        formData.append('file', accept[0])
        formData.append('mediaType', 'customer')
        formData.append('mediaTypeId', '1234567');
        var percentCompleted = 0;
        let uploadConfig = function (progressEvent) {
            let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

            console.log(percentCompleted, "percent complete is here")
            props.setState({ ...props.state, [name + 'uploadProgress']: percentCompleted })
        }

        props.dispatch(postData(`${APPLICATION_BFF_URL}/api/media`, formData, 'fileUpload', {
            init: `File_Upload_init`,
            success: 'File_Upload_Success',
            error: 'File_Upload_Error'

        }, 'post', uploadConfig))
            .then((data) => {
                props.setState({ ...props.state, [name + 'link']: data.message.absoluteURL })
                if (parseData) {
                    let linkname = name + 'link'
                    props.dispatch(getData(`${APPLICATION_BFF_URL}/parser-service/cashFlowParser?files=${data.message.absoluteURL},`, 'fileUpload', {
                        init: 'Parse_Data_init',
                        success: 'Parse_Data_success',
                        error: 'Parse_Data_error'

                    })
                    ).then((data) => {
                        if (afterParseFunction) {
                            afterParseFunction(data);
                        }
                    }).catch((error) => {
                        console.log(error, "error")
                        props.dispatch(showMessage({ text: 'Some error occured while parsing data', isSuccess: false }));
                        setTimeout(() => {
                            props.dispatch(showMessage({ text: '', isSuccess: true }));

                        }, 1000)
                    })
                }
                props.dispatch(showMessage({ text: 'Upload success', isSuccess: true }));
                setTimeout(() => {
                    props.dispatch(showMessage({ text: '', isSuccess: true }));

                }, 1000)
            })
            .catch((error) => {
                console.log(error, "error")
                props.dispatch(showMessage({ text: 'Some error occured', isSuccess: false }));
                setTimeout(() => {
                    props.dispatch(showMessage({ text: '', isSuccess: true }));

                }, 1000)
            })
        props.setState({ ...props.state, [name]: accept[0] })
    },
    vanishImage:(props)=>(name)=>
    {
        props.setState({...props.state,[name + 'link']: undefined})
    }
})

export default decorateWithOnDrop;