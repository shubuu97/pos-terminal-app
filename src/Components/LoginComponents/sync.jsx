import React, { Component } from 'react';
/* Lodash Imports */
import _get from 'lodash/get'
/* Redux Imports */
import connect from 'react-redux/lib/connect/connect';
/* Material Imports */
import LinearProgress from '@material-ui/core/LinearProgress';
/* Global Imports */
import axiosFetcher from '../../Global/dataFetch/axiosFetcher';
import globalClearCart from '../../Global/PosFunctions/clearCart'
/* Pouch Import */
import PouchDb from 'pouchdb';
import addGuestToCart from '../../Global/PosFunctions/addGuestToCart';
import showMessage from '../../Redux/toastAction';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
const styles = theme => ({
    close: {
        padding: theme.spacing.unit / 2,
    },
});


class SyncContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ApiCallCount: 3,
            percentageComplete: 0,
            productCalled: 0,
            categoryCalled: 0,
            customerCalled: 0,
            limit: 10

        };
    }
    componentDidMount() {
        let storeId = localStorage.getItem('storeId');
        let retailerId = localStorage.getItem('retailerId');
        globalClearCart(this.props.dispatch);
        this.pollProduct();
        this.pollCustomer();
        this.pollCategory();
    }

    handleCategoryFetchSuccess = (categoryData) => {
        console.log(categoryData.data, 'categoryData.data')
        _get(categoryData, 'data', []).forEach((item, index) => {
            item._id = item.id
        });
        let categoryDb = new PouchDb('categoryDb');
        categoryDb.bulkDocs(_get(categoryData, 'data', [])).then((res) => {
            let percentageComplete = this.state.percentageComplete + 100 / this.state.ApiCallCount;
            this.setState({ percentageComplete });
            PouchDb.replicate('categoryDb', `http://localhost:5984/categoryDb`, {
                live: true,
                retry: true
            })
        }).catch((err) => {
            console.log(err);
        })
    }
    handleProductFetchSuccess = (productData) => {
        let productsdb = new PouchDb('productsdb');
        productsdb.bulkDocs(_get(productData, 'data', [])).then((result) => {
            let percentageComplete = this.state.percentageComplete + 100 / this.state.ApiCallCount;
            this.setState({ percentageComplete });
            PouchDb.replicate('productsdb', `http://localhost:5984/productsdb`, {
                live: true,
                retry: true
            })
        }).catch((err) => {
            console.log(err);
        });
    }
    handleCustomerFetchSuccess = (customerData) => {
        _get(customerData, 'data', []).forEach((item, index) => {
            item._id = item.id
        });
        let customersdb = new PouchDb('customersdb');
        customersdb.bulkDocs(_get(customerData, 'data', [])).then((result) => {
            addGuestToCart(this.props.dispatch);
            let percentageComplete = this.state.percentageComplete + 100 / this.state.ApiCallCount;
            this.setState({ percentageComplete });
            PouchDb.replicate('customersdb', `http://localhost:5984/customersdb`, {
                live: true,
                retry: true
            })
        }).catch((err) => {
            // dispatch(showMessage({ text: successText||'Updated SuccessFully', isSuccess: true }));
        });

    }
    handleProductFetchError = (error) => {
        setTimeout(this.pollProduct(), 1000);
        console.log(error);
    }
    handleCategoryFetchError = (error) => {
        setTimeout(this.pollCategory(), 1000);

        console.log(error);
    }
    handleCustomerFetchError = (error) => {
        setTimeout(this.pollCustomer(), 1000);
        console.log(error);
    };



    pollProduct = () => {
        return new Promise((resolve, reject) => {
            if (this.state.productCalled == this.state.limit) {
                this.setState({ open: true })
                return;
            }
            let storeId = localStorage.getItem('storeId');
            axiosFetcher({
                method: 'POST',
                url: 'Inventory/ByStoreId',
                reqObj: { id: storeId },
                successCb: this.handleProductFetchSuccess,
                errorCb: (err) => {
                    this.state.productCalled++;
                    setTimeout(this.pollProduct, 1000);
                }
            })

        })
    };
    pollCustomer = () => {
        return new Promise((resolve, reject) => {
            if (this.state.customerCalled == this.state.limit) {
                return;
            };
            let retailerId = localStorage.getItem('retailerId');
            axiosFetcher({
                method: 'POST',
                // reqObj: { email: this.state.email, password: this.state.password },
                url: 'Customer/All',
                reqObj: { id: retailerId },
                successCb: this.handleCustomerFetchSuccess,
                errorCb: (err) => {
                    this.state.customerCalled++;
                    setTimeout(this.pollCustomer, 1000);
                }
            })

        })
    };
    pollCategory = () => {
        return new Promise((resolve, reject) => {
            if (this.state.categoryCalled == this.state.limit) {
                return;
            };
            let retailerId = localStorage.getItem('retailerId');
            axiosFetcher({
                method: 'POST',
                url: 'Category/AllByRetailerId',
                reqObj: { id: retailerId },
                successCb: this.handleCategoryFetchSuccess,
                errorCb: (err) => {
                    this.state.categoryCalled++;
                    setTimeout(this.pollCategory, 1000);
                }
            })
        })
    }
    handleClick = () => {
        this.setState({ open: true });
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;
        if (this.state.percentageComplete == 100) {
            setTimeout(() => {
                this.props.handleStepChange(4);
            }, 1000)
        }
        return (
            <React.Fragment>
                <div>
                    <LinearProgress
                        variant="determinate"
                        value={this.state.percentageComplete} />
                    <span>Synching data from server......</span>
                </div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.open}
                    autoHideDuration={6000}
                    onClose={this.handleClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Note archived</span>}
                    action={[
                        <Button key="undo" color="secondary" size="small" onClick={this.handleClose}>
                            UNDO
            </Button>,
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={this.handleClose}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />
            </React.Fragment>
        )
    }
}

function MapStateToProps(state) {
    return {}
}
export default connect(MapStateToProps)(withStyles(styles)(SyncContainer));