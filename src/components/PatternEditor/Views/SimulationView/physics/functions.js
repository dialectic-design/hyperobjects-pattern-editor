
export function springForceFormula(_k, _x) {
    return _k * _x
}

export function applyForceVec(momentum, force, mass, stepSize) {
    momentum.add(force.clone().multiply(stepSize).divide(mass))
}

export function springExists(springs, spring) {
    var exists = false
    springs.forEach(_spring => {
        if(_spring.pointIds === spring.pointIds || _spring.pointIdsReverse === spring.pointIds) {
            exists = true
        }
    })
    return exists
}


export function setFixedParticles(controlPoint, particles, fixedPointsRadius = 100) {
    particles.forEach(p => {
        if(p.point.distance(controlPoint) < fixedPointsRadius) {
            p.fixed = true
        }
    })
}