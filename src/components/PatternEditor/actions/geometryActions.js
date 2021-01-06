import array_move from 'utils/array_move'
import _ from 'lodash'
import { Path, Point } from '@dp50mm/hyperobjects-language'

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
        addNewGeometry: (newGeometryName) => {
            var newModelData = modelData
            newModelData.editableGeometriesList.push(newGeometryName)
            newModelData.geometries[newGeometryName] = new Path()
            setModelData(newModelData, true)
            storeModelUpdate(newModelData)
        },
        removeGeometry: (geometryKey) => {
            var newModelData = modelData
            newModelData.editableGeometriesList = newModelData.editableGeometriesList.filter(p => p !== geometryKey)
            delete newModelData.geometries[geometryKey]
            setModelData(newModelData, false, true)
            storeModelUpdate(newModelData)
        },
        moveGeometry: (from, to) => {
            const newModelData = {
                ...modelData,
                editableGeometriesList: array_move(modelData.editableGeometriesList, from, to)
            }
            setModelData(newModelData)
            storeModelUpdate(newModelData)
        },
        moveGeometryKeyUp: (key_index) => {
            if(key_index > 0) {
                const newModelData = {
                    ...modelData,
                    editableGeometriesList: array_move(modelData.editableGeometriesList, key_index, key_index - 1)
                }
                setModelData(newModelData)
                storeModelUpdate(newModelData)
            } else {
                console.log('error, cant move element to before first array')
            }
            
        },
        moveGeometryKeyDown: (key_index) => {
            if(key_index < modelData.editableGeometriesList.length - 1) {
                const newModelData = {
                    ...modelData,
                    editableGeometriesList: array_move(modelData.editableGeometriesList, key_index, key_index + 1)
                }
                setModelData(newModelData)
                storeModelUpdate(newModelData)
            } else {
                console.log('error, cant move last element of array down')
            }
        },
        renameGeometry: (prevKey, nextKey) => {
            const index = _.findIndex(modelData.editableGeometriesList, p => p === prevKey)
            var newModelData = modelData
            newModelData.editableGeometriesList[index] = nextKey
            newModelData.geometries[nextKey] = modelData.geometries[prevKey]
            delete newModelData.geometries[prevKey]
            newModelData.geometries[nextKey].points.forEach((p, i) => {
                p.label = `${nextKey} (${i})`
            })
            setModelData(newModelData, true)
            storeModelUpdate(newModelData)
        },
        updateGeometry: (newGeometry, refresh = true) => {
            var updatedGeometries = modelData.geometries
            updatedGeometries[newGeometry.key] = newGeometry
            const newModelData = {
                ...modelData,
                geometries: updatedGeometries
            }
            setModelData(newModelData, refresh)
            storeModelUpdate(newModelData)
        },
        addPointToGeometry: (point, geometryKey) => {
            var newModelData = modelData
            newModelData.geometries[geometryKey].points = newModelData.geometries[geometryKey].points.concat([
                new Point(point)
            ])
            setModelData(newModelData, false, true)
            storeModelUpdate(newModelData)

        },
        removePointFromGeometry: (geometryKey, pointIndex) => {
            var newModelData = modelData
            newModelData.geometries[geometryKey].points = newModelData.geometries[geometryKey].points.filter((p, i) => i !== pointIndex)
            setModelData(newModelData, false, true)
            storeModelUpdate(newModelData)
        }
    }
    return actions
}

export default generateGeometryActions