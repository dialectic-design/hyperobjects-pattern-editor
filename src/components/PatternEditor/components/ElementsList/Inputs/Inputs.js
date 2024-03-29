import React, { useState, useContext } from 'react'
import {
    Button,
    Input,
    List
} from 'semantic-ui-react'
import { EditorContext } from 'components/PatternEditor/PatternEditor'
import _ from 'lodash'
import './inputs.scss'

const Inputs = () => {
    const { modelData, actions } = useContext(EditorContext)
    const [showNewInputPopUp, setShowNewInputPopUp] = useState(false)
    const [newInputName, setNewInputName] = useState("new-input")
    const inputs = _.keys(modelData.inputs)
    return (
        <div className='inputs segment'>
            <h3>Inputs</h3>
            {inputs.length > 0 ? (
                <React.Fragment>
                    <List>
                    {inputs.map(input => {
                        return (
                            <List.Item key={input}>
                                <p key={input}>{input}</p>
                                <Button
                                    icon="trash"
                                    onClick={() => {
                                        actions.removeInput(input)
                                    }}
                                    size="mini"
                                    className='edit-button'
                                    floated='right'
                                    />
                            </List.Item>
                        )
                    })}
                    </List>
                </React.Fragment>
            ) : (
                <p><i>No inputs set yet.</i></p>
            )}
            {showNewInputPopUp ? (
                <div className='new-element-pop-up'>
                    <Input size='mini' value={newInputName} onChange={(e) => setNewInputName(e.target.value)} />
                    <Button size='mini' onClick={() => {
                        actions.addInput(newInputName, [0, 1])
                        setShowNewInputPopUp(false)
                    }}>Add input</Button>
                </div>
            ) : (
                <Button size='mini' className='preview' onClick={() => setShowNewInputPopUp(!showNewInputPopUp)}>Add input</Button>
            )}
        </div>
    )
}

export default Inputs