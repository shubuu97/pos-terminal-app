import React, { Component } from 'react';
import _get from 'lodash/get';
/* Material Imports */


/* Redux Imports */
import { connect } from 'react-redux';
// import formatMoney from '../../../../../Global/Components/normalizingMoneyField';

let pre = '';
class BalanceSheet_Row_MonthWise extends Component {

    constructor() {
        super();
        this.state = {}
    }

    componentDidMount() { }


    valueORPercent = (col, valuesType) => {
        let temp = '';
        if (valuesType === 'Percentage') {

            if (pre && (pre != 0) && col) {
                temp = ((col - pre) / pre) * 100;

            } else {
                temp = '-';
            }
        } else {
            temp = col;
        }

        pre = col;
        return Math.round(temp * 100) / 100;
        //return formatMoney(Math.round(temp * 100) / 100);
    }

    render() {
        console.log(_get(this, 'props.row'), 'row');
        return (
            <React.Fragment>
                <div className="p-rel flex-row mb-20">
                    {/* Header */}
                    <div className="financial-data-head-column">
                        <div className="flex-row no-gutters balanceSheet-heading">
                            <div className="column_financial-sub-head">
                                {_get(this, 'props.heading')}&nbsp;(in {
                                    _get(this, 'props.valuesType') === 'Percentage' ?
                                        '%' :
                                        _get(this, 'props.currency', '-')})
                            </div>
                        </div>
                        {
                            _get(this, 'props.row').map((item, index) => {
                                pre = 0;
                                if (item.name === 'Title') {
                                    return (
                                        <div className="balancesheet-subHeading"
                                            style={item.level >= 1 ? { 'color': 'rgba(0, 0, 0, 0.6)', 'padding': '5px '+item.level * 10 + 'px' } : {}}>
                                            {item.title}
                                        </div>
                                    )
                                } else if (item.name === 'Leaf') {

                                    return (
                                        <div className="balancesheet-sub-data-color"
                                            style={item.level >= 1 ? { 'paddingLeft': item.level * 10 + 'px' } : {}}
                                        >
                                            <div className="flex-row no-gutters">
                                                <div className="column_financial-sub-head">
                                                    {Object.keys(item)[0]}
                                                </div>

                                            </div>
                                        </div>
                                    )

                                } else if (item.name === 'Total') {
                                    return (
                                        <div className="flex-row total-row no-gutters mt-10 mb-20"
                                            style={
                                                item.level >= 1 ?
                                                    { 'paddingLeft': item.level * 10 + 'px' } //'color': 'rgba(0, 0, 0, 0.6)'
                                                    : {}
                                            }
                                        >
                                            <div className="column_financial-sub-head financial-total-block">{Object.keys(item)[0]}</div>

                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                    {/* Data */}
                    <div className="financial-data-block">
                        {/* Block for displaying years/Months Heading*/}
                        <div className="flex-row no-gutters balanceSheet-heading">
                            {
                                _get(this, 'props.years', []).map((item, index) => {
                                    if (_get(this, 'props.valuesType') === 'Percentage' &&
                                        (_get(this, 'props.heading') === 'Income Statement' ||
                                            _get(this, 'props.heading') === 'Cash Flow') &&
                                        _get(this, 'props.years').length - 1 === index) {

                                        return;
                                    }
                                    return (
                                        <div className="column_financial text-right">
                                            {item}
                                        </div>
                                    )
                                })
                            }
                        </div>
                        {/* Block for displaying data*/}
                        {
                            _get(this, 'props.row').map((item, index) => {
                                pre = 0;
                                if (item.name === 'Title') {
                                    return (
                                        <div className="balancesheet-subHeading"
                                            style={item.level >= 1 ? { 'color': 'rgba(0, 0, 0, 0.6)', 'padding': '5px 20px' } : {}}
                                        >
                                            &nbsp;
                                        </div>
                                    )
                                } else if (item.name === 'Leaf') {

                                    return (
                                        <div className="balancesheet-sub-data-color">
                                            <div className="flex-row no-gutters">

                                                {

                                                    Object.values(item)[0].map((col, index) => {

                                                        if (_get(this, 'props.valuesType') === 'Percentage' &&
                                                            (_get(this, 'props.heading') === 'Income Statement' ||
                                                                _get(this, 'props.heading') === 'Cash Flow') &&
                                                            Object.values(item)[0].length - 1 === index) {

                                                            return;
                                                        }
                                                        return (
                                                            <div className="column_financial text-right">
                                                                {this.valueORPercent(col, this.props.valuesType) || '-'}
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    )

                                } else if (item.name === 'Total') {
                                    return (
                                        <div className="flex-row total-row no-gutters mt-10 mb-20"
                                            // style={
                                            //     item.level >= 1 ?
                                            //         { 'color': 'rgba(0, 0, 0, 0.6)' }
                                            //         : {}
                                            // }
                                        >

                                            {

                                                Object.values(item)[0].map((col, index) => {
                                                    if (_get(this, 'props.valuesType') === 'Percentage' &&
                                                        (_get(this, 'props.heading') === 'Income Statement' ||
                                                            _get(this, 'props.heading') === 'Cash Flow') &&
                                                        Object.values(item)[0].length - 1 === index) {

                                                        return;
                                                    }
                                                    return (
                                                        <div className="column_financial text-right financial-total-block">
                                                            {this.valueORPercent(col, this.props.valuesType) || '-'}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                </div>



            </React.Fragment >
        )
    }
}


export default connect()(BalanceSheet_Row_MonthWise)
