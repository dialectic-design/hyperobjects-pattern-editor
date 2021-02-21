import React, { useContext } from 'react'
import { EditorContext } from 'components/PatternEditor/PatternEditor'
import {
    Select,
    Checkbox,
    Message,
    Button
} from 'semantic-ui-react'
import _ from 'lodash'
import { CompactPicker } from 'react-color'
import { mirrorPointTypes, mirrorAxes, mirrorPointSelectedPoint } from 'components/PatternEditor/procedures/types/mirrorShape'

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
            <h4>Axis</h4>
            <Button.Group size="tiny">
                {_.keys(mirrorAxes).map(axis => {
                    return (
                        <Button key={axis}
                            toggle
                            active={_.get(description, 'mirrorAxis', false) === axis}
                            onClick={() => {
                                actions.updateProcedure({...procedure,
                                    procedure: {...description, mirrorAxis: axis}
                                })
                            }}
                            >
                            {axis}
                        </Button>
                    )
                })}
            </Button.Group>
            <h4>Mirror on</h4>
            <Button.Group size="tiny" vertical>
                {mirrorPointTypes.map(type => {
                    return (
                        <Button key={type}
                            toggle
                            active={_.get(description, 'mirrorPointType', false) === type}
                            onClick={() => {
                                actions.updateProcedure({...procedure,
                                    procedure: {...description, mirrorPointType: type}
                                })
                            }}
                            >
                            {type}
                        </Button>
                    )
                })}
            </Button.Group>
            {_.get(description, 'mirrorPointType', false) === mirrorPointSelectedPoint && (
                <React.Fragment>
                <h4>Select a point</h4>
                <Select
                    placeholder="select point"
                    value={_.get(description, 'mirrorPoint', false)}
                    options={modelData.editableGeometriesList.map((g) => {
                        return {
                            key: g,
                            value: g,
                            text: g
                        }
                    })}
                    />
                </React.Fragment>
            )}
            <div className='settings'>
                <Checkbox
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