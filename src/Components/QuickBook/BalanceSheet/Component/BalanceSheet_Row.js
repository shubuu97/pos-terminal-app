import React, { Component } from 'react';
import _get from 'lodash/get';
/* Material Imports */


/* Redux Imports */
import { connect } from 'react-redux';
import formatMoney from '../../../../Global/Components/normalizingMoneyField';

let pre = '';
class BalanceSheet_Row extends Component {

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
                debugger
            } else {
                temp = '-';
            }
        } else {
            temp = col;
        }

        pre = col;
        return formatMoney(Math.round(temp * 100) / 100);
    }

    render() {
        console.log(this.props.row, 'row');
        return (
            <React.Fragment>
                <div className="balancesheet-row-block mb-20">
                    <div className="row no-gutters balanceSheet-heading">
                        <div className="col-sm-3">
                            {_get(this, 'props.heading')}
                        </div>
                        {
                            _get(this, 'props.years', []).map(item => {
                                return (
                                    <div className="col-sm-3 text-right">
                                        {item}&nbsp;(in {
                                            _get(this, 'props.valuesType') === 'Percentage' ?
                                                '%' :
                                                _get(this, 'props.currency', '-')})
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div>
                        {
                            _get(this, 'props.row').map((item, index) => {
                                pre = 0;
                                if (item.name === 'Title') {
                                    return (
                                        <div className="balancesheet-subHeading"
                                            style={item.level >= 1 ? { 'color': 'rgba(0, 0, 0, 0.6)', 'margin': '5px 20px' } : {}}>
                                            {item.title}
                                        </div>
                                    )
                                } else if (item.name === 'Leaf') {

                                    return (
                                        <div className="balancesheet-sub-data-color"
                                            style={item.level >= 1 ? { 'paddingLeft': '20px' } : {}}
                                        >
                                            <div className="row no-gutters">
                                                <div className="col-sm-3">
                                                    {Object.keys(item)[0]}
                                                </div>
                                                {

                                                    Object.values(item)[0].map((col, index) => {

                                                        return (
                                                            <div className="col-sm-3 text-right">
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
                                        <div className="row total-row no-gutters mt-10 mb-20"
                                            style={
                                                item.level >= 1 ?
                                                    { 'color': 'rgba(0, 0, 0, 0.6)', 'marginLeft': '20px' }
                                                    : {}
                                            }
                                        >
                                            <div className="col-sm-3">{Object.keys(item)[0]}</div>
                                            {

                                                Object.values(item)[0].map((col, index) => {
                                                    return (
                                                        <div className="col-sm-3 text-right">
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


export default connect()(BalanceSheet_Row)
