import { names } from './names'
import _ from 'lodash'
import { Path } from '@dp50mm/hyperobjects-language'
function mirrorShapeJsonDescription() {
    return {
        source: false,
        mirrorAxis: 'x',
        mirrorOn: 500,
        transforms: [],
        simulation: {
            position: {x: 0, y: 0, z: 0},
            rotation: {x: 0, y: 0, z: 0}
        },
        simulate: true,
        output_type: Path.type,
        type: names.MIRROR_SHAPE,
        color: '#DEF0F1'
    }
}

function mirrorShape(jsonDescription, name) {
    if(name === _.get(jsonDescription, 'source.key', false)) {
        return () => {
            // console.log('procedure: ', name, 'cant mirror itself!')
            return []
        }
    }
    return (self) => {
        if(!_.has(self.procedures, jsonDescription.source.key)) {
            console.log('set source key for procedure: ', name)
            return []
        }
        let functionToMirror = self.procedures[jsonDescription.source.key](self)
        var path = false
        if(_.isArray(functionToMirror)) {
            if(functionToMirror.length === 0) {
                return []
            }
            path = functionToMirror[0]
        } else {
            path = functionToMirror
        }
        const color = _.get(jsonDescription, 'color', "#DEF0F1")
        var newPath = new Path(path.points.map(p => {
            return _.cloneDeep(p)
        })).scale({x: -1, y: 1}, path.center())
        .translate({
            x: parseFloat(_.get(jsonDescription, 'mirrorOn', '100')),
            y: 0
        }).copyStyle(path)
        .closed(path.closedPath)
        .fill(color)
        .setShowSegmentLengthLabels(true)
        return newPath
            
    }
}

var procedure = {
    generator: mirrorShape,
    json: mirrorShapeJsonDescription,
    type: names.MIRROR_SHAPE
}

export default procedure