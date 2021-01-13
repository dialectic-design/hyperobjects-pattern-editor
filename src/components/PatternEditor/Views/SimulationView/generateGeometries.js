import {
    Vec3,
    Mesh
} from 'ogl'
import createTrianglePatch from './shapes/createTrianglePatch'
import patchToPhysicsModel from './physics/patchToPhysicsModel'
import Spring from './physics/models/Spring'
import SeamSpringLines from './shapes/SeamSpringLines'
import _ from 'lodash'
import colorData from './utils/colorData'
import alphaData from './utils/alphaData'

function generateGeometries(gl, scene, program, model, shapes, seams, particleStepSize=35) {
    let sourceShapes = shapes.map(shape => {
        var geometries = model.procedures[shape.name](model)
        if(_.isArray(geometries)) {
            geometries = geometries.filter(g => g.type === 'PATH')
        }
        return {
            name: shape.name,
            type: shape.procedure.type,
            position: _.get(shape, 'simulation.position', {x: 0, y: 0, z: 0}),
            rotation: _.get(shape, 'simulation.rotation', {x: 0, y: 0, z: 0}),
            geometries: geometries
        }
    }).map(g => {
        // make sure each shape has only one geometry
        if(_.isArray(g.geometries)) {
            return { ...g,
                geometry: g.geometries[0]
            }
        }
        return { ...g,
            geometry: g.geometries
        }
    }).filter(g => !_.isUndefined(g.geometry))

    var shapesSpringModels = sourceShapes.map(shape => {
        const position = convertToNr(_.cloneDeep(shape.position))
        const rotation = convertToNr(_.cloneDeep(shape.rotation))
        const orientation = {
            position,
            rotation
        }
        return {
            ...shape,
            springModel: patchToPhysicsModel(
                shape.geometry,
                shape.name,
                orientation,
                particleStepSize
            )
        }
    })
    var seamSprings = []

    
    seams.forEach(seam => {
        const patch1 = _.find(shapesSpringModels, shape => shape.name === seam.procedure.patch1)
        const patch2 = _.find(shapesSpringModels, shape => shape.name === seam.procedure.patch2)
        const alignment1 = _.get(seam, 'procedure.alignment1', 'start')
        const alignment2 = _.get(seam, 'procedure.alignment2', 'start')
        const segment1Index = _.get(seam, 'procedure.segment1Index', 0)
        const segment2Index = _.get(seam, 'procedure.segment2Index', 0)
        if(!_.some([patch1, patch2], _.isUndefined)) {
            var patch1OutlineParticles = patch1.springModel.particles.filter(p => _.get(p , 'partOf', false) === 'outline')
            var particlesOne = patch1OutlineParticles.filter(p => {
                return p.segment === segment1Index || p.prevSegment === segment1Index
            })
            var particlesTwo = patch2.springModel.particles.filter(p => {
                return p.segment === segment2Index || p.prevSegment === segment2Index
            })

            particlesOne = particlesOne.sort((a, b) => b.segment - a.segment || b.segmentStep - a.segmentStep)
            particlesTwo = particlesTwo.sort((a, b) => b.segment - a.segment || b.segmentStep - a.segmentStep)
                        
            var particlesToConnect = _.min([particlesOne.length, particlesTwo.length])
            var particlesOneShift = 0
            var particlesTwoShift = 0
            const diff = Math.abs(particlesOne.length - particlesTwo.length)
            if(particlesOne.length < particlesTwo.length) {
                if(alignment2 === 'middle') {
                    particlesTwoShift += Math.round(diff / 2)
                } else if(alignment2 === 'end') {
                    particlesTwoShift += diff
                }
            } else if(particlesTwo.length < particlesOne.length) {
                if(alignment1 === 'middle') {
                    particlesOneShift += Math.round(diff / 2)
                } else if(alignment1 === 'end') {
                    particlesOneShift += diff
                }
            }
            for (var i = 0; i < particlesToConnect; i++) {
                var p1 = _.get(particlesOne, i + particlesOneShift, false)
                var p2 = _.get(particlesTwo, i + particlesTwoShift, false)
                if(_.get(seam, 'procedure.flipDirection', false)) {
                    p2 = _.get(particlesTwo, particlesTwo.length - i - 1 - particlesTwoShift, false)
                }
                if(p1 && p2) {
                    var inputSpringStrength = _.get(seam, 'procedure.springStrength', 0)
                    if(inputSpringStrength === 0) {
                        inputSpringStrength = 5
                    }
                    var spring = new Spring(p1, p2, 1, inputSpringStrength/100000)
                    spring.springType = 'seam'
                    p1.springs.push(spring)
                    p2.springs.push(spring)
                    seamSprings.push(spring)
                }
            }
        }
        
    })
    const springPaths = seamSprings.map(spring => {
        return [
            spring.p1.position,
            spring.p2.position
        ]
    })
    let springPathsGeometry = new SeamSpringLines(gl, springPaths)
    springPathsGeometry.addAttribute('color', {
        size: 3, data: colorData(springPathsGeometry, [0.9, 0.0, 0.4])
    })
    springPathsGeometry.addAttribute('alpha', {
        size: 3,
        data: alphaData(springPathsGeometry, 1)
    })
    let springPathsMesh = new Mesh(gl, {
        mode: gl.LINES,
        geometry: springPathsGeometry,
        program
    })
    springPathsMesh._name = 'spring-paths-mesh'
    springPathsMesh.setParent(scene)

    shapesSpringModels.forEach(shape => {
        createTrianglePatch(gl, shape, scene, program)
    })
    return {
        shapesSpringModels,
        seamSprings
    }
}

function convertToNr(p) {
    p.x = _.toNumber(p.x)
    p.y = _.toNumber(p.y)
    p.z = _.toNumber(p.z)
    p.vec = new Vec3(
        p.x,
        p.y,
        p.z
    )
    return p
}

export default generateGeometries