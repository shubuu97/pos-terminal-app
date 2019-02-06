import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
/* Material import */

/* Redux Imports */

/* Component Imports */

/* style */
//import style from './styles/pos.less'

class HomeContainer extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }


    render() {
        return (
            <div className='pos-body'>

                <div className='pos-products-collection'>


                    <div className='pos-header'>
                        <div className="header-top">

                        </div>
                        <div className='header-bottom'>

                        </div>
                    </div>


                    <div className='product-catogories'>
                        <div className='each-tile blue-background'>
                            <span className='category-text'>
                                Hello
                            </span>
                        </div>
                        <div className='each-tile blue-background'>
                            <span className='category-text'>
                                Hello
                            </span>
                        </div>
                        <div className='each-tile blue-background'>
                            <span className='category-text'>
                                Hello
                            </span>
                        </div>
                        <div className='each-tile blue-background'>
                            <span className='category-text'>
                                Hello
                            </span>
                        </div>
                    </div>

                    <div className='pos-products'>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Red Blue Green Rose</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Item Code:</span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Name</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Item Code:</span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Name</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Item Code:</span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Name</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Item Code:</span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Name</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Item Code:</span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Name</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Item Code:</span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Name</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Item Code:</span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Name</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Item Code:</span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Name</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Item Code:</span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Name</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Item Code:</span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Name</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Item Code:</span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Name</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Item Code:</span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Name</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Item Code:</span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Name</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Item Code:</span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Name</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Item Code:</span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Name</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Item Code:</span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                        <div className='each-tile white-background flex-column'>
                            <div className='truncate'>
                                <span className="each-card-name">Name</span>
                            </div>
                            <div>
                                <span className="each-card-code-head">Item Code:</span>
                                <span className='each-card-code'>G93487739</span>
                            </div>
                            <div className="each-card-price flex-row">
                                $50.00
                                    <div className='indicator'></div>
                            </div>
                            <span className="quick-view each-card-more" title="View Details"></span>
                        </div>
                    </div>

                </div>



                <div className='pos-checkout'>
                    <div className='pos-header'>
                        <div className='checkout-tabs'>
                            <div className='each-tab'>Order</div>
                            <div className='each-tab'>Customer</div>
                            <div className='each-tab'>Payment</div>
                        </div>
                    </div>
                </div>




                <div className='pos-payment'>
                    hello
                </div>



            </div>
        );
    }
}

export default HomeContainer;