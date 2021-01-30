import React, { useContext, useState } from 'react'
import { EditorContext } from 'components/PatternEditor/PatternEditor'
import _ from 'lodash'
import {
    Button,
    Input,
    Form,
    List
} from 'semantic-ui-react'
import './construction-view-sidebar.scss'
import { v4 as uuidv4 } from 'uuid';
import {
    CONSTRUCTION_TEXT_LABEL
} from './constants'


const ConstructionViewSidebar = () => {
    const { pattern, modelData, actions } = useContext(EditorContext)
    const [newNoteText, setNewNoteText] = useState('')

    const construction = _.get(pattern, 'construction.elements', [])
    const usedKeys = construction.map(p => p.key)

    var newUniqueKey = uuidv4().slice(0, 8)
    while (usedKeys.includes(newUniqueKey)) {
        console.log('already in use generate a new one')
        newUniqueKey = uuidv4().slice(0, 8)
    }
    
    return (
        <div className='construction-view-sidebar'>
            <h2>Construction</h2>
            <List>
                {construction.map(element => {
                    return (
                        <List.Item className='construction-element'>
                            {element.key}
                            <br />
                            {element.type}
                        </List.Item>
                    )
                })}
            </List>
            <div className='add-construction-elements'>
                <div className='ui form'>
                    <Form.Field>
                        <label>New note text</label>
                        <Input
                            size='mini'
                            value={newNoteText}
                            onChange={(e) => setNewNoteText(e.target.value)}
                            />
                    </Form.Field>
                    
                </div>
                <Button size='tiny'
                    onPointerDown={() => {
                        actions.addConstructionElement({
                            key: newUniqueKey,
                            text: newNoteText,
                            type: CONSTRUCTION_TEXT_LABEL,
                            position: false
                        })
                    }}
                    >
                    Add note
                </Button>
            </div>
        </div>
    )
}

export default ConstructionViewSidebar