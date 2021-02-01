import {
    Frame
} from "@dp50mm/hyperobjects-language"
import _ from 'lodash'

const Sizing = ({
    model,
    setInputs
}) => {
    const width = _.max([window.innerWidth, 100])
    const height = window.innerHeight - 3
    return (
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
            updateParameters={(newParams) => {
                setInputs(newParams.inputs)
            }}
            exportTypes={['svg', 'png', 'pdf']}
            />
    )
}

export default Sizing