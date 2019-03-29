import React, { Component } from 'react';
/* Lodash Imports */
import _get from 'lodash/get'
/* Redux Imports */
import connect from 'react-redux/lib/connect/connect';
import { commonActionCreater } from "../../Redux/commonAction";
import showMessage from '../../Redux/toastAction';
/* Material Imports */
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
/* Global Imports */
import axiosFetcher from '../../Global/dataFetch/axiosFetcher';
import globalClearCart from '../../Global/PosFunctions/clearCart'
import addGuestToCart from '../../Global/PosFunctions/addGuestToCart';
/* Pouch Import */
import PouchDb from 'pouchdb';
import Find from "pouchdb-find";
import PAM from "pouchdb-adapter-memory"

PouchDb.plugin(Find);
PouchDb.plugin(require('pouchdb-quick-search'));
PouchDb.plugin(PAM);

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
        this.fetchFreedomPayDetails();
    }
    fetchFreedomPayDetails = () => {
        axiosFetcher({
            method: 'POST',
            url: 'Payment/FreedomPay/Config/Get',
            reqObj: { id: localStorage.getItem('terminalId')},
            successCb: this.fetchFreedomPayDetailsSuccess,
            errorCb: (err) => {
                debugger;
            }
        })
    }
    fetchFreedomPayDetailsSuccess = (res)=>{
        localStorage.setItem('freedomPayClientEnvironment',_get(res,'data.freedomPayClientEnvironment'));
        localStorage.setItem('freedomPayClientUrl',_get(res,'data.freedomPayClientUrl'));
        localStorage.setItem('freedomPayStoreId',_get(res,'data.freedomPayStoreId'));
        localStorage.setItem('freedomPayTerminalId',_get(res,'data.freedomPayTerminalId'));
        localStorage.setItem('merchantReferenceCode',_get(res,'data.merchantReferenceCode'));
        localStorage.setItem('freedomPayWorkstationId',_get(res,'data.freedomPayWorkstationId'));
        console.log(res,"res is here")
    }
    handleCategoryFetchSuccess = async (categoryData) => {
        console.log(categoryData.data, 'categoryData.data')
        _get(categoryData, 'data', []).forEach((item, index) => {
            item._id = item.id
        });
        let categoryDb = new PouchDb('categoryDb');
        let res = await categoryDb.bulkDocs(_get(categoryData, 'data', []));
        let createdIndex = await categoryDb.createIndex({ index: { fields: ["categoryType"], build: true } })
        return 1
    }

    handleCategoryFetchSuccessWrapper = (categoryData) => {
        this.handleCategoryFetchSuccess(categoryData).then((data) => {
            let percentageComplete = this.state.percentageComplete + 100 / this.state.ApiCallCount;
            this.setState({ percentageComplete });
            if(process.env.NODE_ENV !== 'production')
            {
            PouchDb.replicate('categoryDb', `http://localhost:5984/categoryDb`, {
                live: true,
                retry: true
            });
        }
        })
            .catch((err) => {

            })
    }

    handleProductFetchSuccess = async (productData) => {
        let productsdb = await new PouchDb('productsdb');
        let result = await productsdb.bulkDocs(_get(productData, 'data', []))
        let indexResultOfSearch = await productsdb.search({
            fields: ['product.name', 'product.description', 'product.sku'],
            build: true
        });
        let indexResultOfCategory = await productsdb.search({
            fields: ['product.category1', 'product.category2', 'product.category3'],
            build: true
        });
        let indexResultOfFind = await productsdb.createIndex({
            index: {
                fields: ["product.upcCode"],
                name: 'upcIndex',
                type: 'string'
            }
        });
        return 1;
    }

    handleProductFetchSuccessWrapper = (productData) => {
        this.handleProductFetchSuccess(productData).then((data) => {
            let percentageComplete = this.state.percentageComplete + 100 / this.state.ApiCallCount;
            this.setState({ percentageComplete });
            if(process.env.NODE_ENV !== 'production')
            {
            PouchDb.replicate('productsdb', `http://localhost:5984/productsdb`, {
                live: true,
                retry: true
            })
        }
        })
            .catch((err) => {

            })
    }

    handleCustomerFetchSuccess = async (customerData) => {
        _get(customerData, 'data', []).forEach((item, index) => {
            item._id = item.id
        });
        let customersdb = new PouchDb('customersdb');
        let result = await customersdb.bulkDocs(_get(customerData, 'data', []));
        let indexCreated = await customersdb.search({
            fields: ['customer.firstName', 'customer.lastName', 'email', 'phoneNumber.phoneNumber'],
            build: true
        })
        addGuestToCart(this.props.dispatch);
        return 1;
    }

    handleCustomerFetchSuccessWrapper = (customerData) => {
        this.handleCustomerFetchSuccess(customerData).then((data) => {
            let percentageComplete = this.state.percentageComplete + 100 / this.state.ApiCallCount;
            this.setState({ percentageComplete });
            if(process.env.NODE_ENV !== 'production')
            {
            PouchDb.replicate('customersdb', `http://localhost:5984/customersdb`, {
                live: true,
                retry: true
            })
        }
        })
            .catch((err) => {
                console.log(err);
            })
    }

    pollProduct = () => {
        return new Promise((resolve, reject) => {
            if (this.state.productCalled == this.state.limit) {
                this.setState({ open: true })
                return;
            }
            let storeId = localStorage.getItem('storeId');
            let invetoryUpdateTime = Date.now();
            invetoryUpdateTime = parseInt(invetoryUpdateTime / 1000);
            localStorage.setItem('invetoryUpdateTime', invetoryUpdateTime);
            axiosFetcher({
                method: 'POST',
                url: 'Inventory/ByStoreId',
                reqObj: { id: storeId },
                successCb: this.handleProductFetchSuccessWrapper,
                errorCb: (err) => {
                    this.state.productCalled++;
                    setTimeout(this.pollProduct, 1000);
                }
            })

        })
    }

    pollCustomer = () => {
        return new Promise((resolve, reject) => {
            if (this.state.customerCalled == this.state.limit) {
                return;
            };
            let retailerId = localStorage.getItem('retailerId');
            let CustomerTime = Date.now();
            CustomerTime = parseInt(CustomerTime / 1000);
            localStorage.setItem('CustomerTime', CustomerTime);
            axiosFetcher({
                method: 'POST',
                // reqObj: { email: this.state.email, password: this.state.password },
                url: 'Customer/All',
                reqObj: { id: retailerId },
                successCb: this.handleCustomerFetchSuccessWrapper,
                errorCb: (err) => {
                    this.state.customerCalled++;
                    setTimeout(this.pollCustomer, 1000);
                }
            })

        })
    }

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
                successCb: this.handleCategoryFetchSuccessWrapper,
                errorCb: (err) => {
                    this.state.categoryCalled++;
                    setTimeout(this.pollCategory, 1000);
                }
            })
        })
    }

    handleClick = () => {
        this.setState({ open: true });
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ open: false });
    }

    render() {
        const { classes } = this.props;
        if (this.state.percentageComplete == 100) {
            //this.props.handleStepChange(4);
            // window.location.reload();
            this.props.history.push('/');
        }
        return (
            <React.Fragment>
                <div>
                    <LinearProgress
                    // variant="determinate"
                    // value={this.state.percentageComplete} 
                    />
                    <span></span>
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
                        <Button key="undo" color="secondary" size="small" onClick={this.handleClose}>UNDO</Button>,
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