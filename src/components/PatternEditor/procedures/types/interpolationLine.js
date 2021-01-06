import { names } from './names'
import { Path, Text, Point } from "@dp50mm/hyperobjects-language"
import _ from 'lodash'


const BUTTON_MODIFICATION = 'button'
const BUTTON_HOLE_MODIFICATION = 'button_hole'
const FOLD_MODIFICATION = 'fold'

export const modificationTypes = {
    button: BUTTON_MODIFICATION,
    buttonHole: BUTTON_HOLE_MODIFICATION,
    fold: FOLD_MODIFICATION
}


function interpolationLineJsonDescription() {
    return {
        geometries: [], // [{path: ..., curvePoint: ...}]
        input: false,
        output_type: Path.type,
        closed: false,
        type: names.INTERPOLATION_LINE,
        name: 'name',
        showName: true,
        offset: false,
        simulate: true,
        simulation: {
            position: {x: 0, y: 0, z: 0},
            rotation: {x: 0, y: 0, z: 0}
        },
        modifications: [],
        cutouts: []
    }
}

const controlPointDashArray = 3

function interpolationLine(jsonDescription, name) {
    return (self) => {
        let returnGeometries = []
        let prevPoint = false
        let path = new Path(jsonDescription.geometries.map(geometry => {
            let p = new Point(self.geometries[geometry.path].interpolate(self.inputs[jsonDescription.input].value))
            let c1 = _.get(geometry, 'curvePoint1', false)
            let c2 = _.get(geometry, 'curvePoint2', false)
            if(c1 && c2 === false) {
                let q = self.geometries[c1].interpolate(self.inputs[jsonDescription.input].value)
                p.q = {x: q.x, y: q.y}
                returnGeometries.push(new Path([
                    p,
                    p.q
                ]).strokeDasharray(controlPointDashArray)
                )
                
                if(prevPoint) {
                    returnGeometries.push(new Path([
                        prevPoint,
                        p.q
                    ]).strokeDasharray(controlPointDashArray)
                    )
                }
            } else if (c1 && c2) {
                p.c = [
                    self.geometries[c1].interpolate(self.inputs[jsonDescription.input].value),
                    self.geometries[c2].interpolate(self.inputs[jsonDescription.input].value)
                ]
                returnGeometries.push(new Path([
                    p,
                    p.c[1]
                ]).strokeDasharray(controlPointDashArray)
                )

                if(prevPoint) {
                    returnGeometries.push(new Path([
                        prevPoint,
                        p.c[0]
                    ]).strokeDasharray(controlPointDashArray)
                    )
                }
            }
            prevPoint = p
            return p
        })).closed(jsonDescription.closed)
            .strokeWidth(2)
            .fill('#DEF0F1')
            .fillOpacity(0.9)
            .setShowSegmentLengthLabels(true)
        
        path.showSegmentLengthLabels = true
        
        if(jsonDescription.showName) {
            returnGeometries.push(new Text(
                name,
                path.center(),
                "line-name"
            ).fontSize(30)
            .fill('rgb(100,100,100)')
            .stroke('black')
            .strokeWidth(1)
            .fontWeight(400)
            .textAnchor("middle"))
        }
        if(jsonDescription.offset) {
            let offsetPath = path.offset(-10)
            offsetPath.fill('transparent').stroke("grey")
            returnGeometries.push(offsetPath)
        }
        return [path].concat(returnGeometries)
    }
}

var procedure = {
    generator: interpolationLine,
    json: interpolationLineJsonDescription,
    type: names.INTERPOLATION_LINE
}

export default procedure