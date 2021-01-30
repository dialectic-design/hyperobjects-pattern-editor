import React, { useContext } from 'react'
import { EditorContext } from 'components/PatternEditor/PatternEditor'
import {
    Select,
    Label,
    Checkbox,
    List
} from 'semantic-ui-react'
import _ from 'lodash'
import './interpolation-line.scss'
import PointsList from './PointsList'
import { CompactPicker } from 'react-color'
import { types } from 'components/PatternEditor/procedures/types'

const InterpolationLine = ({
    procedure
}) => {
    const { modelData, actions } = useContext(EditorContext)
    const inputs = _.keys(modelData.inputs)
    const description = procedure.procedure

    const linkableTypes = [
        types.mirrorShape.type,
        types.interpolationLine.type
    ]
    const selectableLinks = modelData._procedures.filter(p => linkableTypes.includes(p.procedure.type) && p.name !== procedure.name).map(p => {
        return {
            key: p.name,
            value: p.name,
            text: p.name
        }
    })
    return (
        <div className='interpolation-line-editor'>
            <p className='type-label'>interpolation-line</p>
            {inputs.length > 0 ? (
                <>
                <Select
                placeholder="select an input"
                options={inputs.map((input) => {
                    return {
                        key: input,
                        value: input,
                        text: input
                    }
                })}
                value={description.input}
                size='mini'
                onChange={(e, data) => {
                    actions.updateProcedure({
                        ...procedure,
                        procedure: {...description, input: data.value}
                    })
                }}
                />
                <Label pointing='left'>Input</Label>
                </>
            ) : (
                <p>Add an input to the model</p>
            )}

            <h4>Points</h4>
            <PointsList procedure={procedure} />
            <h4>Grainline</h4>
            <Select
                placeholder='select grainline path'
                value={_.get(description, 'grainline', false)}
                onChange={(e, data) => {
                    actions.updateProcedure({
                        ...procedure,
                        procedure: {...description, grainline: data.value}
                    })
                }}
                options={modelData.editableGeometriesList.map((g) => {
                    return {
                        key: g,
                        value: g,
                        text: g
                    }
                })}
                />
            <h4>Link to shape</h4>
            <Select
                placeholder="select link"
                value={_.get(description, 'linkTo', false)}
                options={selectableLinks}
                onChange={(e, data) => {
                    actions.updateProcedure({
                        ...procedure,
                        procedure: {
                            ...description,
                            linkTo:  data.value
                        }
                    })
                }}
                />
            <h4>Settings</h4>
            <div className='line-settings'>
                <List>
                    <List.Item>
                        <Checkbox
                            checked={_.get(description, 'closed', false)}
                            onChange={() => {
                                actions.updateProcedure({
                                    ...procedure,
                                    procedure: {...description, closed: !_.get(description, 'closed', false)}
                                })
                            }}
                            label="Closed path" />
                    </List.Item>
                    <List.Item>
                        <Checkbox
                            checked={_.get(description, 'showName', false)}
                            onChange={() => {
                                actions.updateProcedure({
                                    ...procedure,
                                    procedure: {...description, showName: !_.get(description, 'showName', false)}
                                })
                            }}
                            label="Show name" />
                    </List.Item>
                    <List.Item>
                        <Checkbox
                            checked={_.get(description, 'showSegmentLengths', true)}
                            onChange={() => {
                                actions.updateProcedure({
                                    ...procedure,
                                    procedure: {...description, showSegmentLengths: !_.get(description, 'showSegmentLengths', false)}
                                })
                            }}
                            label="Show segment lengths" />
                    </List.Item>
                    <List.Item>
                        <Checkbox
                            checked={_.get(description, 'strokeDasharray', false) !== false}
                            onChange={() => {
                                var dashArray = false
                                if(_.get(description, 'strokeDasharray', false) === false) {
                                    dashArray = 10
                                }
                                actions.updateProcedure({
                                    ...procedure,
                                    procedure: {...description, strokeDasharray: dashArray}
                                })
                            }}
                            label="Dashed line" />
                    </List.Item>
                    <List.Item>
                        <Checkbox
                            checked={_.get(description, 'simulate', false)}
                            onChange={() => {
                                actions.updateProcedure({
                                    ...procedure,
                                    procedure: {
                                        ...description,
                                        simulate: !_.get(description, 'simulate', false),
                                        simulation: {
                                            ...description.simulation,
                                            position: _.get(description.simulation, 'position', {x: 0, y: 0, z: 0}),
                                            rotation: _.get(description.simulation, 'rotation', {x: 0, y: 0, z: 0})
                                        }
                                    }
                                })
                            }}
                            label="Simulate" />
                    </List.Item>
                </List>
            
            
            
            </div>
            <h4>Color</h4>
            <div className='procedure-color-picker'>
            <CompactPicker
                color={_.get(description, 'color', 'grey')}
                onChange={(color) => {
                    actions.updateProcedure({
                        ...procedure,
                        procedure: {
                            ...description,
                            color: color.hex
                        }
                    })
                }}
                />
            </div>
        </div>
    )
}


export default InterpolationLine