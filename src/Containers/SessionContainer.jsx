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
import SessionDialog from '../Components/SessionComponents/SessionDialog';
import SessionDetail from '../Components/SessionComponents/SessionDetail';

class SessionContainer extends React.Component {

    constructor() {
        super();
        this.state = {
            openNewSessionDialog: false,

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

    handleOpenNewSessionDialog = () => {
        debugger;
        this.setState({ openNewSessionDialog: true })
    }
    handleCloseNewSessionDialog = ()=>{
        this.setState({ openNewSessionDialog: false })
    }

    render() {
        let { sessionList } = this.props;
        return (
            <div className="session-parent">
                <div style={{height:document.documentElement.scrollHeight*.8,overflowY:'scroll'}} className="mui-col-sm-4">
                    <div className="flex-column justify-flex-end">
                        <Sessions
                            sessionList={sessionList}
                        />
                    </div>
                    <div className="session-button-style">
                        {/* <Button
                            onClick={this.handleOpenNewSessionDialog}
                            variant="contained"
                            color="primary"
                        >
                            Add New Session
                      </Button> */}
                        {this.state.openNewSessionDialog ?
                            <SessionDialog
                                open={this.state.openNewSessionDialog}
                                handleClose = {this.handleCloseNewSessionDialog}
                                
                            /> : null}
                    </div>
                </div>
                <div className="mui-col-sm-8">
                    <SessionDetail />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    let sessionList = _get(state, 'sessionList.lookUpData', [])
    return { sessionList }
}

export default connect(mapStateToProps)(SessionContainer);