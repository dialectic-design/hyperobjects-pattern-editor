import {
    Vec3
} from 'ogl'

import {
    Point
} from '@dp50mm/hyperobjects-language'

import _ from 'lodash'

import {
    stepSize
} from '../physicsDefaults'

var particleIdCounter = 0

function Particle(position = {x: 0, y: 0, z: 0}, mass = 0.006) {
    particleIdCounter += 1
    this._id = particleIdCounter
    this.position = new Vec3(position.x, position.y, position.z)
    this.point = new Point(position)
    this.mass = mass
    this.momentum = new Vec3()
    this.springs = []
    this.fixed = false
    this.finalForce = new Vec3(0, 0, 0)
    this.friction = 0.01
    this.gravityForce = function() {
        return new Vec3(0, -this.mass * 9.8, 0)
    }
    this.calculateForces = function() {
        var force = new Vec3()
        force = force.add(this.gravityForce())
        this.springs.forEach(spring => {
            var springForceVec = spring.calculateForce(this)
            force = force.add(springForceVec)
        })
        this.finalForce = force
    }
    this.applyForceToMomentum = function() {
        // console.log(this.finalForce)
        this.momentum.add(this.finalForce.clone().multiply(stepSize).divide(this.mass))
        var momentumNormalized = this.momentum.clone().normalize().multiply(this.friction)
        this.momentum.sub(momentumNormalized)
    }
    this.applyMomentumToPosition = function() {
        if(this.fixed === false) {
            this.position.add(this.momentum)
        }
    }
}

export default Particle