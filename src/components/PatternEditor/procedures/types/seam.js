import { Path, Text } from '@dp50mm/hyperobjects-language'
import { names } from './names'
import _ from 'lodash'

function seamJsonDescription() {
    return {
        patch1: false,
        segment1Index: 0,
        patch2: false,
        segment2Index: 0,
        type: names.SEAM,
        springStrength: 0.5,
        flipDirection: false,
        alignment1: 'start',
        alignment2: 'start',
        output_type: false,
        hideLabelsInPatternView: false
    }
}

function seam(jsonDescription, name) {
    return (self) => {
        var patch1Key = _.get(jsonDescription, 'patch1', false)
        var patch2Key = _.get(jsonDescription, 'patch2', false)
        var segment1Index = _.get(jsonDescription, 'segment1Index', false)
        var segment2Index = _.get(jsonDescription, 'segment2Index', false)

        var returnGeometries = []
        if(_.get(jsonDescription, 'hideLabelsInPatternView', false)) {
            return returnGeometries
        }
        if(patch1Key) {
            if(_.isFunction(self.procedures[patch1Key])) {
                var path = self.procedures[patch1Key](self)
                if(_.isArray(path)) path = path[0]
                if (!_.isUndefined(path) && path.type === Path.type) {
                    var segments = path.segments()
                    var segment = _.get(segments, segment1Index, false)
                    if(segment) {
                        var seamHighlightPath = new Path([segment.p1, segment.p2]).strokeWidth(6).stroke('rgba(0,0,0,0.1)')
                        var segmentLabel = new Text(
                            `seam ${name} (1)`,
                            seamHighlightPath.center().translate({x: 0, y: -10})
                        ).textAnchor('center').fontSize(20).fillOpacity(0.5)
                        returnGeometries.push(seamHighlightPath)
                        returnGeometries.push(segmentLabel)
                    }
                }
            } else {
                console.log(patch1Key, ' is not a procedure function')
            }
        }
        if(patch2Key) {
            if(_.isFunction(self.procedures[patch2Key])) {
                var path2 = self.procedures[patch2Key](self)
                if(_.isArray(path2)) {
                    path2 = _.find(path2, p => p.type === Path.type)
                }
                if (!_.isUndefined(path2) && path2.type === Path.type) {
                    var segments2 = path2.segments()
                    var segment2 = _.get(segments2, segment2Index, false)
                    if(segment2) {
                        var seamHighlightPath2 = new Path([segment2.p1, segment2.p2]).strokeWidth(6).stroke('rgba(0,0,0,0.1)')
                        var segmentLabel2 = new Text(
                            `seam ${name} (2)`,
                            seamHighlightPath2.center().translate({x: 0, y: -10})

                        ).textAnchor('center').fontSize(20).fillOpacity(0.5)
                        returnGeometries.push(seamHighlightPath2)
                        returnGeometries.push(segmentLabel2)
                    }
                }
            } else {
                console.log(patch2Key, ' is not a procedure function')
            }
        }
        

        return returnGeometries
    }
}

var procedure = {
    generator: seam,
    json: seamJsonDescription,
    type: names.SEAM
}

export default procedure