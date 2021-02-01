import array_move from "utils/array_move"

function generateProcedureActions(modelData, setModelData, pattern, storeModelUpdate) {
    var actions = {
        updateProcedure: (updatedProcedure) => {
            const newModelData = {
                ...modelData,
                _procedures: modelData._procedures.map(procedure => {
                    if(procedure.name === updatedProcedure.name) {
                        return updatedProcedure
                    }
                    return procedure
                })
            }
            setModelData(newModelData, false, true)
            storeModelUpdate(newModelData)

        },
        updateProcedures: (newProcedures) => {
            const newModelData = {
                ...modelData,
                _procedures: newProcedures
            }
            setModelData(newModelData, false, true)
            storeModelUpdate(newModelData)
        },
        addProcedure: (newProcedure) => {
            const newModelData = {
                ...modelData,
                _procedures: modelData._procedures.concat(newProcedure)
            }
            setModelData(newModelData, false, true)
            storeModelUpdate(newModelData)
        },
        deleteProcedure: (procedure) => {
            const newModelData = {
                ...modelData,
                _procedures: modelData._procedures.filter(p => p.name !== procedure.name)
            }
            setModelData(newModelData, false, true)
            storeModelUpdate(newModelData)
        },

        renameProcedure: (prevName, nextName) => {
            const newNameExists = modelData._procedures.map(p => p.name).includes(nextName)
            if(newNameExists) {
                console.log('error, a procedure exists already with this name')
            } else {
                var newModelData = {
                    ...modelData,
                    _procedures: modelData._procedures.map(p => {
                        if(p.name === prevName) {
                            return {
                                ...p,
                                name: nextName
                            }
                        } else {
                            return p
                        }
                    })
                }
                setModelData(newModelData, true)
                storeModelUpdate(newModelData)
            }
            
        },
        moveProcedure: (from, to) => {
            const newModelData = {
                ...modelData,
                _procedures: array_move(modelData._procedures, from, to)
            }
            setModelData(newModelData, false, true)
            storeModelUpdate(newModelData)
        }
    }
    return actions 
}

export default generateProcedureActions