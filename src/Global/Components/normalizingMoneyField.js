var numeral = require('numeral');

const formatMoney = (value, pv, av, apv) => {
  if (!value) {
    return value
  }
  console.log(value, "value")
  let normalizedMoney = numeral(value).format('0,0');
  console.log(normalizedMoney, "normalizedMoney");
  return normalizedMoney
}

export default formatMoney