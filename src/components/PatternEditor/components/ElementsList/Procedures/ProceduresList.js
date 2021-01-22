import React, { useContext, useState } from 'react'
import Procedure from './Procedure'
import { EditorContext } from 'components/PatternEditor/PatternEditor'
import FoldOutBox from 'components/FoldOutBox'
import AddProcedureForm from './AddProcedureForm'
import { CompactPicker } from 'react-color'
import {
    Button
} from 'semantic-ui-react'
import { types } from 'components/PatternEditor/procedures/types'
import './procedures.scss'

const ProceduresList = React.memo(() => {
    const { modelData, actions } = useContext(EditorContext)
    const [globalColor, setGlobalColor] = useState('grey')
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
            <FoldOutBox title='apply color to all'>
                <div style={{pointerEvents: 'initial'}}>
                    <CompactPicker
                        color={globalColor}
                        onChange={(color) => {
                            setGlobalColor(color.hex)
                        }}
                        />
                    <Button size="tiny" onPointerDown={() => {
                        const proceduresWithColor = [
                            types.interpolationLine.type,
                            types.mirrorShape.type
                        ]
                        const newProcedures = modelData._procedures.map(procedure => {
                            const description = procedure.procedure
                            if(proceduresWithColor.includes(procedure.procedure.type)) {
                                return {
                                    ...procedure,
                                    procedure: {
                                        ...description,
                                        color: globalColor
                                    }
                                }
                            }
                            return procedure
                        })
                        actions.updateProcedures(newProcedures)
                    }}>Apply to all</Button>
                </div>
            </FoldOutBox>
            <AddProcedureForm />
        </div>
    )
})

export default ProceduresList