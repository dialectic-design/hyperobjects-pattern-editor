import { names } from './names'
import { Path } from '@dp50mm/hyperobjects-language'

function copyTransformJsonDescription() {
    return {
        copy: false,
        transforms: [],
        type: names.COPY_TRANSFORM,
        output_type: Path.type
    }
}

function copyTransform(jsonDescription) {
    return (self) => {
        if(jsonDescription.copy === false) return []
        if(jsonDescription.copy.type === 'geometry') {
            return self.geometries[jsonDescription.copy.key].clone()
                .translate({x: 100, y: 0}).fill('red')
        } else if(jsonDescription.copy.type === 'procedure') {
            return self.procedures[jsonDescription.copy.key](self).clone()
                .scale({x: -1, y: 1}, {x: 500, y: 500})
        }
        return []
    }
}

export default {
    generator: copyTransform,
    json: copyTransformJsonDescription,
    type: names.COPY_TRANSFORM
}