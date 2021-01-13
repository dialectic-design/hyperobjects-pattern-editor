import React, { useState, useContext } from 'react'

import InterpolationLine from './Types/InterpolationLine'
import MirrorShape from './Types/MirrorShape'
import ButtonProcedureEditor from './Types/Button'
import SeamProcedureEditor from './Types/Seam'

import { types } from 'components/PatternEditor/procedures/types'
import { EditorContext } from 'components/PatternEditor/PatternEditor'

import {
    Input,
    Button,
    Modal,
    Message
} from 'semantic-ui-react'

const Procedure = ({ procedure }) => {
    const { actions, modelData } = useContext(EditorContext)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showEditor, setShowEditor] = useState(false)
    const [newName, setNewName] = useState(procedure.name)
    var nameInputClassName = 'procedure-name'
    var inputNameLabel = false
    const nameEditted = newName !== procedure.name
    const newNameExists = modelData._procedures.map(p => p.name).includes(newName)
    if (nameEditted) {
        nameInputClassName += ' editted'

        inputNameLabel = (
            <Button.Group>
            <Button disabled={newNameExists} size='tiny' onClick={() => actions.renameProcedure(procedure.name, newName)}>
                Update
            </Button>
            <Button size='tiny' onClick={() => setNewName(procedure.name)}>
                Cancel
            </Button>
            </Button.Group>
        )
    }
    return (
        <React.Fragment>
            <Modal size="mini" open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <Modal.Content>
                    <h4>Are you sure you want to delete procedure <strong><i>{procedure.name}</i></strong>?</h4>
                    <Button color='red' onClick={() => actions.deleteProcedure(procedure)}>Delete <i>{procedure.name}</i></Button>
                </Modal.Content>
            </Modal>
        <div className='procedure' style={{paddingBottom: showEditor ? 5 : 30}}>
            <Input
                value={newName}
                label={inputNameLabel}
                labelPosition='right'
                onChange={(e) => setNewName(e.target.value)}
                className={nameInputClassName}
                />
            {nameEditted && newNameExists && (
                <Message size='tiny' negative>Name {newName} exists already</Message>
            )}
            <Button onClick={() => {
                console.log('delete ', procedure)
                setShowDeleteModal(true)
                // patternActions.deleteProcedure(props.index, props.name)

            }} className='delete-button' icon='trash' size='mini' />
            <Button
                size="tiny"
                onClick={() => setShowEditor(!showEditor)}
                icon={showEditor ? 'angle up' : 'angle down'}
                className='show-editor-button-toggle'
                basic
                />
            {showEditor && (
                <React.Fragment>
                    {procedure.procedure.type === types.interpolationLine.type && (
                        <InterpolationLine
                            procedure={procedure}
                            />
                    )}
                    {procedure.procedure.type === types.mirrorShape.type && (
                        <MirrorShape
                            procedure={procedure}
                            />
                    )}
                    {procedure.procedure.type === types.button.type && (
                        <ButtonProcedureEditor
                            procedure={procedure}
                            />
                    )}
                    {procedure.procedure.type === types.seam.type && (
                        <SeamProcedureEditor
                            procedure={procedure}
                            />
                    )}
                </React.Fragment>
            )}
            
        </div>
        </React.Fragment>
    )
}

export default Procedure