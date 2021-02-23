import { Model } from '@dp50mm/hyperobjects-language'
import _ from 'lodash'

function parsePatternFromJsonString(jsonString) {
    if(jsonString === 'initialized') {
        var newModelTemplate = new Model().extractModel()
        newModelTemplate._procedures = []
        return newModelTemplate
    }
    var patternJsonString = jsonString.slice()
    patternJsonString = patternJsonString.replace(/(\r\n|\n|\r)/gm, "").trim()
    patternJsonString = patternJsonString.replace(/\\/g, '')
    var patternModel = {}
    while (patternJsonString.charAt(0) === '"' && patternJsonString.charAt(patternJsonString.length -1) === '"') {
        patternJsonString = patternJsonString.substr(1, patternJsonString.length - 2)
    }
    try {
        patternModel = JSON.parse(patternJsonString)
        if(patternModel.size !== undefined) {
            patternModel.size = {
                width: _.toNumber(_.get(patternModel.size, 'width', 1000)),
                height: _.toNumber(_.get(patternModel.size, 'height', 1000)),
                depth: _.toNumber(_.get(patternModel.size, 'depth', 1000))
            }
        }
    } catch(error) {
        console.log(error)
    }
    return patternModel
}

export default parsePatternFromJsonString