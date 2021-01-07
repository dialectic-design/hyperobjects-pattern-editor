import React, { useState, useContext } from 'react'
import InterpolationLine from './Types/InterpolationLine'
import MirrorShape from './Types/MirrorShape'
import { types } from 'components/PatternEditor/procedures/types'
import { EditorContext } from 'components/PatternEditor/PatternEditor'

import {
    Button,
    Modal
} from 'semantic-ui-react'

const Procedure = ({ procedure }) => {
    const { actions } = useContext(EditorContext)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    
    return (
        <React.Fragment>
            <Modal size="mini" open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <Modal.Content>
                    <h4>Are you sure you want to delete procedure <strong><i>{procedure.name}</i></strong>?</h4>
                    <Button color='red' onClick={() => actions.deleteProcedure(procedure)}>Delete <i>{procedure.name}</i></Button>
                </Modal.Content>
            </Modal>
        <div className='procedure'>
            <h4>{procedure.name}</h4>
            <Button onClick={() => {
                console.log('delete ', procedure)
                setShowDeleteModal(true)
                // patternActions.deleteProcedure(props.index, props.name)

            }} className='delete-button' icon='trash' size='mini' floated='right' />

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
        </div>
        </React.Fragment>
    )
}

export default Procedure