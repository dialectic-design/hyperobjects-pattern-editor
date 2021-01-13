import React from 'react'
import Patches3DPositionsList from 'components/Patches3DPositionsList'
import SeamsList from 'components/SeamsList'
import { Tab } from 'semantic-ui-react'

const panes = [
    {
        menuItem: 'Patches',
        render: () => <Patches3DPositionsList />
    },
    {
        menuItem: 'Seams',
        render: () => <SeamsList />
    }
]

const SimulationViewSidebarPanel = () => {
    
    return (
        <div className='simulation-view-sidebar-panel'>
            <h3>Simulation</h3>
            <Tab menu={{secondary: true}} panes={panes} />
        </div>
    )
}

export default SimulationViewSidebarPanel