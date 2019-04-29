import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import moment from 'moment';
import {connect} from 'react-redux';
import { commonActionCreater } from '../../Redux/commonAction';
/* Material import */
/* Redux Impimport { commonActionCreater } from '../../Redux/commonAction';
orts */

/* Component Imports */


class Session extends React.PureComponent {

    constructor() {
        super();
        this.state = {
            active:false
        }
    }

    openOrClosed = () => {
        let { session } = this.props;
        let returnElement
        if (session.status == 'open') {
            returnElement = <span className="open-tag">OPEN</span>
        }
        else {
            let closingTime = _get(session, 'closingTimeStamp.seconds') * 1000;
            returnElement = <span>{moment(closingTime).format('hh:mm A')}</span>
        }
        return returnElement
    }
    showCurrentOrCloseBalance = ()=>{
        let { session } = this.props;
        let returnElement
        if (session.status == 'open') {
            returnElement = <span>${_get(session,'currentBalance.amount',0).toFixed(2)}</span>
        }
        else {
            returnElement = <span>${_get(session,'closingBalance.amount',0).toFixed(2)}</span>
        }
        return returnElement
    }
    selectedSession = ()=>{
        this.setState({active:true})
        this.props.dispatch(commonActionCreater(this.props.session,'GET_SELECTED_SESSION'))
    }

    render() {
        let { session, index } = this.props;
        let openingTime = _get(session, 'openingTimeStamp.seconds') * 1000;
        return (
            <div onClick={this.selectedSession}>
                <div style={_get(session,'id')==_get(this.props,'id')?{background:'#3f51b5',color:'white'}:null} className="session">
                    <div className="first-row">
                        <label>{moment(openingTime).format('dddd Do MMM')}</label>
                        <label>{this.showCurrentOrCloseBalance()}</label>
                    </div>
                    <div className="second-row">
                        <label>{moment(openingTime).format('hh:mm A')} - {this.openOrClosed()}</label>
                    </div>
                </div>
            </div>
        );
    }
}
function mapStateToProps(state){
    return {id:_get(state,'selectedSession.lookUpData.id')}
}

export default connect(mapStateToProps)(Session);