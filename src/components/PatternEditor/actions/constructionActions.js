import _ from 'lodash'

function generateConstructionActions(modelData, setModelData, pattern, storeModelUpdate, storePatternUpdate) {
    var construction = _.get(modelData, 'construction', {})
    var elements = _.get(construction, 'elements', [])
    var actions = {
        addConstructionElement: (newElement) => {
            if(!elements.map(p => p.key).includes(newElement.key)) {
                elements.push(newElement)
            } else {
                console.log('element with key: ', newElement.key, ' exists already')
            }
            const newModelData = {
                ...modelData,
                construction: {
                    ...construction,
                    elements: elements
                }
            }
            setModelData(newModelData)
            storeModelUpdate(newModelData)
        },
        setConstructionSize: (newSize) => {
            const width = _.get(newSize, 'width', 1000)
            const height = _.get(newSize, 'height', 1000)
            const newModelData = {
                ...modelData,
                construction: {
                    ...construction,
                    size: {
                        width: width,
                        height: height
                    }
                }
            }
            setModelData(newModelData, true, true)
            storeModelUpdate(newModelData)
        }
    }
    return actions
}

export default generateConstructionActions