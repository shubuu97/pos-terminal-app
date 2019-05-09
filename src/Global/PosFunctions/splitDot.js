let splitDot = (num) => {
    if (num !== undefined) {
        let b = num.toString().split(".");
        let c
        if (b[1] != undefined) {
            if (b[1].length == 0) {
                c = b[0] + b[1] + '00'
            }
            else if (b[1].length == 1) {
                c = b[0] + b[1] + '0'
            }
            else if (b[1].length == 2) {
                c = b[0] + b[1]

            }
        } else {
            c = b[0] + '00'
        }
        return c
    }
    else {
        return ''
    }

}

export default splitDot;