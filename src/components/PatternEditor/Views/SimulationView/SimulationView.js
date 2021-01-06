import React, { useContext } from 'react'
import { EditorContext } from '../../PatternEditor'

const SimulationView = () => {
    const editor = useContext(EditorContext)
    console.log(editor)
    return (
        <div className='simulation-view'>
            Simulation view
        </div>
    )
}

export default SimulationView