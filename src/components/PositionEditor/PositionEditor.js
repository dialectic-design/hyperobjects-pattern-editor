import React from 'react'
import { Form, Input, Button } from 'semantic-ui-react'
import './position-editor.scss'
import cleanFloatInput from 'utils/cleanFloatInput'

const axes = [
    'x',
    'y',
    'z'
]


const PositionEditor = React.memo(({
    position,
    rotation,
    callback
}) => {
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
                                var newPos = position
                                newPos[axis] = cleanFloatInput(e.target.value)
                                callback({
                                    position: newPos,
                                    rotation: rotation
                                })
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
                                var newPos = rotation
                                newPos[axis] = cleanFloatInput(e.target.value)
                                callback({
                                    rotation: newPos,
                                    position: position
                                })
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