import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/* Material Imports*/
import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
/* Assets */
import logoimg from '../../Assets/images/logo-white.png';

import _get from 'lodash/get';

import {
    APPLICATION_BFF_URL
} from '../../Redux/urlConstants';

import { getData } from '../../Redux/getAction';

const styles = theme => ({
    lightTooltip: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[1],
        fontSize: 14,
    },
});


class Header extends React.Component {
    state = {
        value: 0,
    };

    componentDidMount() {
        this.getApiCall('Notification', 'Notification').then(data => {
            console.log(data, 'data');

            let count = 0;
            _get(data, 'rows', []).map(item => {
                if (item.status === 'UNREAD')
                    count++;
            })

            this.setState({ count: count });

        }).catch(err => {

        });
    }
    // Generic get call
    getApiCall = (url, identifier) => {
        return this.props.dispatch(getData(`${APPLICATION_BFF_URL}/api/${url}`, identifier, {
            init: `${identifier}_init`,
            success: `${identifier}_success`,
            error: `${identifier}_error`
        }))
    }
    handleChange = (event, value) => {
        this.setState({ value });
    };

    logout = () => {
        localStorage.clear()
        this.props.history.push('/')
    }

    handleMouseOver = event => {
        this.setState({ open: true, anchorEl: event.currentTarget });
    };

    // For notifications
    handleMouseOver_Notif = event => {
        this.setState({ open_Notif: true, anchorEl_Notif: event.currentTarget });
    };

    handleRequestClose = () => {
        this.setState({ open: false, open_Notif: false });
    };

    handleMouseOut = event => {
        this.setState({ open: false, open_Notif: false });
    }

    render() {
        //alert(_get(this.props, 'location.pathname', ""));
        const { classes } = this.props;
        return (
            <ClickAwayListener onClickAway={this.handleRequestClose}>

                <div className="topnavcontainer">
                    <div className="nevbar-left">
                        <div className="logo"><img src={logoimg} /></div>
                        <div className="nevbar">
                            <ul>
                                <li
                                    className={_get(this.props, 'history.location.pathname', "").match(/^\/LoanRequest\/*/g) ? 'active' : null}
                                    onClick={() => { this.props.history.push('/LoanRequest'); }}>
                                    <a>Requests</a>
                                </li>
                                <li
                                    className={_get(this.props, 'history.location.pathname', "").match(/^\/smbprofile\/*/g) ? 'active' : null}
                                    onClick={() => { this.props.history.push('/smbprofile/screening'); }}>
                                    <a>Company Profile</a>
                                </li>
                                <li
                                    className={_get(this.props, 'history.location.pathname', "").match(/^\/accounting\/*/g) ? 'active' : null}
                                    onClick={() => { this.props.history.push('/accounting'); }}>
                                    <a>Accounting</a>
                                </li>

                            </ul>
                        </div>

                    </div>

                    <Menu
                        className="header-menu"
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
                        <MenuItem onClick={() => {
                            this.props.history.push('/settings/privacy');
                            this.setState({ open: false })
                        }}>Settings</MenuItem>
                        <MenuItem onMouseOut={this.handleMouseOut} onClick={this.logout}>Logout</MenuItem>
                    </Menu>

                    <div className="nevbar-right">
                        <ul className="myaccount">
                            <li
                                onClick={() => this.props.history.push('/notifications')}>
                                <a
                                    className={_get(this.props, 'history.location.pathname', "").match(/^\/notifications\/*/g) ? 'active' : null}>
                                    <Tooltip
                                        classes={{ tooltip: classes.lightTooltip }}
                                        title="Click here to view notifications" placement="bottom">
                                        <Badge badgeContent={this.state.count} color="secondary">
                                            <i class="material-icons notification">notifications_none</i>
                                        </Badge>
                                    </Tooltip>
                                </a>
                            </li>
                            {/* title='Tasks' */}
                            <li onClick={() => this.props.history.push('/tasks')}>
                                <a className={_get(this.props, 'history.location.pathname', "").match(/^\/tasks\/*/g) ? 'active' : null}>
                                    <Tooltip
                                        classes={{ tooltip: classes.lightTooltip }}
                                        title="Click here to view tasks" placement="bottom">
                                        <i class="material-icons task">assignment</i>
                                    </Tooltip>
                                </a>
                            </li>
                            <li onMouseOver={this.handleMouseOver}>
                                <a className={_get(this.props, 'history.location.pathname', "").match(/^\/settings\/*/g) ? 'active' : null}>
                                    <i className="material-icons useraccount">person_outline</i>
                                    <i class="material-icons droparrow">keyboard_arrow_down</i></a>
                            </li>

                        </ul>
                    </div>
                </div>
            </ClickAwayListener>
        );
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect()(withStyles(styles)(Header));