import Spring from './models/Spring'
import Particle from './models/Particle'
import _ from 'lodash'
import {
    springExists
} from './functions'
import * as d3Voronoi from 'd3-voronoi'
import { Vec3, Mat4, Quat } from 'ogl'
import { Path } from '@dp50mm/hyperobjects-language'

var voronoi = d3Voronoi.voronoi()

const particleStepSize = 35

function patchToPhysicsModel(_path, name, orientation) {
    var path = _path.clone()
    if(!path.isClockwise()) {
        var pointsReversed = _.reverse(path.points)
        path = new Path(pointsReversed.map(p => {
            return {
                x: p.x,
                y: p.y,
                z: p.z
            }
        })).closed(true)
    }
    var pathCenter = path.center()
    path = path.translate({
        x: -pathCenter.x,
        y: -pathCenter.y
    })
    var pathArea = path.getArea()
    
    var massDensity = 0.0000002
    var totalMass = pathArea * massDensity
    var segments = path.segments()
    var particles = []
    var innerParticles = []
    var outlineParticles = []

    segments.forEach((segment, segment_i) => {
        var steps = Math.round(segment.getLength()/ particleStepSize)
        _.range(steps).forEach((step, step_i) => {
            var point = segment.interpolate(step/steps)
            point.z = Math.random()
            var particle = new Particle(point)
            particle.partOf = 'outline'
            particle.path = name
            particle.segment = segment_i
            particle.prevSegment = false
            if(step_i === 0 && segment_i > 0) {
                particle.prevSegment = segment_i - 1
            }
            particle.segmentStep = step_i
            outlineParticles.push(particle)
            particles.push(particle)
        })
    })
    var pathBounds = path.getBounds()
    var boundsP1 = {
        x: pathBounds.p1.x + particleStepSize * 1.1,
        y: pathBounds.p1.y + particleStepSize * 1.1
    }
    var boundsHeight = pathBounds.height() - particleStepSize * 1.2
    var boundsWidth = pathBounds.width() - particleStepSize * 1.2

    var rows = Math.floor(boundsHeight / particleStepSize)
    var cols = Math.floor(boundsWidth / particleStepSize)
    var rowStepSize = boundsHeight / rows
    var colStepSize = boundsWidth / cols
    for(var row = 0; row < rows; row++) {
        var shiftRow = (row % 2) * colStepSize * 0.5
        for(var col = 0; col < cols; col++) {
            var point = {
                x: boundsP1.x + colStepSize * col + shiftRow,
                y: boundsP1.y + rowStepSize * row,
                z: 0
            }
            if(path.contains(point)) {
                var particle = new Particle(point)
                particle._i = col
                particle._j = row
                particles.push(particle)
                innerParticles.push(particle)
            }
        }
    }
    var massPerParticle = totalMass / particles.length
    
    particles.forEach(p => {
        p.mass = massPerParticle
    })
    
    var springs = []
    particles.forEach(p => {
        var nearbyParticles = particles.filter(_p => {
            return _p.point.distance(p.point) < particleStepSize * 2.2 && p._id !== _p._id
        })
        nearbyParticles.forEach(_p => {
            var distance = p.position.distance(_p.position)
            var spring = new Spring(
                p,
                _p,
                distance
            )
            if(!springExists(springs, spring)) {
                p.springs.push(spring)
                _p.springs.push(spring)
                springs.push(spring)
            } else {
            }
        })
    })

    

    var triangles = voronoi.triangles(particles.map(p => [p.position[0], p.position[1]])).map(t => {
        return t.filter(p => !_.isNull(p))
    }).map(t => {
        return t.map(p => {
            return new Vec3(p[0], p[1], 0)
        })
    }).filter(t => {
        var tCenter = new Path([
            {x: t[0].x, y: t[0].y},
            {x: t[1].x, y: t[1].y},
            {x: t[2].x, y: t[2].y}
        ]).center()
        return path.contains(tCenter)
    }).filter(t => {
        return [
            t[0].distance(t[1]),
            t[1].distance(t[2]),
            t[2].distance(t[0])
        ].every(d => d < particleStepSize * 2)
    })
    
    // triangulation
    const triangleParticleIds = triangles.map(t => {
        return [
            findNearestParticle(t[0], particles),
            findNearestParticle(t[1], particles),
            findNearestParticle(t[2], particles)
        ]
    })

    

    var rotationQuat = new Quat()
    // Flip because Frame model space is inverted from 3d space
    rotationQuat.rotateX(Math.PI)
    rotationQuat.rotateX(orientation.rotation.x / 360 * Math.PI * 2) // convert from user input in degrees 
    rotationQuat.rotateY(orientation.rotation.y / 360 * Math.PI * 2) // convert from user input in degrees 
    rotationQuat.rotateZ(orientation.rotation.z / 360 * Math.PI * 2) // convert from user input in degrees 
    // Apply rotate and translate 
    var translateMatrix = new Mat4()
    translateMatrix.translate(orientation.position.vec)
    
    particles.forEach(p => {
        p.position.applyMatrix4(translateMatrix)
        p.position.applyQuaternion(rotationQuat)
    })
    // reset rest lengths after transformations
    springs.forEach(spring => {
        spring.restLength = spring.p1.position.distance(spring.p2.position)
    })
    var particleIndexes = particles.map((p, i) => {
        return {
            pos: p.position,
            i: i
        }
    })
    particleIndexes = particleIndexes.sort((a, b) => b.pos.y - a.pos.y)
    _.range(7).forEach(i => {
        // particles[particleIndexes[i].i].fixed = true
    })
    return {
        particles: particles,
        springs: springs,
        outlineParticles: outlineParticles,
        triangles: triangles,
        triangleParticleIds: triangleParticleIds,
        center: pathCenter
    }

}

function findNearestParticle(vec, particles) {
    const sortedParticles = particles.sort((a, b) => a.position.distance(vec) - b.position.distance(vec))
    return sortedParticles[0]._id
}

export default patchToPhysicsModel