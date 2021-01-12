import _ from 'lodash'
import TrianglePatch from './TrianglePatch'
import {
    Mesh,
    Vec3
} from 'ogl'
import colorData from '../utils/colorData'
import alphaData from '../utils/alphaData'

function createTrianglePatch(gl, shape, scene, program) {
    const position = convertToNr(_.cloneDeep(shape.position))
    const rotation = convertToNr(_.cloneDeep(shape.rotation))

    let geometry = new TrianglePatch(gl, shape.springModel.triangles)
    geometry.addAttribute('color', {
        size: 3, data: colorData(geometry, [0.2, 0.2, 0.2])
    })
    geometry.addAttribute('alpha', {
        size: 3,
        data: alphaData(geometry, 0.9)
    })
    let mesh = new Mesh(gl, {
        mode: gl.TRIANGLES,
        geometry: geometry,
        program
    })
    let meshPos = new Vec3(position.x, position.y, position.z)
    mesh.position.set(meshPos)
    mesh.quaternion.rotateX(_.get(rotation, 'x', 0) / 360 * Math.PI * 2)
    mesh.quaternion.rotateY(_.get(rotation, 'y', 0) / 360 * Math.PI * 2)
    mesh.quaternion.rotateZ(_.get(rotation, 'z', 0) / 360 * Math.PI * 2)

    mesh.type = 'patch-triangles'
    mesh._name = shape.name + "_triangles"
    mesh.setParent(scene)
}

function convertToNr(p) {
    p.x = _.toNumber(p.x)
    p.y = _.toNumber(p.y)
    p.z = _.toNumber(p.z)
    return p
}

export default createTrianglePatch