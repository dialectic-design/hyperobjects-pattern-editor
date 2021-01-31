import { names } from './names'
import _ from 'lodash'
import { Path } from '@dp50mm/hyperobjects-language'
import { p } from '@dialectic-design/hyperobjects-entity-context'
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
        var paths = []
        if(_.isArray(functionToMirror)) {
            if(functionToMirror.length === 0) {
                return []
            }
            paths = functionToMirror.filter(p => p.type === Path.type)
        } else {
            paths = [functionToMirror]
        }
        const color = _.get(jsonDescription, 'color', "#DEF0F1")
        var mirrorPoint = paths[0].center()
        var newPaths = paths.map(path => {
            var newPath = new Path(path.points.map(p => {
                return _.cloneDeep(p)
            })).scale({x: -1, y: 1}, mirrorPoint)
            .reverse()
            .translate({
                x: parseFloat(_.get(jsonDescription, 'mirrorOn', '100')),
                y: 0
            }).copyStyle(path)
            .closed(path.closedPath)
            .fill(color)
            .setShowSegmentLengthLabels(true)
            .export(true)

            newPath.text = `mirror-${_.get(path, 'text', '')}`
            return newPath
        })
        return newPaths
            
    }
}

var procedure = {
    generator: mirrorShape,
    json: mirrorShapeJsonDescription,
    type: names.MIRROR_SHAPE
}

export default procedure