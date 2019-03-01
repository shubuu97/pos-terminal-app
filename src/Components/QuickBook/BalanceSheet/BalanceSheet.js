import React, { Component } from 'react';
import _get from 'lodash/get';
/* Material Imports */


/* Redux Imports */
import { connect } from 'react-redux';

/* Global Imports */
import BalanceSheetRowMonthWise from './Component/BalanceSheet_Row_MonthWise';

var jwtDecode = require('jwt-decode');
let list = [];



class BalanceSheet extends Component {

    constructor() {
        super();
        this.state = {
            Assets: [],
            Liabilities: [],
            Equity: [],
            Time: ''
        }
    }

    componentDidMount() {
        this.setInitialData();
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        
        if ((_get(nextProps, 'data.Header.Time') !== prevState.Time)) {
            return { Time: _get(nextProps, 'data.Header.Time') };
        }
        else return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if(_get(prevProps, 'data.Header.Time') !== _get(this.props, 'data.Header.Time')) {
            //Perform some operation here
            this.setInitialData();
        }
    }

    setInitialData = () => {
        list = [];
        // Getting all data to be display in balance sheet
        let assets = _get(this.props, 'data.Rows.Row[0]', []);
        let liabilities = _get(this.props, 'data.Rows.Row[1].Rows.Row[0]', []);
        let equity = _get(this.props, 'data.Rows.Row[1].Rows.Row[1]', []);

        // get Assets
        this.bSheetRecursion(_get(assets, 'Rows.Row', []), 0, 'Assets');
        list = [];

        //get Equity
        this.bSheetRecursion(_get(equity, 'Rows.Row', []), 0, 'Equity');

        // get Liabilities
        list = [];
        this.bSheetRecursion(_get(liabilities, 'Rows.Row', []), 0, 'Liabilities');


        // Getting all years to be display in balance sheet heading
        let years = _get(this.props, 'data.Columns.Column', []);
        let tempYears = [];
        if (years.length > 0) {
            for (var i = 1; i < years.length; i++) {
                tempYears.push(years[i].ColTitle);
            }
        }
        this.setState({ years: tempYears });

        // Getting Currency to be display in balance sheet heading
        this.setState({ currency: _get(this.props, 'data.Header.Currency', '-') });
        this.setState({ Time: _get(this.props, 'data.Header.Time') });
    }

    bSheetRecursion = (obj, level, blRow) => {

        obj.map((item, index) => {
            if (_get(item, 'Header')) {
                var title = _get(item, 'Header.ColData[0].value')

                list.push({ title: title, level, name: 'Title' });

                this.bSheetRecursion(item.Rows.Row, level + 1, blRow);

                let temp = [];

                if (_get(item, 'Summary.ColData', []).length > 0) {
                    for (var i = 1; i < _get(item, 'Summary.ColData', []).length; i++) {
                        temp.push(Object.values(item.Summary.ColData[i])[0]);
                    }
                }
                list.push({
                    [_get(item, 'Summary.ColData[0].value')]: temp,
                    level,
                    name: 'Total'
                });

            } else {
                let temp = [];
                if (_get(item, 'ColData', []).length > 0) {
                    for (var i = 1; i < _get(item, 'ColData', []).length; i++) {
                        temp.push(Object.values(item.ColData[i])[0]);
                    }
                }
                list.push({
                    [_get(item, 'ColData[0].value')]: temp,
                    level,
                    name: 'Leaf'
                })

                this.setState({ [blRow]: list });
                return list;
            }
        })

    }


    render() {

        return (
            <React.Fragment>
                <div className="form-load-layover">
                    <div className="d-flex justify-content-end mr-10">

                    </div>
                    <div>
                        <BalanceSheetRowMonthWise
                            heading="Assets"
                            row={this.state.Assets}
                            years={this.state.years}
                            currency={this.state.currency}
                            valuesType={this.props.valueType}
                        />

                        <BalanceSheetRowMonthWise
                            heading="Liabilities"
                            row={this.state.Liabilities}
                            years={this.state.years}
                            currency={this.state.currency}
                            valuesType={this.props.valueType}
                        />

                        <BalanceSheetRowMonthWise
                            heading="Equity"
                            row={this.state.Equity}
                            years={this.state.years}
                            currency={this.state.currency}
                            valuesType={this.props.valueType}
                        />

                    </div>

                </div>
            </React.Fragment >
        )
    }
}


function mapStateToProps(state) {
    return {
        stateId: _get(state, 'staticReducers.stateUuid.uid', ''),
    }
}

export default connect(mapStateToProps)(BalanceSheet)
