
function getDenominationTotal(stateObj){
    let amount = 0
      Object.keys(stateObj).map((denominationType)=>
    {
        if (denominationType == "pennies") {
            let denomination = 0.01;
            let quantity = parseFloat(stateObj[denominationType])||0
            amount = amount + quantity*denomination;
        }
        else if ( denominationType== "nickles") {
            let denomination = 0.05;
            let quantity = parseFloat(stateObj[denominationType])||0
            amount = amount + quantity*denomination;
        }
        else if ( denominationType== "dimes") {
            let denomination = 0.1
            let quantity = parseFloat(stateObj[denominationType])||0
            amount = amount + quantity*denomination;
        }
        else if ( denominationType== "quaters") {
            let denomination = 0.25
            let quantity = parseFloat(stateObj[denominationType])||0
            amount = amount + quantity*denomination;
        }
        else if ( denominationType== "fifyCent") {
            let denomination = 0.5
            let quantity = parseFloat(stateObj[denominationType])||0
            amount = amount + quantity*denomination;
        }
        else if ( denominationType== "oneCoin") {
            let denomination = 1
            let quantity = parseFloat(stateObj[denominationType])||0
            amount = amount + quantity*denomination;
        }
        else if ( denominationType== "one") {
            let denomination = 1
            let quantity = parseFloat(stateObj[denominationType])||0
            amount = amount + quantity*denomination;
    
        }
        else if ( denominationType== "two") {
            let denomination = 2
            let quantity = parseFloat(stateObj[denominationType])||0
            amount = amount + quantity*denomination;
        }
        else if ( denominationType== "five") {
            let denomination = 5
            let quantity = parseFloat(stateObj[denominationType])||0
            amount = amount + quantity*denomination;
        }
        else if ( denominationType== "ten") {
            let denomination = 10
            let quantity = parseFloat(stateObj[denominationType])||0
            amount = amount + quantity*denomination;
        }
        else if ( denominationType== "twenty") {
            let denomination = 20
            let quantity = parseFloat(stateObj[denominationType])||0
            amount = amount + quantity*denomination;
        }
        else if ( denominationType== "fifty") {
            let denomination = 50
            let quantity = parseFloat(stateObj[denominationType])||0
            amount = amount + quantity*denomination;
        }
        else if (denominationType== "hundred") {
            let denomination = 100
            let quantity = parseFloat(stateObj[denominationType])||0
            amount = amount + quantity*denomination;
        }
    });
    debugger;
    return amount;
}

export default  getDenominationTotal;