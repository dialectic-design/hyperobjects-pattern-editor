import React, { useContext } from 'react'
import { EditorContext } from '../../PatternEditor'
import PositionEditor from 'components/PositionEditor'
import _ from 'lodash'

const SimulationViewSidebarPanel = () => {
    const { modelData, actions } = useContext(EditorContext)
    const proceduresWithSim = modelData._procedures.map((p, i) => {
        return {
            ...p,
            __index: i
        }
    }).filter(p => _.has(p.procedure, 'simulation') && _.get(p.procedure, 'simulate', false))
    return (
        <div className='simulation-view-sidebar-panel'>
            <h3>Simulation</h3>
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
                    </div>
                )
            })}
        </div>
    )
}

export default SimulationViewSidebarPanel