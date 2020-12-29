function generateGeometryActions(modelData, setModelData, pattern, storeModelUpdate) {
    var actions = {
        updateGeometries: (newGeometries) => {
            const newModelData = {
                ...modelData,
                geometries: newGeometries
            }
            setModelData(newModelData)
            storeModelUpdate(newModelData)
        },
        addNewGeometry: (geometry) => {

        }
    }
    return actions
}

export default generateGeometryActions