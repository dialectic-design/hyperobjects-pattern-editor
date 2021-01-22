import React, { useContext } from 'react'
import { EditorContext } from 'components/PatternEditor/PatternEditor'
import {
    Select,
    Checkbox,
    Message
} from 'semantic-ui-react'
import _ from 'lodash'
import { CompactPicker } from 'react-color'


const MirrorShape = ({ procedure }) => {
    const { modelData, actions } = useContext(EditorContext)
    let selectableProcedures = modelData._procedures.map(p => {
        return {
            type: 'procedure',
            key: p.name
        }
    })
    const description = procedure.procedure
    let selectedIndex = _.findIndex(selectableProcedures, p => (p.key === _.get(description, 'source.key' ,false)))
    return (
        <div className='mirror-shape-editor'>
            <p className='type-label'>mirror-shape</p>
            <Select
                placeholder="select an element to mirror"
                options={selectableProcedures.map((input, i) => {
                    return {
                        key: `${input.key} - ${input.type}`,
                        value: i,
                        text: `${input.key} - ${input.type}`
                    }
                })}
                value={selectedIndex}
                onChange={(e, data) => {
                    let input = selectableProcedures[data.value]
                    actions.updateProcedure({...procedure,
                        procedure: {...description, source: input }
                    })
                }}
                />
            {procedure.name === _.get(description, 'source.key', false) && (
                <Message negative size='tiny'>Can't mirror itself!</Message>
            )}
            <div className='settings'>
                <Checkbox
                    style={{marginLeft: 10}}
                    checked={_.get(description, 'simulate', false)}
                    onChange={() => {
                        actions.updateProcedure({...procedure,
                            procedure: {...description, simulate: !_.get(description, 'simulate', false)}
                        })
                    }}
                    label="simulate" />
            </div>
            <h4>Color</h4>
            <div className='procedure-color-picker'>
            <CompactPicker
                onChangeComplete={(color) => {
                    actions.updateProcedure({
                        ...procedure,
                        procedure: {
                            ...description,
                            color: color.hex
                        }
                    })
                }}
                />
            </div>
        </div>
    )
}

export default MirrorShape