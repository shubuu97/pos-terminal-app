import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import Button from '@material-ui/core/Button';

/* Redux Imports */
import { connect } from 'react-redux';
/* Component Imports */
import Sessions from '../Components/SessionComponents/Sessions';
/* global imports */
import genericPostData from '../Global/dataFetch/genericPostData';


class SessionContainer extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }
    componentDidMount() {
        this.getTerminalBySessionByData();
    }
    getTerminalBySessionByData = () => {
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: { id: localStorage.getItem('terminalId') },
            url: 'Session/ByTerminal',
            constants: {
                init: 'GET_SESSION_DATA_INIT',
                success: 'GET_SESSION_DATA_SUCCESS',
                error: 'GET_SESSION_DATA_ERROR'
            },
            identifier: 'GET_SESSION_DATA',
            successCb: this.handleGetSessionData,
            errorCb: this.handleGetSessionDataError
        })
    }
    handleGetSessionData = (data) => {

    }
    handleGetSessionDataError = (error) => {

    }

    render() {
        let {sessionList} = this.props;
        return (
            <div>
                <div>
                <Sessions
                sessionList={sessionList}
                />
                </div>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                    >
                       Add New Session
                      </Button>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    let sessionList = _get(state,'sessionList.lookUpData',[])
    return {sessionList}
}

export default connect(mapStateToProps)(SessionContainer);