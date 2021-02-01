import React, { useEffect, useRef, useState } from 'react'
import _ from 'lodash'
import { Button } from 'semantic-ui-react'
import Sizing from './Sizing'
import Fabrication from './Fabrication'
import Construction from './Construction'
import './expanded-display.scss'

const sizing = 'sizing'
const fabrication = 'fabrication'
const construction = 'construction'

const modes = [
    sizing,
    fabrication,
    construction
]

const ExpandedDisplay = ({ model, pattern, modelData }) => {
    const [selectedMode, setSelectedMode] = useState(sizing)
    const [inputs, setInputs] = useState(false)
    useEffect(() => {
        if(inputs === false) {
            setInputs(model.inputs)
        } else {
            model.inputs = inputs
        }
    }, [model])
    return (
        <div className='pattern-display-expanded'>
            <div className='mode-selector'>
                <Button.Group size='small' basic toggle>
                    {modes.map((mode, i) => {
                        return (
                            <Button
                                key={mode}
                                onPointerDown={() => setSelectedMode(mode)}
                                active={mode === selectedMode}
                                >
                                {i + 1}. {mode}
                            </Button>
                        )
                    })}
                </Button.Group>
            </div>
            {selectedMode === sizing && (
                <Sizing model={model} inputs={inputs} setInputs={setInputs} />
            )}
            {selectedMode === fabrication && (
                <Fabrication model={model} pattern={pattern} modelData={modelData}  inputs={inputs} setInputs={setInputs} />
            )}
            {selectedMode === construction && (
                <Construction model={model} pattern={pattern} modelData={modelData}  inputs={inputs} setInputs={setInputs} />
            )}
        </div>
    )
}

export default ExpandedDisplay