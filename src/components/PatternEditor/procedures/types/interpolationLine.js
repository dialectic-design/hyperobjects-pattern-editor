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
        grainline: false,
        simulation: {
            position: {x: 0, y: 0, z: 0},
            rotation: {x: 0, y: 0, z: 0},
            reversePathOverride: false
        },
        folds: [],
        modifications: [],
        cutouts: [],
        color: '#DEF0F1',
        stroke: 'black',
        strokeDasharray: false
    }
}

const controlPointDashArray = 3

function interpolationLine(jsonDescription, name) {
    return (self) => {
        let returnGeometries = []
        let prevPoint = false
        if(jsonDescription.geometries.length === 0) {
            return []
        }
        const color = _.get(jsonDescription, 'color', "#DEF0F1")
        const stroke = _.get(jsonDescription, 'stroke', 'black')
        const dashArray = _.get(jsonDescription, 'strokeDasharray', false)
        console.log(dashArray)
        let path = new Path(jsonDescription.geometries.map(geometry => {
            const interpolateValue = _.get(self.inputs[jsonDescription.input], 'value', 0)
            let p = new Point(self.geometries[geometry.path].interpolate(interpolateValue))
            let c1 = _.get(geometry, 'curvePoint1', false)
            let c2 = _.get(geometry, 'curvePoint2', false)
            if(c1 && c2 === false) {
                let q = self.geometries[c1].interpolate(interpolateValue)
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
                    _.cloneDeep(self.geometries[c1].interpolate(interpolateValue)),
                    _.cloneDeep(self.geometries[c2].interpolate(interpolateValue))
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
            .fill(color)
            .stroke(stroke)
            .fillOpacity(0.9)
            .setShowSegmentLengthLabels(true)
        
        if(dashArray) {
            path.strokeDasharray(dashArray)
        }

        /**
         * Add grainline if set
         */

        var grainlineKey = _.get(jsonDescription, 'grainline', false)
        if(grainlineKey) {
            var grainlinePath = _.get(self.geometries, grainlineKey, false)
            if(grainlinePath) {
                grainlinePath = grainlinePath.clone().strokeWidth(2).stroke('black').strokeOpacity(0.5)
                var endArrow = new Path([
                    {x: 0, y: 0},
                    {x: -5, y: -10},
                    {x: 5, y: -10}
                    ]).fill('black').closed(true)
                    .rotate(grainlinePath.angleAt(0.5) + Math.PI * 0.5)
                    .translate(grainlinePath.endPoint())
                
                const grainlineCenter = grainlinePath.center()

                var grainlineText = new Text(
                    "grainline",
                    {x: grainlineCenter.x + 4, y: grainlineCenter.y}
                ).fontSize(15)
                .fill('rgb(100,100,100)')
                .stroke('black')
                .strokeWidth(1)
                .fontWeight(400)


                returnGeometries.push(grainlinePath)
                returnGeometries.push(endArrow)
                returnGeometries.push(grainlineText)

            }
        }


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
            .textAnchor("center"))
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