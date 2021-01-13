import TrianglePatch from './TrianglePatch'
import {
    Mesh
} from 'ogl'
import colorData from '../utils/colorData'
import alphaData from '../utils/alphaData'

function createTrianglePatch(gl, shape, scene, program) {

    let geometry = new TrianglePatch(gl, shape.springModel.triangles)
    geometry.addAttribute('color', {
        size: 3, data: colorData(geometry, [0.2, 0.2, 0.3])
    })
    geometry.addAttribute('alpha', {
        size: 3,
        data: alphaData(geometry, 1)
    })
    let mesh = new Mesh(gl, {
        mode: gl.TRIANGLES,
        geometry: geometry,
        program
    })

    mesh.type = 'patch-triangles'
    mesh._name = shape.name + "_triangles"
    mesh.setParent(scene)
}



export default createTrianglePatch