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
                .strokeWidth(2)
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
            var y = point.y
            var underlineX = x
            var underlineY = point.y

            var textAnchor = 'end'
            var edgeX = point.x
            var edgeY = point.y


            const underlineExtent = 20
            const labelDirection = _.get(jsonDescription, 'labelDirection', 'left')
            if(labelDirection === 'left') {
                x -= (jsonDescription.radius + _.get(jsonDescription, 'labelDistance', 10))
                edgeX -= jsonDescription.radius
                underlineX = x - underlineExtent

            } else if(labelDirection === 'right') {
                x += (jsonDescription.radius + _.get(jsonDescription, 'labelDistance', 10))
                textAnchor = "start"
                edgeX += jsonDescription.radius
                underlineX = x + underlineExtent

            } else if(labelDirection === 'top') {
                y -= (jsonDescription.radius + _.get(jsonDescription, 'labelDistance', 10))
                edgeY -= jsonDescription.radius
                underlineY = y - 2
                textAnchor = 'start'

            } else if(labelDirection === 'bottom') {
                y += (jsonDescription.radius + _.get(jsonDescription, 'labelDistance', 10)) + 20
                edgeY += jsonDescription.radius
                underlineY = y - 15
                textAnchor = 'start'
            }
            if(jsonDescription.gender) labelText += `(${jsonDescription.gender})`
            returnGeometries.push(
                new Text(
                    labelText,
                    {x: x, y: y - 2}
                ).textAnchor(textAnchor).fontSize(20).fill('rgb(100, 100, 100)')
            )
            returnGeometries.push(
                new Path(
                    [{x: underlineX, y: underlineY
                        },
                        {
                        x: edgeX,
                        y: edgeY
                    }]
                ).stroke('rgb(150, 150, 150)').strokeWidth(1)
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