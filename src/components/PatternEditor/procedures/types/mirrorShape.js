import { names } from './names'
import _ from 'lodash'
import { Path } from '@dp50mm/hyperobjects-language'

const mirrorPointModelCenter = 'model-center'
const mirrorPointShapeCenter = 'shape-center'
export const mirrorPointSelectedPoint = 'selected-point'

export const mirrorPointTypes = [
    mirrorPointModelCenter,
    mirrorPointShapeCenter,
    mirrorPointSelectedPoint
]

export const mirrorAxes = {
    x: "x",
    y: 'y'
}

function mirrorShapeJsonDescription() {
    return {
        source: false,
        mirrorAxis: mirrorAxes.x,
        mirrorOn: 500,
        transforms: [],
        simulation: {
            position: {x: 0, y: 0, z: 0},
            rotation: {x: 0, y: 0, z: 0}
        },
        simulate: true,
        output_type: Path.type,
        type: names.MIRROR_SHAPE,
        mirrorPointType: mirrorPointModelCenter,
        mirrorPoint: false,
        alignment: 'left', // alignment when mirror point type is selected point
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
        const includedElements = [
            '--patch-outline',
            '--grainline',
            '--button-outline'
        ]
        var paths = []
        if(_.isArray(functionToMirror)) {
            if(functionToMirror.length === 0) {
                return []
            }
            paths = functionToMirror.filter(p => p.type === Path.type)
        } else {
            paths = [functionToMirror]
        }
        paths = paths.filter(p => {
            return includedElements.some(endText => _.get(p, 'text', '').endsWith(endText))
        })
        const color = _.get(jsonDescription, 'color', "#DEF0F1")
        
        var mirrorPoint = paths[0].center()
        var newPaths = paths.map(path => {
            var newPath = new Path(path.points.map(p => {
                return {
                    x: _.get(p, 'x', 0),
                    y: _.get(p, 'y', 0),
                    c: _.get(p, 'c', false),
                    q: _.get(p, 'q', false)
                }
            })).scale({x: -1, y: 1}, mirrorPoint)
            .reverse()
            .translate({
                x: parseFloat(_.get(jsonDescription, 'mirrorOn', '100')),
                y: 0
            }).copyStyle(path)
            .closed(path.closedPath)
            .fill(color)
            .setShowSegmentLengthLabels(path.showSegmentLengthLabels)
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