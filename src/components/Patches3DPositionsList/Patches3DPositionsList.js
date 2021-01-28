import React, { useContext } from 'react'
import PositionEditor from 'components/PositionEditor'
import { EditorContext } from 'components/PatternEditor/PatternEditor'
import { Form, Checkbox } from 'semantic-ui-react'
import _ from 'lodash'


const Patches3DPositionsList = () => {
    const { modelData, actions } = useContext(EditorContext)
    const proceduresWithSim = modelData._procedures.map((p, i) => {
        return {
            ...p,
            __index: i
        }
    }).filter(p => _.has(p.procedure, 'simulation') && _.get(p.procedure, 'simulate', false))
    
    return (
        <div className='patches-3d-positions-list'>
            {proceduresWithSim.map(procedure => {
                return (
                    <div key={procedure.__index}>
                        <h4>{procedure.name}</h4>
                        <PositionEditor
                            position={_.get(procedure, 'simulation.position', {x: 0, y: 0, z: 0})}
                            rotation={_.get(procedure, 'simulation.rotation', {x: 0, y: 0, z: 0})}
                            callback={(e) => {
                                actions.updateProcedure({
                                    ...procedure,
                                    simulation: {
                                        ...procedure.simulation,
                                        position: e.position,
                                        rotation: e.rotation
                                    }
                                })
                            }}
                            />
                        <div className='ui form'>
                            <Form.Field>
                                <Checkbox
                                    checked={_.get(procedure, 'simulation.reversePathOverride', false)}
                                    onChange={() => {
                                        actions.updateProcedure({
                                            ...procedure,
                                            simulation: {
                                                ...procedure.simulation,
                                                reversePathOverride: !_.get(procedure, 'simulation.reversePathOverride', false)
                                            }
                                        })
                                    }}
                                    label="Reverse path override" />
                            </Form.Field>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Patches3DPositionsList