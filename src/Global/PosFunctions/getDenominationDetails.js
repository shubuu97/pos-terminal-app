
function getDenominationDetails(stateObj){
    let  denominationDetails  = Object.keys(stateObj).map((denomination)=>
    {
        let obj = {};
        if (denomination == "pennies") {
        obj.denomination = '0.01';
        obj.quantity = parseInt(stateObj[denomination])||0;
        obj.cashType = 1
        }
        else if ( denomination== "nickles") {
            obj.denomination = '0.05'
            obj.quantity = parseInt(stateObj[denomination])||0
            obj.cashType = 1
        }
        else if ( denomination== "dimes") {
            obj.denomination = '0.1'
            obj.quantity = parseInt(stateObj[denomination])||0
            obj.cashType = 1
        }
        else if ( denomination== "quaters") {
            obj.denomination = '0.25'
            obj.quantity = parseInt(stateObj[denomination])||0
            obj.cashType = 1
        }
        else if ( denomination== "fifyCent") {
            obj.denomination = '0.5'
            obj.quantity = parseInt(stateObj[denomination])||0
            obj.cashType = 1
        }
        else if ( denomination== "oneCoin") {
            obj.denomination = '1'
            obj.quantity = parseInt(stateObj[denomination])||0
            obj.cashType = 1
        }
        else if ( denomination== "one") {
            obj.denomination = '1'
            obj.quantity = parseInt(stateObj[denomination])||0
            obj.cashType = 0
    
        }
        else if ( denomination== "two") {
            obj.denomination = '2'
            obj.quantity = parseInt(stateObj[denomination])||0
            obj.cashType = 0
        }
        else if ( denomination== "five") {
            obj.denomination = '5'
            obj.quantity = parseInt(stateObj[denomination])||0
            obj.cashType = 0
        }
        else if ( denomination== "ten") {
            obj.denomination = '10'
            obj.quantity = parseInt(stateObj[denomination])||0
            obj.cashType = 0
        }
        else if ( denomination== "twenty") {
            obj.denomination = '20'
            obj.quantity = parseInt(stateObj[denomination])||0
            obj.cashType = 0
        }
        else if ( denomination== "fifty") {
            obj.denomination = '50'
            obj.quantity = parseInt(stateObj[denomination])||0
            obj.cashType = 0
        }
        else if (denomination== "hundred") {
            obj.denomination = '100'
            obj.quantity = parseInt(stateObj[denomination])||0
            obj.cashType = 0
        }
        return obj
    });
    return denominationDetails;
}

export default  getDenominationDetails;