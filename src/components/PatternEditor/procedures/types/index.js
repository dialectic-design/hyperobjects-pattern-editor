import interpolationLine from './interpolationLine'
import straightLine from './straightLine'
import copyTransform from './copyTransform'
import mirrorShape from './mirrorShape'
import button from './button'
import _ from 'lodash'

function dictToList(dict) {
    return _.keys(dict).map(key => {
        return dict[key]
    })
}

export const types = {
    interpolationLine: interpolationLine,
    straightLine: straightLine,
    copyTransform: copyTransform,
    mirrorShape: mirrorShape,
    button: button
}

export const typesList = dictToList(types)

