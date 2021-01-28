import _ from 'lodash'

function generateConstructionActions(modelData, setModelData, pattern, storeModelUpdate, storePatternUpdate) {
    var construction = _.get(pattern, 'construction', {})
    var elements = _.get(construction, 'elements', [])
    var actions = {
        addConstructionElement: (newElement) => {
            if(!elements.map(p => p.key).includes(newElement.key)) {
                elements.push(newElement)
            } else {
                console.log('element with key: ', newElement.key, ' exists already')
            }
            const newPattern = {
                ...pattern,
                construction: {
                    ...construction,
                    elements: elements
                }
            }
            storePatternUpdate(newPattern)
        }
    }
    return actions
}

export default generateConstructionActions