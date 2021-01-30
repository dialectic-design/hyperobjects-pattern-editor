import React, { useContext } from 'react'
import { EditorContext } from '../../PatternEditor'
import {
    Input,
    Form,
    Message,
    Checkbox
} from 'semantic-ui-react'
import './settings-view.scss'
import _ from 'lodash'
import { PatternContext } from 'App'


const SettingsView = () => {
    const editor = useContext(EditorContext)
    const patternContext = useContext(PatternContext)
    console.log(window.location)
    return (
        <div className='settings-view'>
            <div className='ui container'>
                <div className='centered-content'>
                <h2>Pattern settings</h2>
                <Message color='orange' size='tiny'>Work in progress page.</Message>
                <div className='ui form'>
                <Form.Field>
                        <label>Pattern name</label>
                        <Input
                            value={editor.pattern.name}
                            />
                    </Form.Field>
                    <Form.Field>
                        <label>Pattern id</label>
                        <Input
                            value={editor.pattern._id}
                            />
                    </Form.Field>
                    <Form.Field>
                        <label>Public</label>
                        <Checkbox
                            checked={_.get(editor.pattern, 'public', false)}
                            onChange={() => {
                                patternContext.actions.updatePattern({
                                    ...editor.pattern,
                                    public: !_.get(editor.pattern, 'public', true)
                                })
                            }}
                            />
                    </Form.Field>
                    <Form.Field>
                        <label>Iframe embed</label>
                        <Input
                            value={`https://pattern.hyperobjects.design/embed/?pattern=${editor.pattern._id}&mode=EDITOR`}
                            />
                    </Form.Field>
                    {window.location.host.includes('localhost:3000') && (
                        <Form.Field>
                            <Input
                                value={`http://localhost:3000/embed/?pattern=${editor.pattern._id}&mode=EDITOR`}
                                />
                        </Form.Field>
                    )}
                    
                </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsView