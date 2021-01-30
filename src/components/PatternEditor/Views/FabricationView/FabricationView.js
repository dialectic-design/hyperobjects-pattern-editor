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
import FabricationSettings from './FabricationSettings'
import './fabrication-view.scss'
import _ from 'lodash'
import RefreshTree from 'components/RefreshTree'

export const tools = {
    move: 'move',
    place: 'place'
}

const stylingSettings = {
    showPointLabels: false
}

const FabricationView = () => {
    const {
        pattern,
        modelData,
        actions,
        editorUIState,
        refreshViews
    } = useContext(EditorContext)
    const fabrication = _.get(modelData, 'fabrication', {})

    var patternModel = useMemo(() => {
        var generatedModel = resetGeometriesStyle(modelData, stylingSettings)
        generatedModel.procedures = generateProcedures(_.get(modelData, '_procedures'), [])

        var _model = new Model(pattern.name)
        _model.importModel(generatedModel)
        return _model
    }, [pattern, modelData])

    const procedures = modelData._procedures.filter(p => !_.get(p.procedure, 'linkTo', false))
    const procedureOutput = procedures.map((procedure, i) => {
        const pos = {
            x: _.get(procedure, 'fabricationPosition.x', 100),
            y: _.get(procedure, 'fabricationPosition.y', 100 + i * 50)
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
    var fabricationModel = useMemo(() => {
        var _fabricationModel = new Model(`${pattern.name}-construction`)
        _fabricationModel.setSize({
            width: _.get(fabrication, 'size.width', 1000),
            height: _.get(fabrication, 'size.height', 1000)
        })
        _fabricationModel.addEditableGeometry(
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
                            .rotate(-rotation)
                            .translate(p)
                    })
                }
            )
        })

        return _fabricationModel
    }, [pattern])
    const width = _.max([window.innerWidth, 100])
    const height = window.innerHeight - 45

    return (
        <div className='fabrication-view'>
            <RefreshTree refreshKey={refreshViews}>
            {editorUIState.showSettings && (
                <FabricationSettings model={fabricationModel} />
            )}
            <Frame
                width={width}
                height={height}
                model={fabricationModel}
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
                                    fabricationPosition: pos
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

export default FabricationView