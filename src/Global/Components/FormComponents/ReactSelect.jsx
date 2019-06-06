import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */
import { makeStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
/* Redux Imports */

/* Global Imports */
import genericPostData from '../../../Global/dataFetch/genericPostData';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

function SimpleSelect(props) {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        age: '',
        name: 'hai',
    });
    const [menuItems, setMenuItems] = React.useState()
    const [firstLoad, setFirstLoad] = React.useState(1)
    let allPackages
    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect((props) => {
        setLabelWidth(inputLabel.current.offsetWidth);
        populatePackages(props)
    }, []);

    function handleChange(props, event) {
        setValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value,
        }))
        if (event.target.name == 'select') {
            let packageData = allPackages
            let selectedPackage = {}
            packageData.map((data, index) => {
                if (data.label == event.target.value) {
                    selectedPackage = data
                }
            })
            props.handleSelectedPackage(selectedPackage)
        }
    }

    let populatePackages = () => {
        let view = []
        let id = props.productId
        setFirstLoad(0)
        genericPostData({
            dispatch: props.dispatch,
            reqObj: { id },
            url: 'Package/Get/ByProduct',
            dontShowMessage: true,
            constants: {
                init: 'GET_ACTIVE_PACKAGES_OF PRODUCT_INIT',
                success: 'GET_ACTIVE_PACKAGES_OF PRODUCT_SUCCESS',
                error: 'GET_ACTIVE_PACKAGES_OF PRODUCT_ERROR'
            },
            identifier: 'GET_ACTIVE_PACKAGES_OF PRODUCT',
            successCb: (data) => { }
        }).then((data) => {
            let packageData = _get(data, 'packages', [])
            allPackages = packageData
            packageData.map((data, index) => {
                view.push(
                    <MenuItem value={data.label}>{data.label}</MenuItem>
                )

            })
        })
        setMenuItems(
            <Select
                value={values.select}
                onChange={(event) => handleChange(props, event)}
                input={< OutlinedInput labelWidth={labelWidth} name="select" id="select-simple" />}
                fullWidth
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {view}
            </Select >
        )
        return (
            <Select
                value={values.select}
                onChange={(event) => handleChange(props, event)}
                input={< OutlinedInput labelWidth={labelWidth} name="select" id="select-simple" />}
                fullWidth
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {view}
            </Select >
        );
    }

    return (
        <form className={classes.root} autoComplete="off">
            <FormControl variant="outlined" className={classes.formControl} fullWidth>
                <InputLabel ref={inputLabel} htmlFor="select-simple">
                    {props.name}
                </InputLabel>
                {
                    firstLoad == 1 ?
                        populatePackages()
                        :
                        menuItems
                }
            </FormControl>
        </form>
    );
}

export default SimpleSelect;


