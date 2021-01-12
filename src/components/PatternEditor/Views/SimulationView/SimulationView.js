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
    animating,
    windowResize,
    updateGeometries
} from './renderer'


function simulatedProcedures(p) {
    return _.get(p, 'procedure.output_type', false) === Path.type && _.get(p, 'procedure.simulate', false)
}

const SimulationView = () => {
    const containerRef = useRef(null)
    const [initialized, setInitialized] = useState(false)
    const [currentRenderedUpdate, setCurrentRenderedUpdate] = useState(0)
    const { pattern, modelData, modelUpdateCounter } = useContext(EditorContext)
    
    var generatedModel = _.cloneDeep(modelData)
    generatedModel.procedures = generateProcedures(_.get(modelData, '_procedures'), [])

    var model = useMemo(() => {
        return new Model(pattern.name)
    }, [pattern])
    
    model.importModel(generatedModel)
    const size = {
        width: window.innerWidth,
        height: window.innerHeight - 45
    }

    useEffect(() => {
        if(initialized === false && containerRef.current !== null && size.width > 0) {
            setInitialized(true)
            let shapes = _.get(modelData, '_procedures', []).filter(simulatedProcedures)
            start(containerRef.current, size, model, shapes)
        }
        if(currentRenderedUpdate !== modelUpdateCounter) {
            setCurrentRenderedUpdate(modelUpdateCounter)
            let shapes = _.get(modelData, '_procedures', []).filter(simulatedProcedures)
            updateGeometries(model, shapes)
        }
    })
    return (
        <div className='simulation-view' ref={containerRef}>
        </div>
    )
}

export default SimulationView