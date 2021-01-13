import React, { useContext } from 'react'
import { EditorContext } from 'components/PatternEditor/PatternEditor'
import {
    Select,
    Input,
    Form,
    Checkbox
} from 'semantic-ui-react'
import _ from 'lodash'
import { types } from 'components/PatternEditor/procedures/types'
import cleanFloatInput from 'utils/cleanFloatInput'

const seamableProcedureTypes = [
    types.interpolationLine.type,
    types.mirrorShape.type
]

const SeamProcedureEditor = ({ procedure }) => {
    const { modelData, actions } = useContext(EditorContext)
    const seamableProcedures = _.get(modelData, '_procedures', [])
        .filter(p => seamableProcedureTypes.includes(p.procedure.type))
        .map(p => {
            return {
                type: 'procedure',
                key: p.name
            }
        })
    const description = procedure.procedure
    let selectedIndexPatch1 = _.findIndex(seamableProcedures, p => (p.key === _.get(description, 'patch1' ,false)))
    let selectedIndexPatch2 = _.findIndex(seamableProcedures, p => (p.key === _.get(description, 'patch2' ,false)))
    return (
        <div className='seam-procedure-editor'>
            <p className='type-label'>seam</p>
            <div className='ui form'>
                <Form.Field>
                    <label>Patch 1</label>
                    <Select
                        placeholder="select an element for the seam"
                        options={seamableProcedures.map((input, i) => {
                            return {
                                key: `${input.key} - ${input.type}`,
                                value: i,
                                text: `${input.key} - ${input.type}`
                            }
                        })}
                        value={selectedIndexPatch1}
                        onChange={(e, data) => {
                            let patchKey = seamableProcedures[data.value].key
                            actions.updateProcedure({...procedure,
                                procedure: {...description, patch1: patchKey }
                            })
                        }}
                        />
                </Form.Field>
                <Form.Field>
                    <label>Segment 1</label>
                    <Input
                        type="number"
                        size="mini"
                        value={_.get(description, 'segment1Index', 0)}
                        onChange={(e) => {
                            actions.updateProcedure({...procedure,
                                procedure: {...description, segment1Index: parseInt(e.target.value) }
                            })
                        }}
                        />
                </Form.Field>
                <hr />
                <Form.Field>
                    <label>Patch 2</label>
                    <Select
                        placeholder="select an element for the seam"
                        options={seamableProcedures.map((input, i) => {
                            return {
                                key: `${input.key} - ${input.type}`,
                                value: i,
                                text: `${input.key} - ${input.type}`
                            }
                        })}
                        value={selectedIndexPatch2}
                        onChange={(e, data) => {
                            let patchKey = seamableProcedures[data.value].key
                            actions.updateProcedure({...procedure,
                                procedure: {...description, patch2: patchKey }
                            })
                        }}
                        />
                </Form.Field>
                <Form.Field>
                    <label>Segment 2</label>
                    <Input
                        type="number"
                        size="mini"
                        value={_.get(description, 'segment2Index', 0)}
                        onChange={(e) => {
                            actions.updateProcedure({...procedure,
                                procedure: {...description, segment2Index: parseInt(e.target.value) }
                            })
                        }}
                        />
                </Form.Field>
                <hr />
                <Form.Field>
                    <label>Simulation strength</label>
                    <Input
                        size="mini"
                        value={_.get(description, 'springStrength', 0)}
                        onChange={(e) => {
                            actions.updateProcedure({...procedure,
                                procedure: {...description, springStrength: cleanFloatInput(e.target.value) }
                            })
                        }}
                        />
                </Form.Field>
                <Form.Field>
                    <Checkbox
                        checked={_.get(description, 'flipDirection', false)}
                        onChange={() => {
                            actions.updateProcedure({...procedure,
                                procedure: {...description, flipDirection: !_.get(description, 'flipDirection', false) }
                            })
                        }}
                        label="flip direction" />
                </Form.Field>
            </div>
        </div>
    )
}

export default SeamProcedureEditor