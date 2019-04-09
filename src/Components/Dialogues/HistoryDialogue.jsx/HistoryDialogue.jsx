import React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
/* Lodash Imports */
import _get from 'lodash/get';
/* Redux Imports */

/* Material Imports */
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import CircularProgress from '@material-ui/core/CircularProgress';
/* Material Icons */

/* Component Imports */
import SearchBar from '../../ProductsSection/SearchBar';


const styles = {
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
};

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class HistoryDialogue extends React.Component {

    constructor() {
        super();
        this.state = {
            searchInput: false,
        }
    }

    componentDidMount(){
        this.props.handleSidebarPopulate(1, 2, 3, 4)
    }

    handleSearchChange = () => {

    }

    render() {
        const { classes } = this.props;
        return (
            <div className='history-dialogue'>
                <Dialog
                    fullScreen
                    open={this.props.open}
                    onClose={this.props.handleClose}
                    TransitionComponent={Transition}
                >
                    <div className='history-section'>
                        <div className='history-header'>
                            <IconButton color="inherit" onClick={this.props.handleClose} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <span className='ml-20'>History</span>
                        </div>
                        <div className='flex-row fwidth'>
                            <div className='history-sidebar flex-column overflow-y'>
                                {
                                    this.props.handleSearch ?
                                        <div className='history-search flex-row'>
                                            <SearchBar
                                                handleChange={this.handleSearchChange}
                                                handleInput={this.state.searchInput}
                                                placeholder={"Search Transaction"}
                                            />
                                        </div> : null
                                }
                                <div className='transaction-list flex-column align-center'>
                                    {
                                        this.props.historySidebarItems.length ? 
                                        this.props.historySidebarItems :
                                        <CircularProgress size={50} /> 
                                    }
                                </div>
                            </div>

                            <div className='history-main'>
                                hello
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
}

HistoryDialogue.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HistoryDialogue);