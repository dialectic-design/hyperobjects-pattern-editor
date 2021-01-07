import React, { useContext } from 'react'
import Procedure from './Procedure'
import { EditorContext } from 'components/PatternEditor/PatternEditor'
import AddProcedureForm from './AddProcedureForm'

import './procedures.scss'

const ProceduresList = React.memo(() => {
    const { modelData } = useContext(EditorContext)
    return (
        <div className='procedures-list'>
            <h3>Procedures</h3>
            {modelData._procedures.map(procedure => {
                return (
                    <Procedure
                        key={procedure.name}
                        procedure={procedure}
                        />
                )
            })}
            <AddProcedureForm />
        </div>
    )
})

export default ProceduresList