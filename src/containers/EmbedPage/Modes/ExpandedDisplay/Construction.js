import React, { useMemo } from 'react'
import {
    Frame, Model, Group, Path
} from '@dp50mm/hyperobjects-language'
import _ from 'lodash'
import { generateProcedures } from 'components/PatternEditor/procedures'
import { resetGeometriesStyle } from 'components/PatternEditor/Views/PatternView/modelStyling'
import { types } from 'components/PatternEditor/procedures/types'


const stylingSettings = {
    showPointLabels: false
}

const constructionProcedureTypes = [
    types.interpolationLine.type,
    types.mirrorShape.type
]


const Construction = ({
    model,
    pattern,
    modelData,
    inputs,
    setInputs
}) => {
    const procedures = modelData._procedures.filter(p => !_.get(p.procedure, 'linkTo', false))
                        .filter(p => constructionProcedureTypes.includes(p.procedure.type))
    model.inputs = inputs
    const procedureOutput = procedures.map((procedure, i) => {
        const pos = {
            x: _.get(procedure, 'constructionPosition.x', 100),
            y: _.get(procedure, 'constructionPosition.y', 100 + i * 50)
        }
        const linkedProcedures = modelData._procedures.filter(p => _.get(p.procedure, 'linkTo', false) === procedure.name)
        var geometries = model.procedures[procedure.name](model)
        if(!_.isArray(geometries)) {
            geometries = [geometries]
        }
        linkedProcedures.forEach(linkedProcedure => {
            geometries = geometries.concat(
                model.procedures[linkedProcedure.name](model)
            )
        })
        return {
            key: procedure.name,
            position: pos,
            geometries: geometries
        }
    })
    const construction = _.get(modelData, 'construction', [])
    var constructionModel = useMemo(() => {
        var _constructionModel = new Model(`${pattern.name} construction`)
        _constructionModel.inputs = inputs
        _constructionModel.inputsList = model.inputsList
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
            })).visible(false)
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
    const height = window.innerHeight - 3
    return (
        <Frame
            model={constructionModel}
            width={width}
            height={height}
            fitInContainer={true}
            maintainAspectRatio={true}
            showBounds={true}
            showGridLines={true}
            showZoomControls={true}
            exportControls={true}
            updateParameters={(newParams) => {
                setInputs(newParams.inputs)
            }}
            exportTypes={['svg', 'png', 'pdf']}
            />
    )
}

export default Construction