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
import newTriangleBuffers from './shapes/newTriangleBuffers'
import _ from "lodash"
import { linesToArrays } from './shapes/SeamSpringLines'

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

var controls = false

const scene = new Transform()

const program = new Program(gl, {
    vertex,
    fragment,
    cullFace: null,
    transparent: true
})

var canvasCreated = false

export var animating = false
export var simulating = false

var physicsModel = false
var seamSprings = false


export function start(canvasContainer, _size, model, shapes, seams) {
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
        var output = generateGeometries(gl, scene, program, model, shapes, seams)
        physicsModel = output.shapesSpringModels 
        seamSprings = output.seamSprings
        resize()
        render()
    }
}
export function stop() {
    animating = false
    simulating = false
    canvasCreated = false
    simTick = 0
    scene.children = []
    if(controls) {
        controls.remove()
    }
}


export function startSimulation() {
    if(canvasCreated && !simulating) {
        simulating = true
    }
}

export function pauseSimulation() {
    simulating = false
}

/**
 * Geometries
 */

export function updateGeometries(model, shapes, seams) {
    scene.children = []
    workBox(gl, program, scene, model)
    var output = generateGeometries(gl, scene, program, model, shapes, seams)
    physicsModel = output.shapesSpringModels 
    seamSprings = output.seamSprings
    simTick = 0
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

let simTick = 0

export function resetMomentum() {
    if(_.isArray(physicsModel)) {
        physicsModel.forEach(shape => {
            shape.springModel.particles.forEach(p => p.momentum.set(0))
        })
    }
}


function render() {
    if(animating && canvasCreated) {
        frame = frame + 1
        if(controls) {
            controls.update()
        }
        var shouldTickSimulation = true
        if(simTick > 2) {
            if(simulating === false) {
                shouldTickSimulation = false
            }
        }
        if(!_.isArray(physicsModel)) {
            shouldTickSimulation = false
        }
        if(shouldTickSimulation) {
            simTick += 1
            /**
             * Tick simulation
             */
            physicsModel.forEach(shape => {
                shape.springModel.particles.forEach(p => p.calculateForces() )
            })
            physicsModel.forEach(shape => {
                shape.springModel.particles.forEach(p => p.applyForceToMomentum() )
            })
            physicsModel.forEach(shape => {
                shape.springModel.particles.forEach(p => p.applyMomentumToPosition() )
            })
            /**
             * Update meshes
             */
            // Fabric patches mesh
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
                var sceneMesh = _.find(scene.children, c => c._name === `${shape.name}_triangles`)
                var newMeshAttributes = newTriangleBuffers(newTrianglePositions)
                if(sceneMesh !== undefined) {
                    sceneMesh.geometry.attributes.position.data.set(newMeshAttributes.positionData)
                sceneMesh.geometry.attributes.position.needsUpdate = true
    
                sceneMesh.geometry.attributes.normal.data.set(newMeshAttributes.normalData)
                sceneMesh.geometry.attributes.normal.needsUpdate = true
                }
            })
            // Spring paths mesh
            const springPaths = seamSprings.map(spring => {
                return [
                    spring.p1.position,
                    spring.p2.position
                ]
            })
            var springPathsMesh = _.find(scene.children, c => c._name === 'spring-paths-mesh')
            if(springPathsMesh !== undefined) {
                var springLinesArrays = linesToArrays(springPaths)
                springPathsMesh.geometry.attributes.position.data.set(springLinesArrays.position)
                springPathsMesh.geometry.attributes.position.needsUpdate = true
            }

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
}

