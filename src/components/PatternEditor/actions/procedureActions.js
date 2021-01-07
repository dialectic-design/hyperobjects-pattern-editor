function generateProcedureActions(modelData, setModelData, pattern, storeModelUpdate) {
    var actions = {
        updateProcedure: (newProcedure) => {
            const newModelData = {
                ...modelData,
                _procedures: modelData._procedures.map(procedure => {
                    if(procedure.name === newProcedure.name) {
                        return newProcedure
                    }
                    return procedure
                })
            }
            setModelData(newModelData, false, true)
            storeModelUpdate(newModelData)

        }
    }
    return actions 
}

export default generateProcedureActions