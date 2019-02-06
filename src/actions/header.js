import * as HEADER_CONSTANTS from '../constants/header'

// Action start for post login

let status = '';

export const requestHeaderToggleCat = (subreddit, leftDrawerOpen)=> ({
    type: HEADER_CONSTANTS.HEADER_TOGGLE_CAT,
    subreddit,
    leftDrawerOpen: leftDrawerOpen
});

export const requestHeaderShowHome = (subreddit, homePage)=> ({
    type: HEADER_CONSTANTS.HEADER_SHOW_HOME_PAGE,
    subreddit,
    homePage: homePage
});

export const setHeaderBackButton = (subreddit, showBackButton)=> ({
    type: HEADER_CONSTANTS.HEADER_SHOW_LEFT_BACK_BUTTON,
    subreddit,
    showBackButton: showBackButton
});

export const hideLeftBackButton = (subreddit, closeCheckoutOrOrderDrawer)=> ({
    type: HEADER_CONSTANTS.HEADER_HIDE_LEFT_BACK_BUTTON,
    subreddit,
    closeCheckoutOrOrderDrawer: closeCheckoutOrOrderDrawer,
    showBackButton: false,
});

export const openCustomerHistoryDrawer = (subreddit, orderHistoryOpen)=> ({
    type: HEADER_CONSTANTS.HEADER_ORDER_HISTORY_OPEN,
    subreddit,
    orderHistoryOpen: orderHistoryOpen,
});
//pin is here
export const openOnHoldHistoryDrawer = (subreddit, onHoldHistoryOpen)=> ({
    type: HEADER_CONSTANTS.HEADER_ONHOLD_HISTORY_OPEN,
    subreddit,
    onHoldHistoryOpen: onHoldHistoryOpen,
});

export const setProductSearchQuery = (subreddit, searchParam, searchProduct)=> ({
    type: HEADER_CONSTANTS.HEADER_SEARCH_PRODUCT,
    subreddit,
    searchParam: searchParam,
    searchProduct: searchProduct
});

export const setScanerQuery = (subreddit, scanParam, scanProduct)=> ({
    type: HEADER_CONSTANTS.HEADER_SCAN_PRODUCT,
    subreddit,
    scanParam: scanParam,
    scanProduct: scanProduct
});


export const triggerRefreshProducts = (subreddit, isRefreshProduct)=> ({
    type: HEADER_CONSTANTS.HEADER_REFRESH_PRODUCT,
    subreddit,
    isRefreshProduct: isRefreshProduct,
});

export const setRefreshTime = (subreddit, refreshTime)=> ({
    type: HEADER_CONSTANTS.HEADER_SET_REFRESH_TIME,
    subreddit,
    refreshTime: refreshTime,
});


export const triggerAddMisProduct = (addMisProduct,product)=> ({
    type: HEADER_CONSTANTS.HEADER_ADD_MISC_PRODUCT,
    addMisProduct: addMisProduct,
    product,
});