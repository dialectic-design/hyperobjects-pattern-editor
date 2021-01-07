import parsePatternFromJsonString from '../utils/parsePatternFromJsonString'
import generateInputActions from './inputActions'
import generateGeometryActions from './geometryActions'
import generateModelActions from './modelActions'
import generateProcedureActions from './procedureActions'

import dayjs from 'dayjs'

let latestVersionStored = dayjs().clone().subtract(5, 'seconds')

function generateActions(modelData, setModelData, pattern, onChange) {
    function storeModelUpdate(newModelData) {
        const newJsonString = JSON.stringify(newModelData)
        var storeVersion = false
        if (dayjs().diff(latestVersionStored, 'second') > 120) {
            storeVersion = true
            latestVersionStored = dayjs()
        }
        if(newJsonString !== pattern.patternJson) {
            onChange({
                ...pattern,
                patternJson: JSON.stringify(newModelData),
                storeVersion: storeVersion
            })
        }
    }

    var inputActions = generateInputActions(modelData, setModelData, pattern, storeModelUpdate)
    var geometryActions = generateGeometryActions(modelData, setModelData, pattern, storeModelUpdate)
    var modelActions = generateModelActions(modelData, setModelData, pattern, storeModelUpdate)
    var procedureActions = generateProcedureActions(modelData, setModelData, pattern, storeModelUpdate)

    var actions = {
        ...inputActions,
        ...geometryActions,
        ...modelActions,
        ...procedureActions, 

        parseFromJson: (jsonString) => {
            setModelData(parsePatternFromJsonString(jsonString))
        },
        
    }

    return actions
}

export default generateActions