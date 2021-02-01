import React, { useEffect, useMemo, useState } from 'react'
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

const Fabrication = ({
    model,
    pattern,
    modelData,
    inputs,
    setInputs
}) => {
    const [currentInputs, setCurrentInputs] = useState(false)
    const width = _.max([window.innerWidth, 100])
    const height = window.innerHeight - 3
    const fabrication = _.get(modelData, 'fabrication', {})
    const procedures = modelData._procedures.filter(p => !_.get(p.procedure, 'linkTo', false))
                        .filter(p => constructionProcedureTypes.includes(p.procedure.type))

    model.inputs = inputs
    const procedureOutput = procedures.map((procedure, i) => {
        const pos = {
            x: _.get(procedure, 'fabricationPosition.x', 100),
            y: _.get(procedure, 'fabricationPosition.y', 100 + i * 50)
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
            type: procedure.procedure.type,
            position: pos,
            geometries: geometries
        }
    })

    var fabricationModel = useMemo(() => {
        var _fabricationModel = new Model(`${pattern.name} fabrication`)
        _fabricationModel.inputs = inputs
        _fabricationModel.inputsList = model.inputsList

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
            })).visible(false)
        )
        procedureOutput.forEach((element, i) => {
            _fabricationModel.addProcedure(
                element.key,
                (self) => {
                    const includedElements = [
                        '--patch-outline',
                        '--grainline',
                        '--button-outline'
                    ]
                    var p = self.geometries['elements-positioning'].points[i]
                    var geometries = element.geometries.filter(p => {
                        return includedElements.some(endText => _.get(p, 'text', '').endsWith(endText))
                    })
                    var grainline = _.find(geometries, (g) => _.get(g, 'text', '').endsWith('--grainline'))
                    var rotation = 0
                    if(!_.isUndefined(grainline)) {
                        rotation = grainline.angleAt(0.5) + Math.PI * 0.5
                    }
                    if(element.type === types.mirrorShape.type) {
                        rotation += Math.PI
                    }
                    var geometries = geometries.map(g => {
                        return g.clone().rotate(-rotation)
                    })

                    const bounds = geometries.filter(g => g.type === Path.type).map(g => g.getBounds())
                    const min = {
                        x: _.min(bounds.map(b => b.p1.x)),
                        y: _.min(bounds.map(b => b.p1.y))
                    }
                    return geometries.map(g => {
                        return g.translate({x: -min.x, y: -min.y})
                            .translate(p)
                    })
                }
            )
        })

        return _fabricationModel
    }, [pattern, inputs])

    return (
        <Frame
            model={fabricationModel}
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

export default Fabrication