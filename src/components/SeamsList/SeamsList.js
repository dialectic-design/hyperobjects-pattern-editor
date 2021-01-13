import React, { useContext } from 'react'
import { EditorContext } from 'components/PatternEditor/PatternEditor'
import _ from 'lodash'
import { types } from 'components/PatternEditor/procedures/types'
import {
    Button,
    Form,
    Input,
    Checkbox
} from 'semantic-ui-react'
import './seams-list.scss'
import cleanFloatInput from 'utils/cleanFloatInput'

const alignmentOptions = [
    'start',
    'middle',
    'end'
]

const SeamsList = () => {
    const { modelData, actions } = useContext(EditorContext)
    const seams = modelData._procedures.map((p, i) => {
        return {
            ...p,
            __index: i
        }
    }).filter(p => p.procedure.type === types.seam.type)
    return (
        <div className='seams-list'>
        {seams.map(seam => {
            const description = seam.procedure
            return (
                <div className='seam' key={seam.name}>
                    <h4>{seam.name}</h4>
                    <div className='ui form'>
                        <Form.Field>
                            <label>Alignment 1</label>
                            <Button.Group size='tiny'>
                            {alignmentOptions.map(option => {
                                return (
                                    <Button
                                        toggle
                                        key={option}
                                        active={option === _.get(seam, 'procedure.alignment1', false)}
                                        onPointerDown={() => {
                                            actions.updateProcedure({
                                                ...seam,
                                                procedure: {
                                                    ...seam.procedure,
                                                    alignment1: option
                                                }
                                            })
                                        }}
                                        >
                                        {option}
                                    </Button>
                                )
                            })}
                            </Button.Group>
                        </Form.Field>
                        <Form.Field>
                            <label>Alignment 2</label>
                            <Button.Group size='tiny'>
                            {alignmentOptions.map(option => {
                                return (
                                    <Button
                                        toggle
                                        key={option}
                                        active={option === _.get(seam, 'procedure.alignment2', false)}
                                        onPointerDown={() => {
                                            actions.updateProcedure({
                                                ...seam,
                                                procedure: {
                                                    ...seam.procedure,
                                                    alignment2: option
                                                }
                                            })
                                        }}
                                        >
                                        {option}
                                    </Button>
                                )
                            })}
                            </Button.Group>
                        </Form.Field>
                        <hr />
                        <Form.Field>
                            <label>Simulation strength</label>
                            <Input
                                size="mini"
                                value={_.get(description, 'springStrength', 0)}
                                onChange={(e) => {
                                    actions.updateProcedure({...seam,
                                        procedure: {...description, springStrength: cleanFloatInput(e.target.value) }
                                    })
                                }}
                                />
                        </Form.Field>
                        <Form.Field>
                            <Checkbox
                                checked={_.get(description, 'flipDirection', false)}
                                onChange={() => {
                                    actions.updateProcedure({...seam,
                                        procedure: {...description, flipDirection: !_.get(description, 'flipDirection', false) }
                                    })
                                }}
                                label="flip direction" />
                        </Form.Field>
                    </div>
                </div>
            )
        })}
        </div>
    )
}

export default SeamsList