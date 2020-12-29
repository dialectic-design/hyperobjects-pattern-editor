function parsePatternFromJsonString(jsonString) {
    var patternJsonString = jsonString.slice()
    patternJsonString = patternJsonString.replace(/(\r\n|\n|\r)/gm, "").trim()
    patternJsonString = patternJsonString.replace(/\\/g, '')
    var patternModel = {}
    while (patternJsonString.charAt(0) === '"' && patternJsonString.charAt(patternJsonString.length -1) === '"') {
        patternJsonString = patternJsonString.substr(1, patternJsonString.length - 2)
    }
    try {
        patternModel = JSON.parse(patternJsonString)
    } catch(error) {
        console.log(error)
    }
    return patternModel
}

export default parsePatternFromJsonString