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
import ConstructionSettings from './ConstructionSettings'
import RefreshTree from 'components/RefreshTree'
import { types } from 'components/PatternEditor/procedures/types'

import _ from 'lodash'
import './construction-view.scss'

export const tools = {
    move: 'move',
    place: 'place'
}

const stylingSettings = {
    showPointLabels: false
}

const constructionProcedureTypes = [
    types.interpolationLine.type,
    types.mirrorShape.type
]


const ConstructionView = () => {
    const {
        pattern,
        modelData,
        refreshViews,
        editorUIState,
        actions
    } = useContext(EditorContext)
    const construction = _.get(modelData, 'construction', [])
    var patternModel = useMemo(() => {
        var generatedModel = resetGeometriesStyle(modelData, stylingSettings)
        generatedModel.procedures = generateProcedures(_.get(modelData, '_procedures'), [])

        var _model = new Model(pattern.name)
        _model.importModel(generatedModel)
        return _model
    }, [pattern])
    const procedures = modelData._procedures.filter(p => !_.get(p.procedure, 'linkTo', false))
                        .filter(p => constructionProcedureTypes.includes(p.procedure.type))
                        
    const procedureOutput = procedures.map((procedure, i) => {
        const pos = {
            x: _.get(procedure, 'constructionPosition.x', 100),
            y: _.get(procedure, 'constructionPosition.y', 100 + i * 50)
        }
        const linkedProcedures = modelData._procedures.filter(p => _.get(p.procedure, 'linkTo', false) === procedure.name)
        var geometries = patternModel.procedures[procedure.name](patternModel)
        if(!_.isArray(geometries)) {
            geometries = [geometries]
        }
        linkedProcedures.forEach(linkedProcedure => {
            geometries = geometries.concat(
                patternModel.procedures[linkedProcedure.name](patternModel)
            )
        })
        return {
            key: procedure.name,
            position: pos,
            geometries: geometries
        }
    })

    var constructionModel = useMemo(() => {
        var _constructionModel = new Model(`${pattern.name}-construction`)
        _constructionModel.setSize({
            width: _.get(construction, 'size.width', 1000),
            height: _.get(construction, 'size.height', 1000)
        })
        _constructionModel.addEditableGeometry(
            "elements-positioning",
            new Group(procedureOutput.map((element, i) => {
                return {
                    x: element.position.x,
                    y: element.position.y,
                    label: element.key
                }
            }))
        )
        procedureOutput.forEach((element, i) => {
            _constructionModel.addProcedure(
                element.key,
                (self) => {
                    var p = self.geometries['elements-positioning'].points[i]
                    const geometries = element.geometries
                    const bounds = geometries.filter(g => g.type === Path.type).map(g => g.getBounds())
                    const min = {
                        x: _.min(bounds.map(b => b.p1.x)),
                        y: _.min(bounds.map(b => b.p1.y))
                    }
                    return geometries.map(g => {
                        return g.clone().translate({x: -min.x, y: -min.y}).translate(p)
                    })
                }
            )
        })

        return _constructionModel
    })
    const width = _.max([window.innerWidth, 100])
    const height = window.innerHeight - 45
    return (
        <div className='construction-view'>
            <RefreshTree refreshKey={refreshViews}>
            {editorUIState.showSettings && (
                <ConstructionSettings model={constructionModel} />
            )}
            <Frame
                width={width}
                height={height}
                model={constructionModel}
                editable={true}
                showGridLines={true}
                fitInContainer={true}
                showZoomControls={true}
                showBounds={true}
                updateParameters={(updatedModel) => {
                    const updatedPositions = updatedModel.geometries['elements-positioning'].points
                    actions.updateProcedures(
                        modelData._procedures.map((procedure, i) => {
                            var posPoint = _.find(updatedPositions, p => p.label === procedure.name)
                            var pos = false
                            if(posPoint !== undefined) {
                                pos = {
                                    x: posPoint.x,
                                    y: posPoint.y
                                }
                            }
                            if(pos) {
                                return {
                                    ...procedure,
                                    constructionPosition: pos
                                }
                            }
                            return procedure
                        })
                    )
                }}
                />
            </RefreshTree>
        </div>
    )
}

export default ConstructionView