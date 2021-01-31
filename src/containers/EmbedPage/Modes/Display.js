import React, { useRef } from 'react'
import {
    Frame
} from '@dp50mm/hyperobjects-language'
import useComponentSize from '@rehooks/component-size'
import _ from 'lodash'

const PatternDisplay = ({ model }) => {
    const ref = useRef(null)
    const size = useComponentSize(ref)
    const width = _.max([size.width, 100])
    const height = window.innerHeight - 3

    return (
        <div ref={ref} className='pattern-display'>
            <Frame
                model={model}
                width={width}
                height={height}
                fitInContainer={true}
                maintainAspectRatio={true}
                showBounds={true}
                showGridLines={true}
                showZoomControls={true}
                exportControls={true}
                exportTypes={['svg', 'png', 'pdf']}
                />
        </div>
    )
}

export default PatternDisplay