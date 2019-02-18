import React from 'react';
/* Material Imports */
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
/* Recompose Imports */
import withLogic from '../recomposeUtility/withLogic';
/* Global Imports */
import Switch from '../../switchControl'
import modifyName from '../DataUtility/parseDataBeforeSubmit';

const FinancialLinks = (props) => {
    return (
        <div>
            <div className="data-list">
                <div className="inner-wrap">
                    <span className="onboarding-sub-title pb-15">
                        {/* <img src={fundIcon} height="" width="50" />  */}
                        {props.header}</span>
                        <Switch
                        name={props.header}
                        onChange={props.withSwitchState}
                        />
                    {
                        Object.keys(props.companyDetails)
                        .filter(key=>props.companyDetails[key])
                        .map((key, index) => {
                            let title = key.replace(/([A-Z])/g, ' $1');
                            return (
                                <div className="data-list">
                                    <div className="list-content">
                                        <div className="col-block left-block">{title}</div>
                                        {/* <div> Click <a style={{ color: '#007bff' }} href={props.companyDetails[key]} target="_blank">Here</a> to Open Link</div> */}
                                        <div className="col-block right-block">
                                        <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        color="primary"
                                                        checked={JSON.parse(props.fields[modifyName(key).toUpperCase()]||false)}
                                                        onChange={props.handleChange(modifyName(key).toUpperCase())}
                                                        value={modifyName(key).toUpperCase()}
                                                    />
                                                }
                                              
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default withLogic(FinancialLinks);
//state handleres are here
