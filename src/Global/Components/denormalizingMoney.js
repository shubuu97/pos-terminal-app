var numeral = require('numeral');

const deformatMoney = (value) => {
    if (!value) {
      return value
    }
return  numeral(value).value()

  }

 export default deformatMoney