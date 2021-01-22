import React, { useContext } from 'react'
import { EditorContext } from 'components/PatternEditor/PatternEditor'
import {
    Select,
    Button,
    Form
} from 'semantic-ui-react'
import _ from 'lodash'

const sizes = [
    10,
    20,
    50
]

const distances = [
    10,
    20,
    50,
    75,
    100,
    200
]

const ButtonProcedureEditor = ({ procedure }) => {
    const { modelData, actions } = useContext(EditorContext)
    const inputs = _.keys(modelData.inputs)
    const description = procedure.procedure
    return (
        <div className='button-editor'>
            <p className='type-label'>button</p>
            <div className='ui form'>
                <Form.Field>
                    <label>Sizing input</label>
                    <Select
                        placeholder='select input'
                        options={inputs.map((input) => {
                            return {
                                key: input,
                                value: input,
                                text: input
                            }
                        })}
                        value={description.input}
                        size='mini'
                        onChange={(e, data) => {
                            actions.updateProcedure({
                                ...procedure,
                                procedure: {...description, input: data.value}
                            })
                        }}
                        />
                </Form.Field>
                <Form.Field>
                    <label>Geometry position</label>
                    <Select
                        placeholder='select path'
                        value={description.geometry}
                        onChange={(e, data) => {
                            actions.updateProcedure({...procedure,
                                procedure: {...description, geometry: data.value}
                            })
                        }}
                        options={modelData.editableGeometriesList.map((g) => {
                            return {
                                key: g,
                                value: g,
                                text: g
                            }
                        })}
                        />
                </Form.Field>
                <Form.Field>
                    <label>Button size <i>(diameter)</i></label>
                    {sizes.map(size => {
                        return (
                            <Button size='tiny' key={size}
                                toggle
                                active={size === description.radius * 2}
                                onPointerDown={() => {
                                    actions.updateProcedure({...procedure,
                                        procedure: {...description, radius: size / 2}
                                    })
                                }}
                                >
                                {size}mm
                            </Button>
                        )
                    })}
                </Form.Field>
                <Form.Field>
                    <label>Gender</label>
                    <Button.Group size='tiny' style={{width: '100%'}}>
                        <Button
                            toggle
                            active={description.gender === 'male'}
                            onPointerDown={() => {
                                actions.updateProcedure({...procedure,
                                    procedure: {...description, gender: 'male'}
                                })
                            }}
                            >
                            Male
                        </Button>
                        <Button
                            toggle
                            active={description.gender === 'female'}
                            onPointerDown={() => {
                                actions.updateProcedure({...procedure,
                                    procedure: {...description, gender: 'female'}
                                })
                            }}
                            >
                            Female
                        </Button>
                    </Button.Group>
                </Form.Field>
                <Form.Field>
                    <label>Label direction</label>
                    <Button.Group size='tiny' style={{width: '100%'}}>
                        <Button
                            toggle
                            active={description.labelDirection === 'left'}
                            onPointerDown={() => {
                                actions.updateProcedure({...procedure,
                                    procedure: {...description, labelDirection: 'left'}
                                })
                            }}
                            >
                            Left
                        </Button>
                        <Button
                            toggle
                            active={description.labelDirection === 'right'}
                            onPointerDown={() => {
                                actions.updateProcedure({...procedure,
                                    procedure: {...description, labelDirection: 'right'}
                                })
                            }}
                            >
                            Right
                        </Button>
                    </Button.Group>
                    <Button.Group size='tiny' style={{width: '100%'}}>
                        <Button
                            toggle
                            active={description.labelDirection === 'top'}
                            onPointerDown={() => {
                                actions.updateProcedure({...procedure,
                                    procedure: {...description, labelDirection: 'top'}
                                })
                            }}
                            >
                            Top
                        </Button>
                        <Button
                            toggle
                            active={description.labelDirection === 'bottom'}
                            onPointerDown={() => {
                                actions.updateProcedure({...procedure,
                                    procedure: {...description, labelDirection: 'bottom'}
                                })
                            }}
                            >
                            Bottom
                        </Button>
                    </Button.Group>
                </Form.Field>
                <Form.Field>
                    <label>Label distance</label>
                    <Button.Group size='tiny' style={{width: '100%'}}>
                        {distances.map(distance => {
                            return (
                                <Button
                                    key={distance}
                                    toggle
                                    active={description.labelDistance === distance}
                                    onPointerDown={() => {
                                        actions.updateProcedure({...procedure,
                                            procedure: {...description, labelDistance: distance}
                                        })
                                    }}
                                    >
                                    {distance}
                                </Button>
                            )
                        })}
                    </Button.Group>
                </Form.Field>
            </div>
        </div>
    )
}

export default ButtonProcedureEditor