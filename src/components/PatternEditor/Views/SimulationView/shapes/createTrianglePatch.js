import TrianglePatch from './TrianglePatch'
import {
    Mesh
} from 'ogl'
import colorData from '../utils/colorData'
import alphaData from '../utils/alphaData'
import chroma from 'chroma-js'

function createTrianglePatch(gl, shape, scene, program) {
    console.log(shape)
    const rgb = chroma(shape.color)._rgb
    console.log(rgb)
    let geometry = new TrianglePatch(gl, shape.springModel.triangles)
    geometry.addAttribute('color', {
        size: 3, data: colorData(geometry, [rgb[0]/255, rgb[1]/255, rgb[2]/255])
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