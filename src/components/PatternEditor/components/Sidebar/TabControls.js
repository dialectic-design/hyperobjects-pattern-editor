import React from 'react'
import {
    Button
} from 'semantic-ui-react'
import {
    PATTERN_TAB,
    SETTINGS_TAB,
    FABRICATION_TAB,
    CONSTRUCTION_TAB,
    SIMULATION_TAB
} from '../../constants'

var row1 = [
    PATTERN_TAB,
    SETTINGS_TAB
]

var row2 = [
    FABRICATION_TAB,
    CONSTRUCTION_TAB,
    SIMULATION_TAB
]

const TabControls = ({
    editorUIState
}) => {
    return (
        <React.Fragment>
            <Button.Group size='tiny' className='tab-selection'>
                {row1.map(tab => {
                    return (
                        <Button
                            key={tab}
                            toggle
                            active={tab === editorUIState.selectedTab}
                            onPointerDown={() => {
                                editorUIState.setSelectedTab(tab)
                            }}
                            >
                            {tab}
                        </Button>
                    )
                })}
            </Button.Group>
            <Button.Group size='tiny' className='tab-selection'>
                {row2.map(tab => {
                    return (
                        <Button
                            key={tab}
                            toggle
                            active={tab === editorUIState.selectedTab}
                            onPointerDown={() => {
                                editorUIState.setSelectedTab(tab)
                            }}
                            >
                            {tab}
                        </Button>
                    )
                })}
            </Button.Group>
        </React.Fragment>
    )
}

export default TabControls