import React from 'react'
import {
    Button
} from 'semantic-ui-react'
import { tabs } from '../../constants'

const TabControls = ({
    editorUIState
}) => {
    return (
        <Button.Group size='tiny' className='tab-selection'>
            {tabs.map(tab => {
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
    )
}

export default TabControls