import React, { useContext } from 'react'
import { EditorContext } from 'components/PatternEditor/PatternEditor'
import {
    Select,
    Label,
    Checkbox
} from 'semantic-ui-react'
import _ from 'lodash'
import './interpolation-line.scss'
import PointsList from './PointsList'
import { CompactPicker } from 'react-color'

const InterpolationLine = ({
    procedure
}) => {
    const { modelData, actions } = useContext(EditorContext)
    const inputs = _.keys(modelData.inputs)
    const description = procedure.procedure
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
            <div className='line-settings'>
            <Checkbox
                checked={_.get(description, 'closed', false)}
                onChange={() => {
                    actions.updateProcedure({
                        ...procedure,
                        procedure: {...description, closed: !_.get(description, 'closed', false)}
                    })
                }}
                label="closed path" />
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
                label="simulate" />
            </div>
            <h4>Color</h4>
            <div className='procedure-color-picker'>
            <CompactPicker />
            </div>
        </div>
    )
}


export default InterpolationLine