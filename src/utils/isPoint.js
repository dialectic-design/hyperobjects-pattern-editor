import _ from 'lodash'

function isPoint(p) {
    return _.has(p, 'x') && _.has(p, 'y')
}

export default isPoint