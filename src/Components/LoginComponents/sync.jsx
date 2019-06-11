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
            HotProductCalled: 0,
            limit: 100,
            progressMsg: '',
            productPage: 1,
            sizePerPage: 250,
            taskCompletedCount: 0,
            //!mute hot product
            //fixedTask: 5  //Count of static of task
            fixedTask: 4  //Count of static of task

        };
    }
    async componentDidMount() {
        let storeId = localStorage.getItem('storeId');
        let retailerId = localStorage.getItem('retailerId');
        globalClearCart(this.props.dispatch);
        this.setState({ progressMsg: "Fetching Data from server..." });
        this.timeStarted = Date.now();
        console.log(Date.now(), "###########starting time##########");
        let updationrecorderdb = new PouchDb(`updationrecorderdb${localStorage.getItem('storeId')}`);
        let invetoryUpdateTime = await updationrecorderdb.get("invetoryUpdateTime").then(data => data.invetoryUpdateTime).catch(err => undefined);
        let customerUpdateTime = await updationrecorderdb.get("customerUpdateTime").then(data => data.customerUpdateTime).catch(err => undefined);

        if (invetoryUpdateTime) {
            this.getInventoryUpdate(invetoryUpdateTime);
            this.getCustomerUpdate(customerUpdateTime);
            //!mute hot product
            // this.pollHotProduct();
        }
        else {
            //!mute hot product
            // this.pollHotProduct();
            this.pollProduct();
            this.pollCustomer();
            this.pollCategory();
            this.fetchFreedomPayDetails();
        }

    }
    getInventoryUpdate = async (invetoryUpdateTime) => {
        let reqObj = {
            id: localStorage.getItem('storeId'),
            timestamp: {
                seconds: parseInt(invetoryUpdateTime)
            }
        };
        let tempInvetoryUpdateTime = Date.now();
        tempInvetoryUpdateTime = parseInt(tempInvetoryUpdateTime / 1000);
        localStorage.setItem('tempInvetoryUpdateTime', tempInvetoryUpdateTime);
        axiosFetcher({
            method: 'POST',
            reqObj,
            url: 'Inventory/Increment',
            successCb: this.updateTimeStampAndDbForInventory,
            errorCb: (err) => {
                console.log(err, "err is here")
            }
        })
    }
    updateTimeStampAndDbForInventory = async (res, dispatch, extraArgs) => {

        let tempInvetoryUpdateTime = localStorage.getItem('tempInvetoryUpdateTime');
        localStorage.setItem('invetoryUpdateTime', tempInvetoryUpdateTime);
        let updationrecorderdb = new PouchDb(`updationrecorderdb${localStorage.getItem('storeId')}`);
        updationrecorderdb.get('invetoryUpdateTime').then(data => {
            updationrecorderdb.put({
                _id: 'invetoryUpdateTime',
                _rev: data._rev,
                invetoryUpdateTime: tempInvetoryUpdateTime,
            }).catch(err => { });
        });


        let productsdb = new PouchDb(`productsdb${localStorage.getItem('storeId')}`);
        let updatedInventory = _get(res, 'data', []) || [];
        let promiseArray = updatedInventory.map(async (product, index) => {
            let productObj = await productsdb.get(product._id).then(
                data => {
                    let updateObject = updatedInventory[index];
                    updateObject._rev = data._rev;
                    return updateObject
                }).catch(err => updatedInventory[index]);
            // _set(productObj, 'inventory.quantity', _get(product, 'inventory.quantity', 0));
            return productObj
        });
        Promise.all(promiseArray).then(async ([...updatedInventoryWith_Rev]) => {
            let resOfUpdateBulk = await productsdb.bulkDocs(updatedInventoryWith_Rev);
            this.setState({ taskCompletedCount: 1, taskCount: 1 })
        }).catch((err) => {
        })

    }
    getCustomerUpdate = async (customeerUpdateTime) => {
        let reqObj = {
            id: localStorage.getItem('retailerId'),
            timestamp: {
                seconds: parseInt(customeerUpdateTime)
            }
        };
        let tempCustomerTime = Date.now();
        tempCustomerTime = parseInt(tempCustomerTime / 1000);
        localStorage.setItem('tempCustomerTime', tempCustomerTime);
        axiosFetcher({
            method: 'POST',
            reqObj,
            url: 'Customer/Increment',
            successCb: this.updateTimeStampAndDbForCustomer,
            errorCb: (err) => {
                console.log(err, "err is here")
            }
        })
    }
    updateTimeStampAndDbForCustomer = async (res) => {
        addGuestToCart(this.props.dispatch);
        let tempCustomerTime = localStorage.getItem('tempCustomerTime');
        localStorage.setItem('CustomerTime', tempCustomerTime)
        let updationrecorderdb = new PouchDb(`updationrecorderdb${localStorage.getItem('store')}`);
        updationrecorderdb.get('customerUpdateTime').then(data => {
            updationrecorderdb.put({
                _id: 'customerUpdateTime',
                _rev: data._rev,
                customerUpdateTime: tempCustomerTime,
            });
        }).catch(err => {
            if (err.status == 404) {
                updationrecorderdb.put({
                    _id: 'customerUpdateTime',
                    customerUpdateTime: tempCustomerTime,
                })
            }
        });
        let customerdb = new PouchDb(`customersdb${localStorage.getItem('storeId')}`);
        let updatedCustomer = _get(res, 'data', []) || [];
        updatedCustomer.forEach((item, index) => {
            item._id = item.id
        });
        let promiseArray = updatedCustomer.map(async (customer, index) => {
            let customerObj = await customerdb.get(customer._id).then(
                data => {
                    let updateObject = updatedCustomer[index];
                    updateObject._rev = data._rev;
                    return updateObject
                }).catch(err => updatedCustomer[index]);
            // _set(customerObj, 'inventory.quantity', _get(customer, 'inventory.quantity', 0));
            return customerObj
        });
        Promise.all(promiseArray).then(async ([...updatedCustomerWith_Rev]) => {
            let resOfUpdateBulk = await customerdb.bulkDocs(updatedCustomerWith_Rev);
        }).catch((err) => {
        })

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
        let productsdb = new PouchDb(`productsdb${localStorage.getItem('storeId')}`);
        let result = await productsdb.bulkDocs(productData);
        let indexingResult = await this.makingIndexOnProductData()
        return 1;
    }
    makingIndexOnProductData = async () => {
        let t = Date.now();
        let productsdb = new PouchDb(`productsdb${localStorage.getItem('storeId')}`);
        console.log('######index time####', Date.now())
        console.log("############### making index of product ###############")
        let p1 = await productsdb.search({
            fields: [
                'product.name',
                'product.description',
                'product.sku',
                'product.keywords',
                'product.upcCode'
            ],
            build: true
        }).catch(err => {
            if (err.status == 500) {
                return
            }
            this.makingIndexOnProductData()
        });
        console.log("############### making index of Category ###############")
        let p2 = await productsdb.search({
            fields: [
                'product.category1',
                'product.category2',
                'product.category3'],
            build: true
        }).catch(err => {
            if (err.status == 500) {
                return
            }
            this.makingIndexOnProductData()
        });
        console.log("############### making index of Upc codes ###############")
        let p3 = await productsdb.createIndex({
            index: {
                fields: ["product.upcCode"],
                name: 'upcIndex',
                type: 'string'
            }
        }).catch(err => {
            if (err.status == 500) {
                return
            }
            this.makingIndexOnProductData()
        });
        // await Promise.all([p1, p2, p3]).catch(err=>{
        //     debugger;
        // });
        // console.log('###########time diffrence##########', Date.now() - t)
        // return;
    }

    handleProductFetchSuccessWrapper = (productData) => {
        let count = _get(productData, 'data.count');
        if (this.state.productPage == 1) {
            let xTask = Math.ceil(count / this.state.sizePerPage);
            let taskCount = xTask + this.state.fixedTask;
            if (this.state.taskCompletedCount != 0) {
                console.log(this.state.percentageComplete, this.state.taskCompletedCount, this.state.taskCompletedCount)
                let percentageComplete = this.state.percentageComplete + (100 / taskCount) * this.state.taskCompletedCount;
                this.setState({ taskCount: taskCount, percentageComplete, progressMsg: 'Getting Product Shelf and optimizing...' });
            }
            else {
                this.setState({ taskCount, percentageComplete: 0 })
            }
        }
        this.insertingProductToDb(_get(productData, 'data.productWithInventory', [])).then((data) => {

            if (count >= this.state.productPage * this.state.sizePerPage) {
                let percentageComplete = this.state.percentageComplete + 100 / this.state.taskCount;
                this.state.taskCompletedCount++
                this.setState({ percentageComplete, progressMsg: 'Getting Product Shelf and optimizing...' });
                this.state.productPage++;
                this.pollProduct();
            }
            else {
                this.state.taskCompletedCount++;
                let percentageComplete = this.state.percentageComplete + 100 / this.state.taskCount;
                this.setState({ percentageComplete });
            }
        })
            .catch((err) => {
                console.log("errerrerr", err)
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
                this.state.taskCompletedCount++; this.state.taskCompletedCount++;
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
    pollHotProduct = () => {
        return new Promise((resolve, reject) => {
            if (this.state.HotProductCalled == this.state.limit) {
                return;
            };
            let retailerId = localStorage.getItem('storeId');
            axiosFetcher({
                method: 'POST',
                url: 'HotProducts/Inventory/ByStore',
                reqObj: { id: retailerId },
                successCb: this.handleHotProductFetchSuccessWrapper,
                errorCb: (err) => {
                    this.state.HotProductCalled++;
                    setTimeout(this.pollHotProduct, 1000);
                }
            })
        })
    }
    handleHotProductFetchSuccessWrapper = (hotProductData) => {
        if (this.state.taskCount != undefined) {
            let percentageComplete = this.state.percentageComplete + 100 / this.state.taskCount;
            this.state.taskCompletedCount++;
            this.setState({ percentageComplete, progressMsg: 'Hot Product Succesfully Fetched' })
        }
        else {
            this.state.taskCompletedCount++;
            this.setState({ progressMsg: 'Hot Product Succesfully Fetched' })
        }
        let updatedInventory = _get(hotProductData, 'data.productWithInventory', []) || [];
        localStorage.setItem('hotProducts', JSON.stringify(updatedInventory));
        return 1;
    }

    handleClick = () => {
        this.setState({ open: true });
    }

    handleRetry = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
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
        console.log(this.state.taskCompletedCount, this.state.taskCount, this.state.percentageComplete, "######log######")
        const { classes } = this.props;
        if (this.state.taskCompletedCount == this.state.taskCount) {
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
