import {
    Box,
    Mesh
} from 'ogl'
import colorData from './colorData'
import alphaData from './alphaData'

function workBox(gl, program, scene, model) {

    const boxGeometry = new Box(gl, {
        width: model.size.width,
        height: model.size.height,
        depth: model.size.width
    })
    boxGeometry.addAttribute('color', {
        size: 3, data: colorData(boxGeometry, [0.6, 0.6, 0.6]),
    })
    boxGeometry.addAttribute('alpha', {
        size: 1,
        type: gl.FLOAT,
        data: alphaData(boxGeometry, 0.2)
    })

    let boxMesh = new Mesh(gl, {
        mode: gl.LINE_STRIP,
        geometry: boxGeometry,
        program: program
    })
    boxMesh.setParent(scene)
}

export default workBox