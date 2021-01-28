import { EditorContext } from 'components/PatternEditor/PatternEditor'
import React, { useContext, useMemo } from 'react'
import {
    Frame,
    Group,
    Model
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

const ConstructionView = () => {
    const { pattern, modelData } = useContext(EditorContext)
    const construction = _.get(pattern, 'construction.elements', [])
    var patternModel = useMemo(() => {
        var generatedModel = resetGeometriesStyle(modelData, stylingSettings)
        generatedModel.procedures = generateProcedures(_.get(modelData, '_procedures'), [])

        var _model = new Model(pattern.name)
        _model.importModel(generatedModel)
        return _model
    }, [pattern])
    console.log(patternModel)
    const elements = patternModel.proceduresList
    const procedureOutput = patternModel.proceduresList.map(key => {
        return {
            key,
            geometries: patternModel.procedures[key](patternModel)
        }
    })
    console.log(procedureOutput)
    var constructionModel = useMemo(() => {
        var _constructionModel = new Model(`${pattern.name}-construction`)
        _constructionModel.addEditableGeometry(
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
            _constructionModel.addProcedure(
                element.key,
                (self) => {
                    var p = self.geometries['elements-positioning'].points[i]
                    return element.geometries.map(g => {
                        return g.clone().translate(p)
                    })
                }
            )
        })

        return _constructionModel
    })
    const width = _.max([window.innerWidth, 100])
    const height = window.innerHeight - 45
    return (
        <div className='layout-view'>
            <Frame
                width={width}
                height={height}
                model={constructionModel}
                editable={true}
                showGridLines={true}
                fitInContainer={true}
                showZoomControls={true}
                showBounds={true}
                />
        </div>
    )
}

export default ConstructionView