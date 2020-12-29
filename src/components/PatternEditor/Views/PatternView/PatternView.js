import React, { useContext } from 'react'
import {
    Frame,
    Model
} from '@dp50mm/hyperobjects-language'
import '@dp50mm/hyperobjects-language/dist/index.css'
import { generateProcedures } from '../../procedures'
import _ from 'lodash'
import { EditorContext } from '../../PatternEditor'
import RefreshTree from 'components/RefreshTree'

const PatternView = ({modelUpdateCounter}) => {
    const { pattern, modelData, actions, refreshViews } = useContext(EditorContext)
    var generatedModel = modelData

    generatedModel.procedures = generateProcedures(modelData._procedures)
    var model = new Model(pattern.name)
    model.importModel(generatedModel)
    const width = _.max([window.innerWidth, 100])
    const height = window.innerHeight - 45
    return (
        <div className='pattern-view'>
            <RefreshTree key={refreshViews}>
            <Frame
                width={width}
                height={height}
                model={model}
                editable={true}
                showGridLines={true}
                fitInContainer={true}
                showZoomControls={true}
                showBounds={true}
                updateParameters={(updatedModel) => {
                    actions.updateGeometries(updatedModel.geometries)
                }}
                />
            </RefreshTree>
        </div>
    )
}

export default PatternView