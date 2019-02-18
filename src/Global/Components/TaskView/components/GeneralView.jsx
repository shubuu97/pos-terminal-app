import React from 'react';
/* Material Imports */
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
/* Recompose Import */
import withLogic from '../recomposeUtility/withLogic';
/* Global Imports */
import Switch from '../../switchControl';
/*  */
import modifyName from '../dataUtility/parseDataBeforeSubmit';
import _isEmpty from 'lodash/isEmpty';

const GeneralView = (props) => {

    let companyDetails = props.companyDetails;

    return (
        <div className="task-detail-general">
            <div className="">
                <span className="task-heading">
                    {props.header}
                </span>
                <div className="flex-row task-switch">
                    <span>Requested Fields</span>
                    <div className="flex-row align-center switch-text">
                        <Switch
                            showSwitchChecked={
                                !_isEmpty(props.fields) && Object.keys(props.fields)
                                    .every((key, index) => props.fields[modifyName(key).toUpperCase()] || false
                                    )}
                            name={props.header}
                            onChange={props.withSwitchState}
                        />
                        Select All
                    </div>
                </div>

                {
                    Object.keys(companyDetails).
                        filter(key => companyDetails[key])
                        .map((key, index) => {
                            let title = key.replace(/([A-Z])/g, ' $1');
                            return (
                                <div className="data-list">
                                    <div className="task-content">
                                        <div className="col-block right-block">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        color="primary"
                                                        checked={JSON.parse(props.fields[modifyName(key).toUpperCase()] || false)}
                                                        onChange={props.handleChange(modifyName(key).toUpperCase())}
                                                        value={modifyName(key).toUpperCase()}
                                                    />
                                                }
                                            />
                                        </div>
                                        <div className="col-block left-block">{title}</div>
                                    </div>
                                </div>
                            )
                        })
                }
            </div>

        </div>
    )
}

export default withLogic(GeneralView)