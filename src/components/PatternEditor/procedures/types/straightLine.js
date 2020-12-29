import { Path } from '@dp50mm/hyperobjects-language'
import { names } from './names'

function straightLineJsonDescription(geometry, p_index, length, direction) {
    return {
        geometry: geometry,
        p_index: p_index,
        length: length,
        direction: direction,
        output_type: Path.type,
        type: names.STRAIGHT_LINE
    }
}

function straightLineProcedureGenerator(geometry, p_index, length, direction) {
    return (self) => {
        let p1 = self.geometries[geometry].points[p_index].clone()
        let p2 = p1.clone().translate({x: length, y: 0}).rotate(direction, p1)
        return new Path([p1, p2])
    }
}

export default {
    generator: straightLineProcedureGenerator,
    json: straightLineJsonDescription,
    type: names.STRAIGHT_LINE
}