import React, { Component } from 'react';
import _get from 'lodash/get';
import _find from 'lodash/find';
import _includes from 'lodash/includes';
import moment from 'moment';

/* Material Imports */
import CircularProgress from '@material-ui/core/CircularProgress';

/* Redux Imports */
import { connect } from 'react-redux';

/* Global Imports */

import BalanceSheetRowMonthWise from '../BalanceSheet/Component/BalanceSheet_Row_MonthWise';


let list = [];

class GetAccountingDetails extends Component {

    constructor() {
        super();
        this.state = {
            incomeStatementData: [],
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
        if (_get(prevProps, 'data.Header.Time') !== _get(this.props, 'data.Header.Time')) {
            //Perform some operation here
            list = [];
            this.setInitialData();
        }
    }

    setInitialData = () => {
        this.bSheetRecursion(_get(this.props, 'data.Rows.Row'), 0, 'incomeStatementData');

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
                let key = '';
                if (_get(item, 'Summary')) {
                    if (_get(item, 'Summary.ColData', []).length > 0) {
                        for (var i = 1; i < _get(item, 'Summary.ColData', []).length; i++) {
                            temp.push(Object.values(item.Summary.ColData[i])[0]);
                        }
                    }
                    key = _get(item, 'Summary.ColData[0].value');
                } else {
                    if (_get(item, 'ColData', []).length > 0) {
                        for (var i = 1; i < _get(item, 'ColData', []).length; i++) {
                            temp.push(Object.values(item.ColData[i])[0]);
                        }
                    }
                    key = _get(item, 'ColData[0].value');
                }

                list.push({
                    [key]: temp,
                    level,
                    name: key === 'TOTAL' ? 'Total' : 'Leaf'
                })
                this.setState({ [blRow]: list });
                return list;
            }
        })

    }

    handleValueType = (event, valueType) => this.setState({ valueType });

    render() {

        return (
            <React.Fragment>
                <div className="form-load-layover">
                    {/* <div className="d-flex justify-content-end mr-10">
                       
                    </div> */}
                    <div>
                        <BalanceSheetRowMonthWise
                            heading="Income Statement"
                            row={this.state.incomeStatementData}
                            years={this.state.years}
                            currency={this.state.currency}
                            valuesType={this.props.valueType}
                        />
                    </div>
                    {
                        this.props.loading &&
                        <div className="layover">
                            <div className="loader">
                                <CircularProgress size={50} />
                            </div>
                        </div>
                    }
                </div>
            </React.Fragment >
        )
    }
}



export default connect()(GetAccountingDetails)
