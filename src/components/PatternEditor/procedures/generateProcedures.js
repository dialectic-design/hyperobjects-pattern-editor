import { typesList } from './types'
import _ from 'lodash'


function generateProcedures(procedureDescriptions) {
    let procedures = {}
    procedureDescriptions.forEach(procedure => {
        let type = _.find(typesList, p => p.type === procedure.procedure.type)
        if(type !== undefined) {
            procedures[procedure.name] = type.generator(procedure.procedure, procedure.name)
        } else {
            procedures[procedure.name] = () => { return [] }
        }
        
    })
    return procedures
}

export default generateProcedures