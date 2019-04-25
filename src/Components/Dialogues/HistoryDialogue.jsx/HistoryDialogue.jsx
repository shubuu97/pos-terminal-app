import React from 'react';
import PropTypes from 'prop-types';
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
import SearchBar from '../../../Global/Components/SearchBar'
import HistoryDetailArea from './HistoryDetailArea';


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
            searchInput: '',
        }
    }

    componentDidMount() {
        //this.props.handleSidebarPopulate()
    }

    handleSearchChange = (value) => {
        this.setState({ searchInput: value })
        this.props.handleSearch(value);
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
                                        this.props.historySidebarLoading ?
                                            <CircularProgress size={50} />
                                            :
                                            this.props.historySidebarItems.length ?
                                                this.props.historySidebarItems
                                                :
                                                <div>No Data Found</div>
                                    }
                                </div>
                            </div>
                            {
                                this.props.selectedSaleTransaction ?
                                    <HistoryDetailArea
                                        selectedSaleTransaction={this.props.selectedSaleTransaction}
                                        handleHistoryClose = {this.props.handleClose}
                                    /> : null
                            }
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