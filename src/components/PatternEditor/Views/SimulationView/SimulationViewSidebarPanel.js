import React, { useContext } from 'react'
import { EditorContext } from '../../PatternEditor'

const SimulationViewSidebarPanel = () => {
    const editor = useContext(EditorContext)
    console.log(editor)
    return (
        <div className='simulation-view-sidebar-panel'>
            Simulation view
        </div>
    )
}

export default SimulationViewSidebarPanel