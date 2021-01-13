import React, { useContext, useMemo, useRef, useState, useEffect } from 'react'
import { EditorContext } from '../../PatternEditor'
import { generateProcedures } from '../../procedures'
import {
    Model,
    Path
} from '@dp50mm/hyperobjects-language'
import _ from 'lodash'
import {
    start,
    stop,
    startSimulation,
    pauseSimulation,
    simulating,
    windowResize,
    updateGeometries,
    resetMomentum,
    updateCameraAnimation
} from './renderer'
import SimulationSettings from 'components/SimulationSettings'
import './simulation-view.scss'
import { types } from 'components/PatternEditor/procedures/types'

function simulatedProcedures(p) {
    return _.get(p, 'procedure.output_type', false) === Path.type && _.get(p, 'procedure.simulate', false)
}

function windowSize() {
    return {
        width: window.innerWidth,
        height: window.innerHeight - 45
    }
}

const SimulationView = () => {
    const containerRef = useRef(null)
    const [initialized, setInitialized] = useState(false)
    const [currentRenderedUpdate, setCurrentRenderedUpdate] = useState(0)
    const [simUpdateCounter, setSimUpdateCounter] = useState(0)
    const [animateCamera, setAnimateCamera] = useState(false)
    const [cameraAnimationSpeed, setCameraAnimationSpeed] = useState(1)
    const [particleStepSize, setParticleStepSize] = useState(35)
    const { pattern, modelData, modelUpdateCounter, editorUIState } = useContext(EditorContext)
    
    var generatedModel = _.cloneDeep(modelData)
    generatedModel.procedures = generateProcedures(_.get(modelData, '_procedures'), [])

    var model = useMemo(() => {
        return new Model(pattern.name)
    }, [pattern])
    
    model.importModel(generatedModel)
    

    useEffect(() => {
        console.log(initialized, containerRef.current)
        if(initialized === false && containerRef.current !== null && windowSize().width > 0) {
            setInitialized(true)
            let shapes = _.get(modelData, '_procedures', []).filter(simulatedProcedures)
            let seams = _.get(modelData, '_procedures', []).filter(p => p.procedure.type === types.seam.type)
            start(containerRef.current, windowSize(), model, shapes, seams, particleStepSize)
        }
        if(currentRenderedUpdate !== modelUpdateCounter) {
            setCurrentRenderedUpdate(modelUpdateCounter)
            let shapes = _.get(modelData, '_procedures', []).filter(simulatedProcedures)
            let seams = _.get(modelData, '_procedures', []).filter(p => p.procedure.type === types.seam.type)
            updateGeometries(model, shapes, seams, particleStepSize)
        }
        
    }, [initialized, model, currentRenderedUpdate, modelUpdateCounter, modelData])

    // pure dismount effect
    useEffect(() => {
        return () => {
            stop()
        }
    }, [])
    
    useEffect(() => {
        let listener = window.addEventListener('resize', () => windowResize(windowSize()), false)
        return () => window.removeEventListener('resize', listener)
    })

    const simulation = {
        simulating: simulating,
        play: () => { setSimUpdateCounter(simUpdateCounter + 1); startSimulation() },
        pause: () => { setSimUpdateCounter(simUpdateCounter + 1); pauseSimulation() },
        resetMomentum: () => { setSimUpdateCounter(simUpdateCounter + 1); resetMomentum() },
        animateCamera: animateCamera,
        setAnimateCamera: (value) => { setAnimateCamera(value); updateCameraAnimation(value * cameraAnimationSpeed); },
        cameraAnimationSpeed: cameraAnimationSpeed,
        setCameraAnimationSpeed: (newSpeed) => {
            setCameraAnimationSpeed(newSpeed)
            if(animateCamera) {
                updateCameraAnimation(animateCamera * newSpeed)
            }
        },
        particleStepSize: particleStepSize,
        updateParticleStepSize: (newStepSize) => {
            console.log('update step size', newStepSize)
            setParticleStepSize(newStepSize);
            
            stop()
            var containerNode = document.getElementById('simulation-canvas-container')
            containerNode.innerHTML = ''
            setTimeout(() => {
                setInitialized(false)
            }, 10)
            
        }
    }
    return (
        <div className='simulation-view'>
            {editorUIState.showSettings && (
                <SimulationSettings simulation={simulation} />
            )}
            <div className='canvas-container' ref={containerRef} id="simulation-canvas-container">
            </div>
        </div>
    )
}

export default SimulationView