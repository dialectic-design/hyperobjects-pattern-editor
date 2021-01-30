import _ from 'lodash'

function generateFabricationActions(modelData, setModelData, pattern, storeModelUpdate, storePatternUpdate) {
    var fabrication = _.get(modelData, 'fabrication', {})
    var actions = {
        updateFabrication: (updatedFabrication) => {
            const newModelData = {
                ...modelData,
                fabrication: updatedFabrication
            }
            setModelData(newModelData)
            storeModelUpdate(newModelData)
        },
        setFabricationSize: (newSize) => {
            const width = _.get(newSize, 'width', 1000)
            const height = _.get(newSize, 'height', 1000)
            const newModelData = {
                ...modelData,
                fabrication: {
                    ...fabrication,
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

export default generateFabricationActions