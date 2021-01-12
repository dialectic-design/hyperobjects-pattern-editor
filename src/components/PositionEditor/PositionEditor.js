import React, { useState } from 'react'
import { Form, Input, Button } from 'semantic-ui-react'
import './position-editor.scss'

const axes = [
    'x',
    'y',
    'z'
]

function cleanInput(input) {
    if(input !== "0" && input !== 0) {
        input = input.replace(/^0+/, '').replace(/[^\d.-]/g,'')
    }
    if(input.length === 0) {
        input = "0"
    }
    return input
}

const ENTER_KEY = 13

const PositionEditor = React.memo(({
    position,
    rotation,
    callback
}) => {
    const [newPosition, setNewPosition] = useState(position)
    const [newRotation, setNewRotation] = useState(rotation)
    console.log(newPosition)
    return (
        <div className='position-editor ui form'>
            <Form.Field>
                <label>Position</label>
                {axes.map(axis => {
                    return (
                        <Input
                            key={axis}
                            label={{basic: true, content: axis}}
                            labelPosition="right"
                            value={position[axis]}
                            onChange={(e) => {
                                var newPos = newPosition
                                newPos[axis] = cleanInput(e.target.value)
                                callback({
                                    position: newPos,
                                    rotation: rotation
                                })
                            }}
                            onKeyDown={(e) => {
                                if(e.keyCode === ENTER_KEY) {
                                    callback({
                                        position: newPosition,
                                        rotation: newRotation
                                    })
                                }
                            }}
                            />
                    )
                })}
            </Form.Field>
            <Form.Field>
                <label>Rotation</label>
                {axes.map(axis => {
                    return (
                        <Input
                            key={axis}
                            label={{basic: true, content: axis}}
                            labelPosition="right"
                            value={rotation[axis]}
                            onChange={(e) => {
                                var newPos = newRotation
                                newPos[axis] = cleanInput(e.target.value)
                                callback({
                                    rotation: newPos,
                                    position: position
                                })
                            }}
                            onKeyDown={(e) => {
                                if(e.keyCode === ENTER_KEY) {
                                    callback({
                                        position: newPosition,
                                        rotation: newRotation
                                    })
                                }
                            }}
                            />
                    )
                })}
            </Form.Field>
            <Form.Field>
                <Button.Group size='tiny'>
                <Button size="tiny"
                    onClick={() => {
                        callback({
                            position: {x: 0, y: 0, z: 0},
                            rotation: rotation
                        })
                    }}
                    >
                    Reset position
                </Button>
                <Button size="tiny"
                    onClick={() => {
                        callback({
                            position: position,
                            rotation: {x: 0, y: 0, z: 0}
                        })
                    }}
                    >
                    Reset rotation
                </Button>
                </Button.Group>
            </Form.Field>
        </div>
    )
})

export default PositionEditor