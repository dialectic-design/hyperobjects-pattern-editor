import {
    Vec3
} from 'ogl'
import _ from 'lodash'
import {
    springForceFormula
} from '../functions'

// 0.002 initial param
function Spring(p1, p2, restLength = 10, k = 0.002) {
    this.p1 = p1
    this.p2 = p2
    this.pointIds = `${p1._id}-${p2._id}`
    this.pointIdsReverse = `${p2._id}-${p1._id}`
    this.restLength = restLength
    this.k = k
    this.damping =  0.9 // 0.85
    this.friction = 0.005 // 0.01
    this.calculateForce = function(targetPoint) {
        var force = springForceFormula(this.k, this.diffFromRestLength() )
        force = _.clamp(force, -100, 100)
        if(force < 0) {
            //force = force / 5
        }
        var forceDirectionVec = new Vec3()
        if(targetPoint._id === this.p1._id) {
            forceDirectionVec = this.p1.position.clone().sub(this.p2.position).normalize().multiply(-force)
        } else if(targetPoint._id === this.p2._id) {
            forceDirectionVec = this.p2.position.clone().sub(this.p1.position).normalize().multiply(-force)
        }
        forceDirectionVec = forceDirectionVec.multiply(this.damping)
        return forceDirectionVec
    }

    this.length = function() {
        return this.p1.position.distance(this.p2.position)
    }
    this.diffFromRestLength = function() {
        return this.length() - this.restLength
    }
}

export default Spring