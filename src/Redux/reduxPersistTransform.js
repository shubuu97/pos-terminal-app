import { createTransform } from 'redux-persist';
import Dinero from 'dinero.js'

const SetTransform = createTransform(
  // transform state on its way to being serialized and persisted.
  (cart, key) => {
    // convert mySet to an Array.
    return {...cart};
  },
  // transform state being rehydrated
  (cart, key) => {
    // convert cart back to a dinero.
   cart.allowedCartDiscountMoney = Dinero(cart.allowedCartDiscountMoney);
   cart.cartDiscount.cartDiscountMoney = Dinero(cart.cartDiscount.cartDiscountMoney);
   cart.discountableMoney = Dinero(cart.discountableMoney);
   let cartItems = cart.cartItems;

   for(let i=0;i<cartItems.length;i++){
    cartItems[i].allowedItemDiscountMoney = Dinero(cartItems[i].allowedItemDiscountMoney);
    cartItems[i].cartDiscountMoney = Dinero(cartItems[i].cartDiscountMoney);
    cartItems[i].empDiscountMoney = Dinero(cartItems[i].empDiscountMoney);
    cartItems[i].itemDiscountMoney = Dinero(cartItems[i].itemDiscountMoney);
    cartItems[i].itemDiscountableMoney = Dinero(cartItems[i].itemDiscountableMoney);
    cartItems[i].itemEffectiveTotal = Dinero(cartItems[i].itemEffectiveTotal);
    cartItems[i].itemRegularTotalMoney = Dinero(cartItems[i].itemRegularTotalMoney);
    cartItems[i].itemSalesPriceMoney = Dinero(cartItems[i].itemSalesPriceMoney);
    cartItems[i].itemTaxAmount = Dinero(cartItems[i].itemTaxAmount);
    cartItems[i].subTotal = Dinero(cartItems[i].subTotal);
}
   cart.discountableMoney = Dinero(cart.discountableMoney);
   cart.employeeDiscountMoney = Dinero(cart.employeeDiscountMoney);
   cart.netTotalMoney = Dinero(cart.netTotalMoney);
   cart.regularTotalMoney = Dinero(cart.regularTotalMoney);
   cart.totalDiscountMoney = Dinero(cart.totalDiscountMoney);
   cart.totalItemDiscountMoney = Dinero(cart.totalItemDiscountMoney);
   cart.totalMoney = Dinero(cart.totalMoney);
   cart.totalTaxAmount = Dinero(cart.totalTaxAmount)
    return { ...cart};
  },
  // define which reducers this transform gets called for.
  { whitelist: ['cart'] }
);

export default SetTransform;