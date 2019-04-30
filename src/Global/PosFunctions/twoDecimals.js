function calc(value) {
    let with2Decimals = value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
    return with2Decimals
}

export default calc;