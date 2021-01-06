import React, { useState, useContext } from 'react'
import { EditorContext } from '../../PatternEditor'
import { Button } from 'semantic-ui-react'
import TabControls from './TabControls'
import PatternViewSidebarPanel from '../../Views/PatternView/PatternViewSidebarPanel'
import SimulationViewSidebarPanel from '../../Views/SimulationView/SimulationViewSidebarPanel'
import SettingsViewSidebarPanel from '../../Views/SettingsView/SettingsViewSidebarPanel'

import { PATTERN_TAB,
    SIMULATION_TAB,
    SETTINGS_TAB } from '../../constants'

import "./sidebar.scss"

const SideBar = ({
    editorUIState
}) => {
    const { pattern } = useContext(EditorContext)
    const [showSidebar, setShowSidebar] = useState(true)
    let slidePanelClass = 'slide-panel'
    if(showSidebar === false) {
        slidePanelClass += ' hidden'
    }
    return (
        <div className='sidebar'>
            <Button
                className='show-hide-tab'
                icon={showSidebar ? 'arrow left' : 'arrow right'}
                size='mini'
                onClick={() => setShowSidebar(!showSidebar)}
                />
            <div className={slidePanelClass}>
                <div className='scroll-container'>
                    <div className='sidebar-header'>
                        <h1>{pattern.name}</h1>
                        <Button
                            icon='setting'
                            floated='right'
                            size="mini"
                            onClick={() => editorUIState.setShowSettings(!editorUIState.showSettings)}
                            />
                        <p className='pattern-id'>Pattern id: {pattern._id}</p>
                    </div>
                    <TabControls editorUIState={editorUIState} />
                    {editorUIState.selectedTab === PATTERN_TAB && (
                        <PatternViewSidebarPanel />
                    )}
                    {editorUIState.selectedTab === SIMULATION_TAB && (
                        <SimulationViewSidebarPanel />
                    )}
                    {editorUIState.selectedTab === SETTINGS_TAB && (
                        <SettingsViewSidebarPanel />
                    )}
                </div>
            </div>
        </div>
    )
}

export default SideBar