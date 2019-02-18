import React, { Component } from 'react';
import _get from 'lodash/get';
import posed from "react-pose";
/* Material Imports*/
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Badge from '@material-ui/core/Badge'
/* Components Imports */
import ExtendedTable from './ExtendedTable';

const itemConfig = {
    open: { height: 'auto', opacity: 1, flip: true },
    closed: { height: '0', opacity: 0, flip: true }
}
const Item = posed.div(itemConfig)

class PopulateRows extends Component {

    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            open: false,
            hoverEvent: false,
        }
    }

    handleClick = event => {
        this.setState({ open: true, anchorEl: event.currentTarget });
    };

    handleMenuClick = (actionEvent, data, index) => {
        return (event) => {
            actionEvent(data, this.props.rowId);
            this.setState({ open: false });
        }
    }

    handleRequestClose = () => {
        this.setState({ open: false })
    }

    /* Formated Cells - Object type cell data */
    formatedCell = (data, key) => {
        /* If Component Prop is passed in cell obj */

        if (_get(key, 'component')) {
            return _get(key, 'component')
        }
        else {
            return (
                <div className="flex-column" >
                    <div className="flex-row flex-wrap align-center" >
                        {
                            _get(key, 'status', false) ?
                                <svg style={{ width: '12px', height: '12px' }} viewBox="0 0 24 24">
                                    <path fill={this.chooseColor(key.status)} d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                                </svg> : null
                        }

                        <span>&nbsp;{_get(key, 'content')}</span>

                        {
                            _get(key, 'dataBadge', false) ?

                                <Badge
                                    badgeContent={key.dataBadge}
                                    color="primary">
                                    <i
                                        class="material-icons">
                                        local_offer</i>
                                </Badge> : null
                        }
                    </div>
                    {
                        _get(key, 'subData', false) ?
                            <span className="sub-data-text">&nbsp;{_get(key, 'subData')}</span> :
                            null
                    }
                </div>

            )
        }
    }

    /* Status Property of cell */
    chooseColor = (status) => {
        let statusIconColor = '';
        switch (status) {
            case 'ACTIVE': {
                return statusIconColor = '#32CD32' //Light Green   
            }
            case 'ACCEPTED': {
                return statusIconColor = '#196719' //Dark Green 
            }
            case 'DECLINED': {
                return statusIconColor = '#ff0000'; //Red
            }
            case 'SUSPENDED': {
                return statusIconColor = '#FFFF00'; // Yellow
            }
            case 'DRAFT': {
                return statusIconColor = '#DCDCDC'; // Light Grey  
            }
            case 'PENDING': {
                return statusIconColor = '#A9A9A9'// Dark light Grey 
            }
            case 'IN_NEGOTIATION': {
                return statusIconColor = '#DCDCDC'// Dark light Grey 
            }
            case 'OFFERED': {
                return statusIconColor = '#008000'; //Green
            }
            case 'CLOSED': {
                return statusIconColor = '#000000'; //Black
            }
            case 'GRANTED': {
                return statusIconColor = '#0000ff'; //Blue
            }
            case 'BLOCKED': {
                return statusIconColor = '#ff0000'; //Red
            }
            case 'GRANTED': {
                return statusIconColor = '#0000ff'; //Blue
            }
            case 'POSTED': {
                return statusIconColor = '#008000'; //Green
            }
            case 'DELETED': {
                return statusIconColor = '#A9A9A9'; //Dark light Grey
            }
            case 'default': {
                return '#000000';
            }

        }
        return statusIconColor
    }

    render() {
        let data = _get(this.props, "rows", {});
        let customHeadingData = _get(this.props, 'customHeadingData', [])
        let rows = []
        if (customHeadingData.length == 0) {
            rows = Object.keys(data).map((keyname, index) => {
                if (keyname != "extendedRow" && keyname != "extendedTable" && keyname != "rowStyle" && keyname != "allowedActions") {
                    if (typeof data[keyname] != 'object') {
                        return <div key={index} className="data-col" onClick={this.props.onClick}>{data[keyname]}</div>
                    }
                    else {
                        if (Array.isArray(data[keyname])) {
                            return (<div className="data-col" onClick={this.props.onClick}>
                                {data[keyname].map((dt, index) => <React.Fragment>{dt}{index + 1 != data[keyname].length ? <br /> : null}</React.Fragment>)}</div>)
                        }
                        else if (_get(data[keyname], 'type') != 'hidden') {
                            return (
                                <div key={index} className="data-col" style={_get(data[keyname], 'cellStyle')} onClick={this.props.onClick} >
                                    {this.formatedCell(data, data[keyname])}
                                </div>
                            );
                        }
                    }
                }
            })
        }
        else {
            customHeadingData.map((customData, customIndex) => {
                let nameValue = _get(customData, 'name')
                if (nameValue != 'ACTION') {
                    if (typeof data[nameValue] != 'object') {
                        rows.push(<div key={customIndex} className="data-col test1" onClick={this.props.onClick}>{data[nameValue]}</div>)
                    }
                    else {
                        if (Array.isArray(data[nameValue])) {
                            rows.push(<div className="data-col test2" onClick={this.props.onClick}>
                                {data[nameValue].map((dt, customIndex) => <React.Fragment>{dt}{customIndex + 1 != data[nameValue].length ? <br /> : null}</React.Fragment>)}</div>)
                        }
                        else if (_get(data[nameValue], 'type') != 'hidden') {
                            rows.push(
                                <div key={customIndex} className="data-col test3" style={_get(data[nameValue], 'cellStyle')} onClick={this.props.onClick} >
                                    {this.formatedCell(data, data[nameValue])}
                                </div>
                            );
                        }
                    }
                }
            })
        }

        if (this.props.menuActions || this.props.soloActions) {
            let allowedActions = _get(this, 'props.rows.allowedActions', false)

            let menuActionAvail = []
            if (!allowedActions) {
                menuActionAvail = this.props.menuActions
            }
            else {
                this.props.menuActions.map((data, index) => {
                    if (allowedActions.includes(_get(data, 'name'))) {
                        menuActionAvail.push(data)
                    }
                })
            }

            rows.push(
                <div className="data-col test4">
                    {
                        this.props.soloActions ?
                            this.props.soloActions.map((actionData, index) => {
                                if (!allowedActions.length || allowedActions.includes(actionData.name))
                                    return (
                                        <span
                                            title={_get(actionData, 'Title', "")}
                                            className={_get(actionData, 'className')}
                                            onMouseOver={
                                                this.props.handleOnMouseOver
                                            }
                                            onMouseOut={this.props.handleOnMouseOut}
                                            onClick={this.handleMenuClick(_get(actionData, 'actionEvent'), data)} >
                                        </span>
                                    )
                            }) : null
                    }

                    {
                        menuActionAvail.length == 0 ?
                            <div></div> :
                            <React.Fragment>
                                {
                                    menuActionAvail.length == 1 && this.props.menuActions == 1 ?
                                        <Button
                                            onClick={this.handleMenuClick(this.props.menuActions[0].actionEvent, data, 0)}
                                            color='primary'
                                            variant='contained'
                                            className="mb-10 "
                                        >
                                            {this.props.menuActions[0].Title}
                                        </Button>

                                        :

                                        <ClickAwayListener onClickAway={this.handleRequestClose}>
                                            <span
                                                className="more-icon"
                                                onMouseOver={
                                                    this.props.handleOnMouseOver
                                                }
                                                onMouseOut={this.props.handleOnMouseOut}
                                                onClick={this.handleClick} >...</span>
                                            <Menu
                                                id="simple-menu"
                                                anchorEl={this.state.anchorEl}
                                                open={this.state.open}
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'center',
                                                }}
                                                onRequestClose={this.handleRequestClose}
                                            >
                                                {
                                                    this.props.menuActions.map((actionData, index) => {
                                                        if (!allowedActions.length || allowedActions.includes(actionData.name))
                                                            return (
                                                                <MenuItem key={index} onClick={this.handleMenuClick(actionData.actionEvent, data, index)}>
                                                                    {actionData.Title}
                                                                </MenuItem>
                                                            )
                                                    })
                                                }
                                            </Menu>
                                        </ClickAwayListener>
                                }
                            </React.Fragment>
                    }
                </div>
            )
        }
        return (
            <React.Fragment>
                {rows}
            </React.Fragment>
        )
    }
}

let PopulateExtendedRows = (props) => {
    if (props.extendedComponent) {
        let ExtendedComponent = props.extendedComponent
        return <div className="extendedPart"><ExtendedComponent {...props} /></div>
    }
    else {
        let data = _get(props, "rows.extendedRow", {});
        let rows = []
        rows = Object.keys(data).map((keyname, index) => {
            let key = keyname.replace(/([a-z])([A-Z])/g, '$1 $2');
            return (
                <div key={index} className="mb-10">
                    <span className="title-text"> {key} : </span>
                    <span className="primary-text">{data[keyname]}</span>
                </div>
            )
        })

        if (rows.length != 0 && !_get(props, "rows.extendedTable", false)) {
            return (
                <div className="extendedPart">
                    <div className="extended-row">
                        <div className="col-sm-6 flex-column">
                            {rows}
                        </div>
                    </div>
                </div>
            )
        }
        else if (_get(props, "rows.extendedTable", false)) {
            return (
                <div className="extendedPart">
                    <div className="extended-row">
                        <ExtendedTable
                            data={_get(props, "rows.extendedTable", {})}
                            extendedTableProps={props.extendedTableProps}
                        />
                    </div>
                </div>
            )
        }
        else {
            return null
        }
    }

}

class EachRow extends Component {

    constructor() {
        super();
        this.state = {
            hoverEvent: false
        }
    }

    extendedData = (props) => {

    }


    render() {
        const props = this.props;
        return (
            <div className="longCard" style={_get(this, 'props.rows.rowStyle')}>
                <div className="table-col">
                    {/* Card Rows */}
                    <PopulateRows
                        {...this.props}
                    />
                </div>
                {/* When Extended card view */}
                <Item className="item" pose={props.isExtended ? 'open' : 'closed'}>
                    <PopulateExtendedRows
                        handleOnMouseOver={this.props.handleOnMouseOver}
                        handleOnMouseOut={this.props.handleOnMouseOut}
                        {...this.props}
                    />
                </Item>
            </div>
        )
    }
}

export default EachRow;