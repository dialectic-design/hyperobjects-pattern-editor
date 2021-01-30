import React, { useContext, useState } from 'react'
import {
    Card,
    Button,
    Input,
    Form
} from 'semantic-ui-react'
import { EditorContext } from 'components/PatternEditor/PatternEditor'
import Draggable from 'react-draggable'
import _ from 'lodash'

const ConstructionSettings = ({ model }) => {
    const {
        actions,
        editorUIState
    } = useContext(EditorContext)
    const [width, setWidth] = useState(model.size.width)
    const [height, setHeight] = useState(model.size.height)

    return (
        <div className='construction-settings view-settings'>
            <Draggable>
                <Card>
                    <Card.Content>
                        <Button
                            size='tiny'
                            basic
                            circular
                            className='close-button'
                            floated='right'
                            icon='close'
                            onClick={() => editorUIState.setShowSettings(false)} />
                        <h2>Construction settings</h2>
                        <p>Size</p>
                        <div className='ui form'>
                            <Form.Field>
                                <Input
                                    value={width}
                                    onChange={(e) => setWidth(e.target.value)}
                                    label="model width"
                                    labelPosition="right"
                                    size='mini'
                                    className={width === model.size.width ? "normal" : "italic"}
                                    />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    label="model height"
                                    labelPosition="right"
                                    size='mini'
                                    className={height === model.size.height ? "normal" : "italic"}
                                    />
                            </Form.Field>
                            <Button
                                size='tiny'
                                onClick={() => {
                                    actions.setConstructionSize({
                                        width: width,
                                        height: height
                                    })
                                }}
                                >
                                Update size
                            </Button>
                        </div>
                    </Card.Content>
                </Card>
            </Draggable>
        </div>
    )
}

export default ConstructionSettings