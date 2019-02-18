import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */

/* Redux Imports */
import { connect } from 'react-redux';
import genericPostData from '../Global/dataFetch/genericPostData'
/* React Pose */
import posed from 'react-pose';
/* Component Imports */
import ProductsSection from '../Components/ProductsSection/ProductsSection'
import CheckoutSection from '../Components/CheckoutSection/CheckoutSection'
import PaymentSection from '../Components/PaymentSection/PaymentSection'


/* Pose Animation Configs */
const Config = {
    open: { width: '60%', opacity: 1 },
    closed: { width: '0px', opacity: 0 }
}

const Products = posed.div(Config)
const Payment = posed.div(Config)


class HomeContainer extends React.Component {

    constructor() {
        super();
        this.state = {
            productListHeight: 0,
            isOpenProduct: true,
            isOpenPayment: false,
        }
    }

    componentDidMount() {
        this.calcHeight();
        this.getProductData();
        // ! To be deleted
        this.TEMPinitialize();

        
    }

    TEMPinitialize() {
        localStorage.setItem('Token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJPcGVyYXRvciI6eyJpZCI6ImQ0NDU1YzAzLTUxM2YtNDk5Ny05ZWYzLWQxMDE1ZWUwYTQwZCIsInN0b3JlSWQiOiJmZTkzMjhlOS1hNzJhLTRmMzktYmM3ZS01N2Q2OWUwNzRhNjEiLCJhY3RpdmUiOnRydWUsInBlcnNvbiI6eyJmaXJzdE5hbWUiOiJPcGVyYXRvciIsImxhc3ROYW1lIjoiUGVyc29uIn0sInBob25lTnVtYmVyIjp7ImNvdW50cnlDb2RlIjo5MSwicGhvbmVOdW1iZXIiOjEyMzEyMzEyM30sImVtYWlsIjoiU3RvcmUxT3AxLmdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJhJDEwJGh0T1owQTJUZDQ0bnZqNmdVN3N4QU90Ty4zelEvSWZkODg0VTB4S0o3c0JGdi5HbndObUNtIiwibG9naW5QaW4iOiIxMjM0NSIsInJvbGUiOiJjYXNoaWVyIn0sIlN0b3JlIjp7ImlkIjoiZmU5MzI4ZTktYTcyYS00ZjM5LWJjN2UtNTdkNjllMDc0YTYxIiwibmFtZSI6IlN0b3JlMSIsImFkZHJlc3MiOnsiYWRkcmVzc0xpbmUxIjoiQWRkcmVzcyBsaW5lIDEiLCJhZGRyZXNzTGluZTIiOiJBZGRyZXNzIExpbmUgMiIsImNpdHkiOiJCb290aCIsInN0YXRlIjoiQUwiLCJjb3VudHJ5IjoiVVNBIiwicG9zdGFsQ29kZSI6IjM2MDA4In0sImFjdGl2ZSI6dHJ1ZSwicmV0YWlsZXJJZCI6ImIxYjMzYWVkLTdiNTctNDQzNC1iODk0LTVjMzFjZmNlZTRhMyJ9LCJSZXRhaWxlciI6eyJpZCI6ImIxYjMzYWVkLTdiNTctNDQzNC1iODk0LTVjMzFjZmNlZTRhMyIsIm5hbWUiOiJBcmFtYXJrIERldi4ifSwiZXhwIjoxNTUwNzUwNDM4LCJpc3MiOiJwb3MtYXV0aC1zZXJ2aWNlIn0.-gbDAm5ZZSCtFfMLlO9Ieetme7CJS3nJBRwLN4Y8SMI')
        localStorage.setItem('email', 'Store1Op1.gmail.com')
        localStorage.setItem('retailerId', 'b1b33aed-7b57-4434-b894-5c31cfcee4a3')
        localStorage.setItem('role', 'cashier')
        localStorage.setItem('storeId', 'fe9328e9-a72a-4f39-bc7e-57d69e074a61')
        localStorage.setItem('terminalId', '92e0c56e-c95c-4002-99cc-5812485b2e2c')
        localStorage.setItem('userId', 'd4455c03-513f-4997-9ef3-d1015ee0a40d')
        localStorage.setItem('userName', 'Operator Person')
        localStorage.setItem('userPin', '12345')
    }

    calcHeight() {
        let windowHeight = document.documentElement.scrollHeight
        // * Product Section Calculations
        let headerHeight = 80;
        let categoriesHeight = 90;
        let productListHeight = windowHeight - (headerHeight + categoriesHeight + 50)
        // * Checkout Section Calculations
        let checkoutHeader = headerHeight * 0.65;
        let checkoutMainPart = windowHeight - (checkoutHeader + 80);
        let checkoutcalcArea = 150
        let checkoutactionArea = 60
        let checkoutcartArea = checkoutMainPart - (checkoutcalcArea + checkoutactionArea)


        this.setState({
            windowHeight: windowHeight,
            headerHeight,
            categoriesHeight,
            productListHeight,
            checkoutHeader,
            checkoutMainPart,
            checkoutcalcArea,
            checkoutactionArea,
            checkoutcartArea
        })
    }

    toggleViewPayment = () => {
        this.setState({
            isOpenProduct: false,
            isOpenPayment: true,
        })
    }

    toggleViewProduct = () => {
        this.setState({
            isOpenProduct: true,
            isOpenPayment: false,
        })
    }

    getProductData = () => {
        let storeId = localStorage.getItem('storeId')
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: {id : storeId},
            url: 'Product/ByStoreId',
            constants: {
                init: 'GET_PRODUCT_DATA_INIT',
                success: 'GET_PRODUCT_DATA_SUCCESS',
                error: 'GET_PRODUCT_DATA_ERROR'
            },
            // successCb:()=> this.deleteSuccess(),
            // errorCb:()=> this.deleteSuccess(),
            successText: 'Product Fetched Successfully',
        })
    }

    componentWillReceiveProps(props){
        
    }


    render() {
        let windowHeight = document.documentElement.scrollHeight

        let { productListHeight, isOpenProduct, isOpenPayment, headerHeight, categoriesHeight, checkoutHeader, checkoutMainPart, checkoutcalcArea, checkoutactionArea, checkoutcartArea } = this.state

        let { productList, dispatch, cartItems } = this.props
        return (
            <div className='main pos-body'>
                <Products pose={isOpenProduct ? 'open' : 'closed'}>
                    <ProductsSection
                        // * Css Specific props
                        windowHeight={windowHeight}
                        productListHeight={productListHeight}
                        headerHeight={headerHeight}
                        categoriesHeight={categoriesHeight}
                        productList = {productList}
                        cartItems={cartItems}
                        dispatch={dispatch}
                    // ! Actions

                    />
                </Products>

                <CheckoutSection
                    // * Css Specific props
                    windowHeight={windowHeight}
                    checkoutHeader={checkoutHeader}
                    checkoutMainPart={checkoutMainPart}
                    checkoutcalcArea={checkoutcalcArea}
                    checkoutactionArea={checkoutactionArea}
                    checkoutcartArea={checkoutcartArea}
                    // ! Actions
                    toggleViewPayment={this.toggleViewPayment}
                    toggleViewProduct={this.toggleViewProduct}

                />

                <Payment pose={isOpenPayment ? 'open' : 'closed'}>
                    <PaymentSection />
                </Payment>

            </div>
        );
    }
}

function mapStateToProps(state) {
    let { productList, cartItems } = state

    return {
        productList,
        cartItems
    }
}
export default connect(mapStateToProps)(HomeContainer)
