import React, { useState, useContext } from 'react'
import { EditorContext } from 'components/PatternEditor/PatternEditor'
import {
    Button,
    Input,
    Message
} from 'semantic-ui-react'

const NewGeometryPopUp = () => {
    const { modelData, actions } = useContext(EditorContext)
    const [showNewGeometryPopUp, setShowNewGeometryPopUp] = useState(false)
    const [newGeometryName, setNewGeometryName] = useState("new geometry")
    var nameAvailable = !modelData.editableGeometriesList.some(p => p === newGeometryName)
    return (
        <div className='new-element-pop-up'>
            {showNewGeometryPopUp ? (
                <React.Fragment>
                    <Input
                        size='mini'
                        value={newGeometryName}
                        onChange={(e) => setNewGeometryName(e.target.value)}
                        />
                    <Button
                        disabled={!nameAvailable}
                        size='mini'
                        onClick={() => {
                            actions.addNewGeometry(newGeometryName)
                            setShowNewGeometryPopUp(false)
                        }}
                        >
                        Add geometry
                    </Button>
                    {nameAvailable === false && (
                        <Message negative size="tiny">
                            name in use
                        </Message>
                    )}
                    <Button
                        size='mini'
                        basic
                        style={{width: 295, marginTop: 5, marginLeft: 0}}
                        onClick={() => {
                            setShowNewGeometryPopUp(false)
                        }}
                        >
                        Cancel
                    </Button>
                </React.Fragment>
            ) : (
                <Button size='mini' className='preview' onClick={() => setShowNewGeometryPopUp(!showNewGeometryPopUp)}>Add geometry</Button>
            )}
        </div>
    )
}

export default NewGeometryPopUp