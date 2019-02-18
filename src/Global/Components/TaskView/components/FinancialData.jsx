import React from 'react';
/* Material Imports */
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
/* Recompose Imports */
import withLogic from '../recomposeUtility/withLogic';
/* Global Imports */
import Switch from '../../switchControl';
import modifyName from '../dataUtility/parseDataBeforeSubmit';
import _isEmpty from 'lodash/isEmpty';

const FinancialDataTable = (props) => {
    return (
        <div className="task-detail-general">
            <div className="">
                <span className="task-heading">
                Financial Details
                </span>
                <div className="flex-row task-switch">
                    <span>Requested Fields</span>
                    <div className="flex-row align-center switch-text">
                        <Switch
                        showSwitchChecked={

                            !_isEmpty(props.fields) &&Object.keys(props.fields)
                              
                              .every((key,index)=>props.fields[modifyName(key).toUpperCase()] || false
                              )}   
                            name={'Financial Details'}
                            onChange={props.withSwitchState}
                        />Select All
                    </div>
                </div>
                <div className="data-list">
                    <div className="task-content">
                        <div className="col-block right-block">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                            color="primary"
                                            checked={JSON.parse(props.fields[modifyName(`FINANCIALINFO_FINANCIALDATA_YEAR`).toUpperCase()] || false)}
                                            onChange={props.handleChange('FINANCIALINFO_FINANCIALDATA_YEAR')}
                                            value={'FINANCIALINFO_FINANCIALDATA_YEAR'}
                                        />
                                }
                            />
                        </div>
                        <div className="col-block left-block">Financial Data</div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default withLogic(FinancialDataTable)