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
        type: names.MIRROR_SHAPE
    }
}

function mirrorShape(jsonDescription, name) {
    return (self) => {
        if(!_.has(self.procedures, jsonDescription.source.key)) {
            console.log('set source key for procedure: ', name)
            return []
        }
        let functionToMirror = self.procedures[jsonDescription.source.key](self)
        var path = false
        if(_.isArray(functionToMirror)) {
            path = functionToMirror[0]
        } else {
            path = functionToMirror
        }
        var newPath = new Path(path.points.map(p => {
            return _.cloneDeep(p)
        })).scale({x: -1, y: 1}, path.center())
        .translate({
            x: parseFloat(_.get(jsonDescription, 'mirrorOn', '100')),
            y: 0
        }).copyStyle(path)
        .closed(path.closedPath)
        return newPath
            
    }
}

export default {
    generator: mirrorShape,
    json: mirrorShapeJsonDescription,
    type: names.MIRROR_SHAPE
}
