import React, { useState, useContext } from 'react'
import {
    Input,
    Button,
    Form,
    Message
} from 'semantic-ui-react'
import { EditorContext } from 'components/PatternEditor/PatternEditor'
import _ from 'lodash'
import { types } from 'components/PatternEditor/procedures/types'

const addableTypes = [
    types.interpolationLine,
    types.mirrorShape
]

const AddProcedureForm = () => {
    return (
        <div className='add-procedure-form'>
            <h4>Add procedures</h4>
            {addableTypes.map(procedureType => {
                return (
                    <AddProcedureModule
                        key={procedureType.type}
                        procedureType={procedureType}
                        />
                )
            })}
        </div>
    )
}

const AddProcedureModule = ({ procedureType }) => {
    const niceName = _.lowerCase(procedureType.type.replace("_", " "))
    const { modelData, actions } = useContext(EditorContext)
    const [newName, setNewName] = useState(`new ${niceName}`)
    var nameAvailable = !modelData._procedures.map(p => p.name).includes(newName)

    return (
        <div className='add-procedure-module procedure'>
            <div className='ui form'>
                <Form.Field>
                    <label>New {niceName} name</label>
                    <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        size='mini'
                        />
                </Form.Field>
                <Button disabled={!nameAvailable} size="mini"
                    onClick={() => {
                        actions.addProcedure({
                            name: newName,
                            procedure: procedureType.json()
                        })
                        setNewName(`new ${niceName}`)
                    }}
                    >
                    New {niceName}
                </Button>
                {!nameAvailable && (
                    <Message negative size="tiny">Name {newName} already in use.</Message>
                )}
            </div>
            
            
        </div>
    )
}

export default AddProcedureForm