import {
    Renderer,
    Camera,
    Transform,
    Program,
    Orbit,
    Vec3
} from 'ogl'
import {
    vertex,
    fragment
} from './shader'
import workBox from './utils/workBox'
import generateGeometries from './generateGeometries'
import _ from "lodash"

let size = {width: 100, height: 100}

let renderer = new Renderer({ dpr: 2 })
let gl = renderer.gl
const bgShade = 1
gl.clearColor(bgShade, bgShade, bgShade, 1)

const camera = new Camera(gl, {
    fov: 45,
    far: 100000
})

camera.position.z = 1000
camera.position.y = 500
camera.lookAt(new Vec3(0))

let controls = false

const scene = new Transform()

const program = new Program(gl, {
    vertex,
    fragment,
    cullFace: null,
    transparent: true
})

let canvasCreated = false

export var animating = false

var physicsModel = false

export function start(canvasContainer, _size, model, shapes) {
    size = _size
    animating = true 

    if(!canvasCreated) {
        workBox(gl, program, scene, model)
        canvasCreated = true
        canvasContainer.appendChild(gl.canvas)
        controls = new Orbit(camera, {
            element: gl.canvas,
            target: new Vec3(0)
        })
        physicsModel = generateGeometries(gl, scene, program, model, shapes)
        resize()
        render()
    }
}
export function stop() {
    animating = false
    canvasCreated = false
    scene.children = []
    if(controls) {
        controls.remove()
    }
}


/**
 * Geometries
 */

export function updateGeometries(model, shapes) {
    console.log('update geometries: ', shapes)
    scene.children = []
    workBox(gl, program, scene, model)
    physicsModel = generateGeometries(gl, scene, program, model, shapes)
}


/**
 * Resizing & animation
 */
export function windowResize(_size) {
    size = _size
    resize()
}

function resize() {
    renderer.setSize(size.width, size.height)
    camera.perspective({
        aspect: size.width / size.height
    })
}

let frame = 0
var frameRate = 1/60 * 1000
// frameRate = 200
let newRenderCalled = false

function render() {
    frame += 1
    if(controls) {
        controls.update()
    }
    if(_.isArray(physicsModel) && true) {
        physicsModel.forEach(shape => {
            shape.springModel.particles.forEach(p => {
                p.calculateForces()
            })
        })
        physicsModel.forEach(shape => {
            shape.springModel.particles.forEach(p => {
                p.applyForceToMomentum()
            })
        })
        physicsModel.forEach(shape => {
            shape.springModel.particles.forEach(p => {
                p.applyMomentumToPosition()
            })
        })
        
        physicsModel.forEach(shape => {
            const newTrianglePositions = shape.springModel.triangleParticleIds.map(t => {
                const positions = [
                    _.get(_.find(shape.springModel.particles, p => p._id === t[0]), 'position', new Vec3(0)),
                    _.get(_.find(shape.springModel.particles, p => p._id === t[1]), 'position', new Vec3(0)),
                    _.get(_.find(shape.springModel.particles, p => p._id === t[2]), 'position', new Vec3(0))
                ]
                if(_.some(positions, _.isUndefined)) {
                    return false
                }
                return positions
            }).filter(_.isArray)
            var sceneMesh = _.find(scene.children, c => c._name == `${shape.name}_triangles`)
            var newMeshAttributes = generateNewTriangleData(newTrianglePositions)

            sceneMesh.geometry.attributes.position.data.set(newMeshAttributes.positionData)
            sceneMesh.geometry.attributes.position.needsUpdate = true

            sceneMesh.geometry.attributes.normal.data.set(newMeshAttributes.normalData)
            sceneMesh.geometry.attributes.normal.needsUpdate = true
            
        })
    }
    // console.log(physicsModel[0].springModel.particles[0].position)
    renderer.render({scene, camera})
    if(animating && newRenderCalled === false) {
        newRenderCalled = true
        setTimeout(() => {
            newRenderCalled = false
            render()
        }, frameRate)
    }
}

function generateNewTriangleData(patchTriangles) {
    const counts = patchTriangles.length * 3 * 3
    let position = []
    let normal = []
    let index = new Uint32Array(counts / 3)


    const n1 = new Vec3()
    const n2 = new Vec3()
    patchTriangles.forEach((t, i) => {
        const i3 = i * 3
        const i9 = i * 9
        const A = t[1].clone().sub(t[0])
        const B = t[2].clone().sub(t[0])
        n1.set(A.x, A.y, A.z)
        n2.set(B.x, B.y, B.z)
        let cross = n1.cross(n2)

        position[i9 + 0] = t[0].x
        position[i9 + 1] = t[0].y
        position[i9 + 2] = t[0].z
        position[i9 + 3] = t[1].x
        position[i9 + 4] = t[1].y
        position[i9 + 5] = t[1].z
        position[i9 + 6] = t[2].x
        position[i9 + 7] = t[2].y
        position[i9 + 8] = t[2].z

        index[i3 + 0] = i3
        index[i3 + 1] = i3 + 1
        index[i3 + 2] = i3 + 2

        for(var j = 0; j < 9; j++) {
            normal[i9 + j] = cross[j % 3]
        }
    })
    return {
        positionData: position,
        normalData: normal
    }
}