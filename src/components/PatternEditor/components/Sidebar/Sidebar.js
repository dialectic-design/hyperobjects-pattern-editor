import React, { useState, useContext, useEffect } from 'react'
import { EditorContext } from '../../PatternEditor'
import { Button } from 'semantic-ui-react'
import TabControls from './TabControls'
import PatternViewSidebarPanel from '../../Views/PatternView/PatternViewSidebarPanel'
import SimulationViewSidebarPanel from '../../Views/SimulationView/SimulationViewSidebarPanel'
import SettingsViewSidebarPanel from '../../Views/SettingsView/SettingsViewSidebarPanel'
import ConstructionViewSidebar from '../../Views/ConstructionView/ConstructionViewSidebar'

import {
    PATTERN_TAB,
    SIMULATION_TAB,
    SETTINGS_TAB,
    CONSTRUCTION_TAB
} from '../../constants'

import "./sidebar.scss"

const SideBar = () => {
    const [showSidebar, setShowSidebar] = useState(true)
    const [mouseX, setMouseX] = useState(0)
    let slidePanelClass = 'slide-panel'
    if(showSidebar === false) {
        slidePanelClass += ' hidden'
    }
    useEffect(() => {
        function handleMouseMove(e) {
            setMouseX(e.clientX)
        }
        document.addEventListener('mousemove', handleMouseMove)
        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
        }
    })
    return (
        <div className='sidebar'>
            <Button
                className='show-hide-tab'
                icon={showSidebar ? 'arrow left' : 'arrow right'}
                size='mini'
                onClick={() => setShowSidebar(!showSidebar)}
                />
            <div className={slidePanelClass}>
                <div className='scroll-container' style={{pointerEvents: mouseX < 330 ? 'auto' : 'none'}}>
                    <SidebarContent />
                </div>
            </div>
        </div>
    )
}


const SidebarContent = React.memo(() => {
    const { pattern, editorUIState } = useContext(EditorContext)
    return (
        <React.Fragment>
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
        {editorUIState.selectedTab === CONSTRUCTION_TAB && (
            <ConstructionViewSidebar />
        )}
        <div style={{pointerEvents:'none', height: 200}} />
        </React.Fragment>
    )
    
})
export default SideBar