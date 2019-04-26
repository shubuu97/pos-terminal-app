import React from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import SvgIcon from '@material-ui/core/SvgIcon';
// import { Detector } from 'react-detect-offline';
import SettingContainer from '../Containers/SettingContainer';

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    icon: {
        margin: theme.spacing.unit * 2,
    },
    iconHover: {
        margin: theme.spacing.unit * 2,
        '&:hover': {
            color: blue[800],
        },
    },
});

function HomeIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </SvgIcon>
    );
}

function TemporaryDrawer(props) {
    const { classes } = props;
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (side, open) => () => {
        setState({ ...state, [side]: open });
    };

    const handleHideWhenOffline = ({ online }, onlineContent, offlineContent) => {
        if (online) {
            return onlineContent
        }
        else
            return offlineContent
    }

    const sideList = (
        <div>
            <List>
                <Divider />
                <ListItem button key={1}>
                    <ListItemText primary={'Home'} />
                </ListItem>
                <Divider />
                <ListItem button key={2} onClick={props.handleClickOpenOnHold}>
                    <ListItemText primary={'On Hold'} />
                </ListItem>
                <Divider />
                <React.Fragment>
                    {handleHideWhenOffline(
                        { online: !props.offline },
                        [<ListItem button key={3} onClick={props.handleClickOpenSessionContainer}>
                            <ListItemText primary={'Session Management'} />
                        </ListItem>],
                        [<ListItem className="disable-button" button key={3} onClick={props.handleClickOpenSessionContainer}>
                            <ListItemText primary={'Session Management'} />
                        </ListItem>]
                    )}
                </React.Fragment>
                <Divider />
                <React.Fragment>
                    {handleHideWhenOffline(
                        { online: !props.offline },
                        [<ListItem button key={4} onClick={()=>{props.handleClickOpenHistory();props.handleTransactionPopulate()}}>
                            <ListItemText primary={'Order History'} />
                        </ListItem>],
                        [<ListItem className="disable-button" button key={4} onClick={props.handleHistoryOpen}>
                            <ListItemText primary={'Order History'} />
                        </ListItem>]
                    )}
                </React.Fragment>
                <Divider />
                <ListItem button key={5} onClick={props.handleClickQuickBook}>
                    <ListItemText primary={'Offline Transactions'} />
                </ListItem> 
                <Divider />
                <ListItem button key={7} onClick={props.logout}>
                    <ListItemText primary={'Log Out'} />
                </ListItem>
                <Divider />
            </List>
        </div>
    );

    return (
        <div className="d-flex">
            <HomeIcon className={classes.icon} style={{ color: 'white', padding: '0', fontSize: 50, margin: '5px' }} onClick={toggleDrawer('left', true)} />


            <Drawer className="drawer-parent" open={state.left} onClose={toggleDrawer('left', false)}>
                <div>
                    <div className='flex-row justify-space-between pad-10'>
                        <span className='sidedrawer-user-text'>Hello, {localStorage.getItem('userName')}</span>
                    </div>
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={toggleDrawer('left', false)}
                        onKeyDown={toggleDrawer('left', false)}
                    >
                        {sideList}
                    </div>
                </div>

                <div>
                    <SettingContainer  {...props} />
                </div>
            </Drawer>

        </div>
    );
}

export default withStyles(styles)(TemporaryDrawer);