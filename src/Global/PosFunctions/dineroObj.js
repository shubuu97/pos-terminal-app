import Dinero from 'dinero.js'

let dineroObj = (amount, currency) => {
    return Dinero({
        amount: parseInt(amount) || 0,
        currency: currency || 'USD'
    });
}

export default dineroObj;
