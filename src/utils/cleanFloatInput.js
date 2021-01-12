function cleanFloatInput(input) {
    if(input !== "0" && input !== 0) {
        input = input.replace(/^0+/, '').replace(/[^\d.-]/g,'')
    }
    if(input.length === 0) {
        input = "0"
    }
    return input
}

export default cleanFloatInput