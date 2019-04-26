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
// import PAM from "pouchdb-adapter-memory"

PouchDb.plugin(Find);
PouchDb.plugin(require('pouchdb-quick-search'));
// PouchDb.plugin(PAM);

const styles = theme => ({
    close: {
        padding: theme.spacing.unit / 2,
    },
});


class SyncContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taskCount: undefined,
            percentageComplete: 0,
            productCalled: 0,
            categoryCalled: 0,
            customerCalled: 0,
            limit: 100,
            progressMsg: '',
            productPage: 1,
            sizePerPage: 250,
            taskCompletedCount: 0
        };
    }
    componentDidMount() {
        let storeId = localStorage.getItem('storeId');
        let retailerId = localStorage.getItem('retailerId');
        globalClearCart(this.props.dispatch);
        this.setState({ progressMsg: "Fetching Data from server..." });
        this.timeStarted = Date.now();
        console.log(Date.now(), "###########starting time##########")
        this.pollProduct();
        this.pollCustomer();
        this.pollCategory();
        this.fetchFreedomPayDetails();
    }
    fetchFreedomPayDetails = () => {
        axiosFetcher({
            method: 'POST',
            url: 'Payment/FreedomPay/Config/Get',
            reqObj: { id: localStorage.getItem('terminalId') },
            successCb: this.fetchFreedomPayDetailsSuccess,
            errorCb: (err) => {

            }
        })
    }
    fetchFreedomPayDetailsSuccess = (res) => {
        localStorage.setItem('freedomPayClientEnvironment', _get(res, 'data.freedomPayClientEnvironment'));
        localStorage.setItem('freedomPayClientUrl', _get(res, 'data.freedomPayClientUrl'));
        localStorage.setItem('freedomPayStoreId', _get(res, 'data.freedomPayStoreId'));
        localStorage.setItem('freedomPayTerminalId', _get(res, 'data.freedomPayTerminalId'));
        localStorage.setItem('merchantReferenceCode', _get(res, 'data.merchantReferenceCode'));
        localStorage.setItem('freedomPayWorkstationId', _get(res, 'data.freedomPayWorkstationId'));
        console.log(res, "res is here")
    }
    handleCategoryFetchSuccess = async (categoryData) => {
        console.log(categoryData.data, 'categoryData.data')
        _get(categoryData, 'data', []).forEach((item, index) => {
            item._id = item.id
        });
        let categoryDb = new PouchDb(`categoryDb${localStorage.getItem('storeId')}`);
        let res = await categoryDb.bulkDocs(_get(categoryData, 'data', []));
        let createdIndex = await categoryDb.createIndex({ index: { fields: ["categoryType"], build: true } })
        return 1
    }

    handleCategoryFetchSuccessWrapper = (categoryData) => {
        if (this.state.taskCount != undefined) {
            let percentageComplete = this.state.percentageComplete + 100 / this.state.taskCount;
            this.state.taskCompletedCount++;
            this.setState({ percentageComplete, progressMsg: 'Category Data Succesfully Fetched' })
        }
        else {
            this.state.taskCompletedCount++;
            this.setState({ progressMsg: 'Category Data Succesfully Fetched' })
        }
        this.handleCategoryFetchSuccess(categoryData).then((data) => {
            if (this.state.taskCount != undefined) {
                this.state.taskCompletedCount++;
                let percentageComplete = this.state.percentageComplete + 100 / this.state.taskCount;
                this.setState({ percentageComplete, progressMsg: 'Category Data Succesfully Fetched' })
            }
            else {
                this.state.taskCompletedCount++;
                this.setState({ progressMsg: 'Category Data indexed' })
            }
        })
            .catch((err) => {

            })
    }

    insertingProductToDb = async (productData) => {
        let productsdb = await new PouchDb(`productsdb${localStorage.getItem('storeId')}`);
        let result = await productsdb.bulkDocs(productData);
        let indexingResult = await this.makingIndexOnProductData()
        return 1;
    }
    makingIndexOnProductData = async () => {
        let t = Date.now()
        console.log('######index time####', Date.now())
        let productsdb = await new PouchDb(`productsdb${localStorage.getItem('storeId')}`);
        console.log("############### making index of product ###############")
        let p1 = productsdb.search({
            fields: [
                'product.name',
                'product.description',
                'product.sku',
                'product.keywords',
            ],
            build: true
        })
        console.log("############### making index of Category ###############")
        let p2 = productsdb.search({
            fields: [
                'product.category1',
                'product.category2',
                'product.category3'],
            build: true
        });
        console.log("############### making index of Upc codes ###############")
        let p3 = productsdb.createIndex({
            index: {
                fields: ["product.upcCode"],
                name: 'upcIndex',
                type: 'string'
            }
        });
        await Promise.all([p1, p2, p3]);
        console.log('###########time diffrence##########', Date.now() - t)
        return;
    }

    handleProductFetchSuccessWrapper = (productData) => {
        let count = _get(productData, 'data.count');
        if (this.state.productPage == 1) {
            let xTask = Math.ceil(count / this.state.sizePerPage);
            let taskCount = xTask + 4;
            if (this.state.taskCompletedCount != 0) {
                console.log(this.state.percentageComplete,this.state.taskCompletedCount,this.state.taskCompletedCount)
                let percentageComplete = this.state.percentageComplete + (100 /taskCount)*this.state.taskCompletedCount;
                this.setState({ taskCount: taskCount, percentageComplete,progressMsg: 'Getting Product Shelf and optimizing...' });
            }
            else {
                this.setState({ taskCount, percentageComplete: 0 })
            }
        }
        this.insertingProductToDb(_get(productData, 'data.productWithInventory', [])).then((data) => {
           
            if (count >= this.state.productPage * this.state.sizePerPage) {
                let percentageComplete = this.state.percentageComplete + 100 / this.state.taskCount;
                this.state.taskCompletedCount++
                this.setState({ percentageComplete,progressMsg: 'Getting Product Shelf and optimizing...'});
                this.state.productPage++;
                this.pollProduct();
            }
            else {
                debugger;
                console.log(this.state,"hhhhhhhhhhhhhhhhhhhhh")
                this.state.taskCompletedCount++;
                let percentageComplete = this.state.percentageComplete + 100 / this.state.taskCount;
                this.setState({ percentageComplete});
            }
        })
            .catch((err) => {
                debugger;
            })
    }

    handleCustomerFetchSuccess = async (customerData) => {
        _get(customerData, 'data', []).forEach((item, index) => {
            item._id = item.id
        });
        let customersdb = new PouchDb(`customersdb${localStorage.getItem('storeId')}`);
        let result = await customersdb.bulkDocs(_get(customerData, 'data', []));
        let indexCreated = await customersdb.search({
            fields: ['customer.firstName', 'customer.lastName', 'email', 'phoneNumber.phoneNumber'],
            build: true
        })
        addGuestToCart(this.props.dispatch);
        return 1;
    }
    handleCustomerFetchSuccessWrapper = (customerData) => {
        if (this.state.taskCount != undefined) {
            let percentageComplete = this.state.percentageComplete + 100 / this.state.taskCount;
            this.state.taskCompletedCount++;
            this.setState({ percentageComplete, progressMsg: 'Customer Data Succesfully Fetched' })
        }
        else {
            this.state.taskCompletedCount++;
            console.log("1")
            this.setState({ progressMsg: 'Customer Data Succesfully Fetched' })
        }

        this.handleCustomerFetchSuccess(customerData).then((data) => {
            if (this.state.taskCount != undefined) {
                let percentageComplete = this.state.percentageComplete + 100 / this.state.taskCount;
                this.state.taskCompletedCount++;this.state.taskCompletedCount++;
                this.setState({ percentageComplete, progressMsg: 'Customer Data indexed' });
            }
            else {
                this.state.taskCompletedCount++;
                this.setState({ progressMsg: 'Customer Data indexed' })
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
                url: 'Inventory/Paginated/ByStore',
                reqObj: {
                    id: storeId,
                    page: this.state.productPage,
                    sizePerPage: this.state.sizePerPage
                },
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

    handleRetry = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        debugger;
        this.setState({
            taskCount: 5,
            percentageComplete: 0,
            productCalled: 0,
            categoryCalled: 0,
            customerCalled: 0,
            limit: 10,
            progressMsg: '',
            productPage: 1
        })
        this.pollProduct();
        this.pollCustomer();
        this.pollCategory();
        this.fetchFreedomPayDetails();
        //this.setState({ open: false });
    }

    render() {
        console.log(this.state.taskCompletedCount,this.state.taskCount,this.state.percentageComplete,"######log######")
        const { classes } = this.props;
        if (this.state.taskCompletedCount ==this.state.taskCount) {
            console.log(Date.now() - this.timeStarted, "###########time diffrence##########")

            //this.props.handleStepChange(4);
            // window.location.reload();
            this.props.history.push('/');
        }
        return (
            <React.Fragment>
                <div>
                    {
                        this.state.taskCount == undefined ? <LinearProgress /> : <LinearProgress
                            variant="determinate"
                            value={this.state.percentageComplete}
                        />
                    }
                    <span>{this.state.progressMsg}</span>
                </div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.open}
                    // autoHideDuration={6000}
                    onClose={this.handleRetry}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Some Error Occurred</span>}
                    action={[
                        <Button key="undo" color="secondary" size="small" onClick={this.handleRetry}>Retry</Button>,
                        <IconButton
                            key="retry"
                            aria-label="Retry"
                            color="inherit"
                            className={classes.close}
                            onClick={this.handleRetry}
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
