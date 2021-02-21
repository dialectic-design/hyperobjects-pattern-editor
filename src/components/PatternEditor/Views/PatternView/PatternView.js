import React, { useContext, useEffect, useState, useMemo, useRef } from 'react'
import {
    Frame,
    Model
} from '@dp50mm/hyperobjects-language'
import '@dp50mm/hyperobjects-language/dist/index.css'
import { generateProcedures } from '../../procedures'
import _ from 'lodash'
import { EditorContext } from '../../PatternEditor'
import RefreshTree from 'components/RefreshTree'
import { resetGeometriesStyle, setSelectedStyle, setHighlightedStyle, highlightLastPoint } from './modelStyling'
import ToolsPanel from './ToolsPanel'
import {
    Message
} from 'semantic-ui-react'
import isPoint from 'utils/isPoint'
import ModelSettings from './ModelSettings'
import MouseToolIcon from './MouseToolIcon'

export const tools = {
    move: "move",
    add: "add",
    remove: "remove"
}

const PatternView = () => {
    const ref = useRef(null)
    const {
        pattern,
        modelData,
        actions,
        refreshViews,
        selectedElement,
        hoveredElement,
        frameFromParameters,
        editorUIState,
    } = useContext(EditorContext)
    const [highlightedElement, setHighlightedElement] = useState(false)
    const [selectedElementInFrame, setSelectedElementInFrame] = useState(false)
    const [updateFromParameters, setUpdateFromParameters] = useState(false)
    const [showPointLabels, setShowPointLabels] = useState(false)
    const [stylingUpdated, setStylingUpdated] = useState(false)
    const [tool, setTool] = useState(tools.move)
    
    var model = useMemo(() => {
        const _stylingSettings = {
            showPointLabels
        }
        var generatedModel = resetGeometriesStyle(modelData, _stylingSettings)
        generatedModel.procedures = generateProcedures(_.get(modelData, '_procedures'), [])

        var _model = new Model(pattern.name)
        _model.importModel(generatedModel)
        return _model
    }, [pattern, modelData, showPointLabels])
    
    
    useEffect(() => {
        const _stylingSettings = {
            showPointLabels
        }
        if(frameFromParameters) {
            setUpdateFromParameters(true)
        }
        if(selectedElementInFrame !== selectedElement) {
            setSelectedElementInFrame(selectedElement)
            resetGeometriesStyle(model, _stylingSettings)
            setUpdateFromParameters(true)
        }
        if(highlightedElement !== hoveredElement) {
            setHighlightedElement(hoveredElement)
            resetGeometriesStyle(model, _stylingSettings)
            setUpdateFromParameters(true)
        }
        if(stylingUpdated) {
            setTimeout(() => { setStylingUpdated(false) }, 1)
        }

        if(updateFromParameters) {
            setTimeout(() => { setUpdateFromParameters(false) }, 1)
        }
    }, [
        selectedElementInFrame,
        selectedElement,
        highlightedElement,
        hoveredElement,
        updateFromParameters,
        model,
        frameFromParameters,
        stylingUpdated,
        showPointLabels
    ])
    
    if(hoveredElement && !_.isUndefined(model.geometries[hoveredElement])) {
        setHighlightedStyle(model.geometries[hoveredElement])
    }
    if(selectedElement && !_.isUndefined(model.geometries[selectedElement])) {
        setSelectedStyle(model.geometries[selectedElement])
        if(tool === tools.add) highlightLastPoint(model, selectedElement)
        
    }
    
    const width = _.max([window.innerWidth, 100])
    const height = window.innerHeight - 45

    var pointClickCallback = false
    if(tool === tools.remove) {
        pointClickCallback = (g, p, i) => {
            actions.removePointFromGeometry(g.key, i)
        }
    }

    const frameDisplaySettings = {
        showPointLabels,
        setShowPointLabels: (val) => {
            setShowPointLabels(val)
            setStylingUpdated(true)
        } 
    }
    return (
        <div className='pattern-view' ref={ref}>
            <MouseToolIcon tool={tool} containerRef={ref} />
            <RefreshTree refreshKey={refreshViews}>
            {editorUIState.showSettings && (
                <ModelSettings pattern={pattern} model={model} frameDisplaySettings={frameDisplaySettings} />
            )}
            
            <Frame
                width={width}
                height={height}
                model={model}
                editable={true}
                showGridLines={true}
                fitInContainer={true}
                showZoomControls={true}
                showBounds={true}
                exportControls={!editorUIState.showSidebar}
                exportTypes={['svg', 'png', 'pdf']}
                fromParameters={updateFromParameters}
                modelHasUpdated={updateFromParameters}
                updateParameters={(updatedModel) => {
                    if(updateFromParameters === false) {
                        actions.updateGeometries(updatedModel.geometries)
                    }
                }}
                onClickCallback={(e) => {
                    if(tool === tools.add && selectedElement && isPoint(e)) {
                        actions.addPointToGeometry(e, selectedElement)
                    }
                }}
                onPointClickCallback={pointClickCallback}
                />
            <ToolsPanel tool={tool} setTool={setTool} />
            {selectedElement === false && tool === tools.add && (
                <div className='message-pop-up'>
                <Message size='tiny' warning>Select a geometry to add points.</Message>
                </div>
            )}
            </RefreshTree>
        </div>
    )
}

export default PatternView