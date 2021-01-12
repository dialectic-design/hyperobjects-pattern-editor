import {
    Mesh,
    Vec3
} from 'ogl'
import createTrianglePatch from './shapes/createTrianglePatch'
import patchToPhysicsModel from './physics/patchToPhysicsModel'
import _ from 'lodash'

function generateGeometries(gl, scene, program, model, shapes) {
    let sourceShapes = shapes.map(shape => {
        console.log(shape)
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
        return {
            ...shape,
            springModel: patchToPhysicsModel(
                shape.geometry,
                shape.type === 'MIRROR_SHAPE'
            )
        }
    })
    shapesSpringModels.forEach(shape => {
        createTrianglePatch(gl, shape, scene, program)
    })
    return shapesSpringModels
}

export default generateGeometries