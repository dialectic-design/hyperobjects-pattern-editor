import { EditorContext } from 'components/PatternEditor/PatternEditor'
import React, { useContext, useMemo } from 'react'
import {
    Frame,
    Group,
    Model,
    Path,
    Text
} from '@dp50mm/hyperobjects-language'
import { generateProcedures } from '../../procedures'
import { resetGeometriesStyle, setSelectedStyle, setHighlightedStyle, highlightLastPoint } from '../PatternView/modelStyling'

import _ from 'lodash'

export const tools = {
    move: 'move',
    place: 'place'
}

const stylingSettings = {
    showPointLabels: false
}

const FabricationView = () => {
    const { pattern, modelData } = useContext(EditorContext)
    const fabrication = _.get(pattern, 'fabrication', {})
    var patternModel = useMemo(() => {
        var generatedModel = resetGeometriesStyle(modelData, stylingSettings)
        generatedModel.procedures = generateProcedures(_.get(modelData, '_procedures'), [])

        var _model = new Model(pattern.name)
        _model.importModel(generatedModel)
        return _model
    }, [pattern])
    const elements = patternModel.proceduresList
    const procedureOutput = elements.map(key => {
        return {
            key,
            geometries: patternModel.procedures[key](patternModel)
        }
    })
    console.log(procedureOutput)
    var fabricationModel = useMemo(() => {
        var _fabricationModel = new Model(`${pattern.name}-construction`)
        _fabricationModel.addEditableGeometry(
            "elements-positioning",
            new Group(procedureOutput.map((element, i) => {
                return {
                    x: 100,
                    y: 100 + i * 50,
                    label: element.key
                }
            }))
        )
        procedureOutput.forEach((element, i) => {
            _fabricationModel.addProcedure(
                element.key,
                (self) => {
                    var p = self.geometries['elements-positioning'].points[i]
                    const geometries = element.geometries
                    var seamline = _.find(geometries, (g) => _.get(g, 'text', '').endsWith('--grainline'))
                    
                    var rotation = 0
                    if(!_.isUndefined(seamline)) {
                        rotation = seamline.angleAt(0.5)
                    }
                    const bounds = geometries.filter(g => g.type === Path.type).map(g => g.getBounds())
                    const min = {
                        x: _.min(bounds.map(b => b.p1.x)),
                        y: _.min(bounds.map(b => b.p1.y))
                    }
                    return element.geometries.map(g => {
                        return g.clone().translate({x: -min.x, y: -min.y})
                            .rotate(rotation)
                            .translate(p)
                    })
                }
            )
        })

        return _fabricationModel
    })
    const width = _.max([window.innerWidth, 100])
    const height = window.innerHeight - 45
    return (
        <div className='fabrication-view'>
            <p>Fabrication view</p>
            <Frame
                width={width}
                height={height}
                model={fabricationModel}
                editable={true}
                showGridLines={true}
                fitInContainer={true}
                showZoomControls={true}
                showBounds={true}
                />
        </div>
    )
}

export default FabricationView