const paymentMethods = (num) => {
    let method
    switch (num) {
        case 0:
            method = 'Cash'
            break;
        case 1:
            method = 'Card'
            break;
        case 2:
            method = 'Gift Card'
            break;
        case 3:
            method = 'Cost Center Charge'
            break;
        case 4:
            method = 'Employee'
            break;
        case 5:
            method = 'Loyalty'
            break;
    }

    return method
}

export default paymentMethods;