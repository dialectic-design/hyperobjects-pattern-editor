import React, { createContext, useEffect, useState } from 'react'

import './pattern-editor.scss'
import _ from 'lodash'
import {
    Loader,
    Message,
    Icon
} from 'semantic-ui-react'
import generateActions from './actions'
import {
    PATTERN_TAB,
    SIMULATION_TAB,
    SETTINGS_TAB
} from './constants'
import Sidebar from './components/Sidebar'
import PatternView from './Views/PatternView'
import SimulationView from './Views/SimulationView'
import SettingsView from './Views/SettingsView'



export const EditorContext = createContext()

const PatternEditor = ({
    pattern,
    onChange
}) => {
    var [modelData, setModelData] = useState(false)
    var [modelUpdateCounter, setModelUpdateCounter] = useState(0)
    var [refreshViews, setRefreshViews] = useState(false)
    var [selectedTab, setSelectedTab] = useState(PATTERN_TAB)
    function updateModel(newModelData, refresh = false) {
        setModelData(newModelData)
        setModelUpdateCounter(modelUpdateCounter + 1)
        if(refresh) {
            setRefreshViews(true)
        }
    }
    var actions = generateActions(modelData, updateModel, pattern, onChange)

    useEffect(() => {
        if(modelData === false) {
            actions.parseFromJson(pattern.patternJson)
        }
    }, [modelData, setModelData, pattern])
    useEffect(() => {
        if(refreshViews) {
            setTimeout(() => {
                setRefreshViews(false)
            }, 10)
        }
    }, [refreshViews, setRefreshViews])
    
    if(modelData === false) {
        return (
            <p>Loading model</p>
        )
    }
    const editorUIState = {
        selectedTab,
        setSelectedTab
    }
    const contextValue = {
        refreshViews,
        modelUpdateCounter,
        pattern,
        modelData,
        actions
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
            </div>
        </EditorContext.Provider>
    )
}

export default PatternEditor