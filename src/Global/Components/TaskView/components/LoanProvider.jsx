import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import withLogic from '../recomposeUtility/withLogic';
import Switch from '../../switchControl';
import modifyName from '../dataUtility/parseDataBeforeSubmit';
import _isEmpty from 'lodash/isEmpty';

const LoanProvider = (props) => {
    return (
        <div className="task-detail-general">
            <div className="">
                <span className="task-heading">
                    Provider Details
                </span>
                <div className="flex-row task-switch">
                    <span>Requested Fields</span>
                    <div className="flex-row align-center switch-text">
                        <Switch
                            showSwitchChecked={
                            !_isEmpty(props.fields) &&Object.keys(props.fields)
                              .every((key,index)=>props.fields[modifyName(key).toUpperCase()] || false
                              )}
                            name={'Provider Details'}
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
                                        checked={JSON.parse(props.fields[modifyName(`FINANCIALINFO_LOANPROVIDER_PROVIDERNAME`).toUpperCase()] || false)}
                                        onChange={props.handleChange('FINANCIALINFO_LOANPROVIDER_PROVIDERNAME')}
                                        value={'FINANCIALINFO_LOANPROVIDER_PROVIDERNAME'}
                                        
                                    />
                                }
                            />
                        </div>
                        <div className="col-block left-block">Provider Details</div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default withLogic(LoanProvider)