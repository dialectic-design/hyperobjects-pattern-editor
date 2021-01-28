import React, { createContext, useEffect, useState } from 'react'

import './pattern-editor.scss'
import generateActions from './actions'
import {
    PATTERN_TAB,
    SIMULATION_TAB,
    SETTINGS_TAB,
    CONSTRUCTION_TAB,
    FABRICATION_TAB
} from './constants'
import Sidebar from './components/Sidebar'
import PatternView from './Views/PatternView'
import SimulationView from './Views/SimulationView'
import SettingsView from './Views/SettingsView'
import ConstructionView from './Views/ConstructionView'
import FabricationView from './Views/FabricationView'



export const EditorContext = createContext()

const PatternEditor = ({
    pattern,
    onChange
}) => {
    const [modelData, setModelData] = useState(false)
    const [modelUpdateCounter, setModelUpdateCounter] = useState(0)
    const [refreshViews, setRefreshViews] = useState(false)
    const [selectedTab, setSelectedTab] = useState(PATTERN_TAB)
    const [selectedElement, setSelectedElement] = useState(false)
    const [hoveredElement, setHoveredElement] = useState(false)
    const [frameFromParameters, setFrameFromParameters] = useState(false)
    const [showSettings, setShowSettings] = useState(false)

    function updateModel(newModelData, refresh = false, fromParams = false) {
        setModelData(newModelData)
        setModelUpdateCounter(modelUpdateCounter + 1)
        if(refresh) {
            setRefreshViews(true)
        }
        if(fromParams) {
            setFrameFromParameters(true)
        }
    }
    var actions = generateActions(modelData, updateModel, pattern, onChange)

    useEffect(() => {
        if(modelData === false) {
            actions.parseFromJson(pattern.patternJson)
        }
    }, [modelData, setModelData, pattern, actions])
    useEffect(() => {
        if(refreshViews) {
            setTimeout(() => {
                setRefreshViews(false)
            }, 10)
        }
        if(frameFromParameters) {
            setTimeout(() => {
                setFrameFromParameters(false)
            }, 1)
        }
    }, [refreshViews, setRefreshViews, frameFromParameters,  setFrameFromParameters, actions])
    
    if(modelData === false) {
        return (
            <p>Loading model</p>
        )
    }
    const editorUIState = {
        selectedTab,
        setSelectedTab,
        showSettings,
        setShowSettings
    }
    const contextValue = {
        refreshViews,
        modelUpdateCounter,
        pattern,
        modelData,
        actions,
        selectedElement,
        setSelectedElement,
        hoveredElement,
        setHoveredElement,
        frameFromParameters,
        editorUIState,
        setRefreshViews,
        
    }
    return (
        <EditorContext.Provider value={contextValue}>
            <div className='pattern-editor'>
                <Sidebar editorUIState={editorUIState} />
                {selectedTab === PATTERN_TAB && (
                    <PatternView modelUpdateCounter={modelUpdateCounter} />
                )}
                {selectedTab === SIMULATION_TAB && (
                    <SimulationView />
                )}
                {selectedTab === SETTINGS_TAB && (
                    <SettingsView />
                )}
                {selectedTab === CONSTRUCTION_TAB && (
                    <ConstructionView />
                )}
                {selectedTab === FABRICATION_TAB && (
                    <FabricationView />
                )}
            </div>
        </EditorContext.Provider>
    )
}

export default PatternEditor