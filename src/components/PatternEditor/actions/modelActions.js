import _ from 'lodash'

function generateModelActions(modelData, setModelData, pattern, storeModelUpdate) {
    var actions = {
        setModelSize: (newSize) => {
            const width = _.get(newSize, 'width', 1000)
            const height = _.get(newSize, 'height', 1000)
            const depth = _.get(newSize, 'depth', 0)
            const newModelData = {
                ...modelData,
                size: {
                    width: width,
                    height: height,
                    depth: depth
                }
            }
            setModelData(newModelData, false, true)
            storeModelUpdate(newModelData)
        }
    }
    return actions
}

export default generateModelActions