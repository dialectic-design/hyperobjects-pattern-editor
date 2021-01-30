import parsePatternFromJsonString from '../utils/parsePatternFromJsonString'
import generateInputActions from './inputActions'
import generateGeometryActions from './geometryActions'
import generateModelActions from './modelActions'
import generateProcedureActions from './procedureActions'
import generateConstructionActions from './constructionActions'
import generateFabricationActions from './fabricationActions'

import dayjs from 'dayjs'

// Initialize so that whenever a first change is made upon initialy opening the app a new version is stored.
let latestVersionStored = dayjs().clone().subtract(150, 'seconds')

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

    function storePatternUpdate(newPatternData) {
        var storeVersion = false
        if (dayjs().diff(latestVersionStored, 'second') > 120) {
            storeVersion = true
            latestVersionStored = dayjs()
        }
        onChange({
            ...pattern,
            ...newPatternData,
            storeVersion: storeVersion
        })
    }

    var inputActions = generateInputActions(modelData, setModelData, pattern, storeModelUpdate, storePatternUpdate)
    var geometryActions = generateGeometryActions(modelData, setModelData, pattern, storeModelUpdate, storePatternUpdate)
    var modelActions = generateModelActions(modelData, setModelData, pattern, storeModelUpdate, storePatternUpdate)
    var procedureActions = generateProcedureActions(modelData, setModelData, pattern, storeModelUpdate, storePatternUpdate)
    var constructionActions = generateConstructionActions(modelData, setModelData, pattern, storeModelUpdate, storePatternUpdate)
    var fabricationActions = generateFabricationActions(modelData, setModelData, pattern, storeModelUpdate, storePatternUpdate)

    var actions = {
        ...inputActions,
        ...geometryActions,
        ...modelActions,
        ...procedureActions, 
        ...constructionActions,
        ...fabricationActions,
        
        parseFromJson: (jsonString) => {
            setModelData(parsePatternFromJsonString(jsonString))
        },
        
    }

    return actions
}

export default generateActions