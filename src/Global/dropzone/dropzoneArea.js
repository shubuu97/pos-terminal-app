import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import '../styles/dropzone.less';
import _get from 'lodash/get';
import CircularProgress from '@material-ui/core/CircularProgress';

class dropzoneArea extends Component {

    constructor(props) {
        super(props);
        this.state = { hoverEvent: false }
    }

    render() {
        let props = this.props;
        return (
            <React.Fragment>

                <span className='dropzoneTitle'>
                    {props.title}
                </span>

                <Dropzone
                    onDrop={(accept, reject) => props.onDrop(accept, reject, props.fieldName,props.parseData,props.afterParseFunction)}
                    className='dropzone'
                    accept={props.accept}
                    disabled={props.progress ? true : false || this.state.hoverEvent}
                >
                    {
                        props.dropzone == undefined || props.dropzone == '' ?
                            <div className='dropzoneTextarea'>
                                {
                                    props.progress ?
                                        <div className='dropzoneTextarea'>
                                            <CircularProgress
                                                className="progress"
                                                variant="static"
                                                value={props.progress}
                                            />
                                            <span className="progress-text">{props.progress} %</span>
                                        </div>
                                        :
                                        <div className='dropzoneTextarea'>
                                            <svg style={{ width: '40px', height: '40px' }} viewBox="0 0 24 24">
                                                <path d="M0 0h24v24H0z" fill="none" />
                                                <path d="M5 4v2h14V4H5zm0 10h4v6h6v-6h4l-7-7-7 7z" />
                                            </svg>
                                            <span className='dropzoneMainText'>Drag and drop your files here or click to select files to upload.</span>
                                            <span>{_get(props, "avialableFormat", "Available File Formats: XSLS, CSV")}</span>
                                            <span>maximum size 15mb</span>
                                        </div>
                                }
                            </div>
                            :
                            <div className='dropzoneImgarea'>
                                {

                                    props.progress ?

                                        <div className='dropzoneImgarea'>
                                            <CircularProgress
                                                className="progress"
                                                variant="static"
                                                value={props.progress}
                                            />
                                            <span className="progress-text">{props.progress} %</span>
                                        </div>
                                        :
                                        <div className='dropzoneImgarea'>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                style={{ width: '50px', height: '50px' }}
                                                viewBox="0 0 24 24"
                                                className='dropzoneImg'>
                                                <path fill="none" d="M0 0h24v24H0z" />
                                                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4l6 6v10c0 1.1-.9 2-2 2H7.99C6.89 23 6 22.1 6 21l.01-14c0-1.1.89-2 1.99-2h7zm-1 7h5.5L14 6.5V12z" />
                                            </svg>
                                            <a href={props.dropzone} className="width-100-percent flex-row justify-center" target="_blank"
                                                onMouseOver={
                                                    () => this.setState({ hoverEvent: true })
                                                }
                                                onMouseOut={() => this.setState({ hoverEvent: false })}
                                            >
                                                <span>Your File</span>
                                            </a>
                                        </div>

                                }
                            </div>
                    }

                </Dropzone>
            </React.Fragment>
        )
    }
}

export default dropzoneArea;