import React, { useState, useContext } from 'react'
import {
    Card,
    Button,
    Input,
    Form
} from 'semantic-ui-react'
import './model-settings.scss'
import { EditorContext } from 'components/PatternEditor/PatternEditor'
import CopyPatternForm from 'components/CopyPatternForm'

const ModelSettings = ({ pattern, model, frameDisplaySettings }) => {
    const {
        actions,
        editorUIState
    } = useContext(EditorContext)

    const [modelWidth, setModelWidth] = useState(model.size.width)
    const [modelHeight, setModelHeight] = useState(model.size.height)

    return (
        <div className='model-settings'>
            <Card>
                <Card.Content>
                    <Button
                        size='tiny'
                        basic
                        circular
                        className='close-button'
                        floated='right' icon='close' onClick={() => editorUIState.setShowSettings(false)} />
                    <h2>Settings</h2>
                    <p>Size</p>
                    <div className='ui form'>
                        <Form.Field>
                            <Input
                                value={modelWidth}
                                onChange={(e) => setModelWidth(e.target.value)}
                                label="model width"
                                labelPosition="right"
                                size='mini'
                                className={modelWidth === model.size.width ? "normal" : "italic"}
                                />
                        </Form.Field>
                        <Form.Field>
                            <Input
                                value={modelHeight}
                                onChange={(e) => setModelHeight(e.target.value)}
                                label="model height"
                                labelPosition="right"
                                size='mini'
                                className={modelHeight === model.size.height ? "normal" : "italic"}
                                />
                        </Form.Field>
                        <Button
                            size='tiny'
                            onClick={() => {
                                console.log('implement update size action')
                                actions.setModelSize({
                                    width: modelWidth,
                                    height: modelHeight
                                })
                            }}
                            >
                            Update size
                        </Button>
                    </div>
                </Card.Content>
                <Card.Content>
                    <div>
                    <Button
                        toggle
                        size='tiny'
                        active={frameDisplaySettings.showPointLabels}
                        onClick={() => {
                            frameDisplaySettings.setShowPointLabels(!frameDisplaySettings.showPointLabels)
                            
                        }}
                        >Show point labels</Button>
                    </div>
                </Card.Content>
                <Card.Content>
                    <CopyPatternForm pattern={pattern} model={model} />
                </Card.Content>
            </Card>
        </div>
    )
}

export default ModelSettings