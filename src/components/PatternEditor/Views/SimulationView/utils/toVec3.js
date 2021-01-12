import {
    Vec3
} from 'ogl'
import _ from 'lodash'
function toVec3(p) {
    return new Vec3(
        _.get(p, 'x', 0),
        _.get(p, 'y', 0),
        _.get(p, 'z', 0)
    )
}

export default toVec3