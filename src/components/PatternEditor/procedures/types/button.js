import { names } from './names'
import {
    Path,
    Circle,
    Text
} from '@dp50mm/hyperobjects-language'
import _ from 'lodash'

function buttonJsonDescription() {
    return {
        geometry: false,
        input: false,
        output_type: Path.type,
        gender: false,
        genderTypes: {male: 'male', female: 'female'},
        name: 'name',
        type: names.BUTTON,
        showLabel: true,
        labelDirection: 'left',
        labelDistance: 100,
        radius: 50
    }
}

function buttonGenerator(jsonDescription, name) {
    return (self) => {
        if(jsonDescription.geometry === false) {
            return []
        }
        if(jsonDescription.input === false) {
            return []
        }
        const interpolateValue = _.get(self.inputs[jsonDescription.input], 'value', 0)
        var point = self.geometries[jsonDescription.geometry].interpolate(interpolateValue)
        var returnGeometries = []

        const color = 'rgb(100,100,100)'

        returnGeometries.push(
            new Circle(point, jsonDescription.radius, 30)
                .strokeWidth(4)
                .stroke(color)
                .fill('white')
                .fillOpacity(1)
            
        )
        if(jsonDescription.gender === 'female') {
            returnGeometries[0].fill(color)
            returnGeometries.push(
                new Circle(point, jsonDescription.radius * 0.5, 30)
                    .strokeWidth(0)
                    .strokeOpacity(0)
                    .fill('white')
                    .fillOpacity(1)
                    
            )
            
        } else if(jsonDescription.gender === 'male') {
            returnGeometries.push(
                new Circle(point, jsonDescription.radius * 0.5, 30)
                    .strokeWidth(0)
                    .strokeOpacity(0)
                    .fill(color)
                    .fillOpacity(1)
                    
            )
        }

        if(jsonDescription.showLabel) {
            var labelText = 'Button '
            var x = point.x
            var underlineX = x
            var textAnchor = 'end'
            var edgeX = point.x
            const underlineExtent = 20
            if(_.get(jsonDescription, 'labelDirection', 'left') === 'left') {
                x -= (jsonDescription.radius + _.get(jsonDescription, 'labelDistance', 10))
                edgeX -= jsonDescription.radius
                underlineX = x - underlineExtent
            } else {
                x += (jsonDescription.radius + _.get(jsonDescription, 'labelDistance', 10))
                textAnchor = "start"
                edgeX += jsonDescription.radius
                underlineX = x + underlineExtent
            }
            if(jsonDescription.gender) labelText += `(${jsonDescription.gender})`
            returnGeometries.push(
                new Text(
                    labelText,
                    {x: x, y: point.y - 1}
                ).textAnchor(textAnchor).fontSize(20).fill('rgb(100, 100, 100)')
            )
            returnGeometries.push(
                new Path(
                    [{x: underlineX, y: point.y
                        },
                        {
                        x: edgeX,
                        y: point.y
                    }]
                ).stroke('rgb(100, 100, 100)')
            )
        }

        return returnGeometries
    }
}

var button = {
    generator: buttonGenerator,
    json: buttonJsonDescription,
    type: names.BUTTON
}

export default button