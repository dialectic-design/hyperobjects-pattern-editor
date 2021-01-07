import React, { useContext } from 'react'
import { Select, Label } from 'semantic-ui-react'
import { EditorContext } from 'components/PatternEditor/PatternEditor'

const CurvePointSelector = ({
    procedure,
    geometry,
    geometryIndex
}) => {
    const { modelData, actions } = useContext(EditorContext)
    const description = procedure.procedure
    return (
        <div className='curve-point-selector'>
            <Select
                placeholder="select"
                value={geometry.curvePoint1}
                options={modelData.editableGeometriesList.map((geometry) => {
                    return {
                        key: geometry,
                        value: geometry,
                        text: geometry
                    }
                }).concat([{
                    key: 'no-point',
                    value: false,
                    text: 'No point'
                }])}
                onChange={(e, data) => {
                    actions.updateProcedure({...procedure,
                        procedure: {...description,
                            geometries: description.geometries.map((g, i) => {
                                    if(i === geometryIndex) {
                                        return {
                                            ...g, curvePoint1: data.value
                                        }
                                    }
                                    return g
                                })
                            }
                    })
                }}
                />
                <Select
                placeholder="select"
                value={geometry.curvePoint2}
                options={modelData.editableGeometriesList.map((geometry) => {
                    return {
                        key: geometry,
                        value: geometry,
                        text: geometry
                    }
                }).concat([{
                    key: 'no-point',
                    value: false,
                    text: 'No point'
                }])}
                onChange={(e, data) => {
                    actions.updateProcedure({...procedure,
                        procedure: {...description,
                            geometries: description.geometries.map((g, i) => {
                                    if(i === geometryIndex) {
                                        return {
                                            ...g, curvePoint2: data.value
                                        }
                                    }
                                    return g
                                })
                            }
                    })
                }}
                />
                <Label pointing='left' basic>Curve points</Label>
        </div>
    )
}

export default CurvePointSelector