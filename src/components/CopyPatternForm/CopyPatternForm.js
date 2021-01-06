import React, { useState, useContext } from 'react'
import { PatternContext, UIContext } from 'App'
import {
    Select,
    Button
} from 'semantic-ui-react'
import _ from 'lodash'

const CopyPatternForm = ({ pattern, model }) => {
    const patternContext = useContext(PatternContext)
    const uiState = useContext(UIContext)
    const [selectedCopyPatternIndex, setSelectedCopyPatternIndex] = useState(false)

    const patternsByUser = _.get(patternContext, 'list', [])
    var modelHasElements = false
    if(model.editableGeometriesList.length > 0) {
        modelHasElements = true
    } else if(model.proceduresList.length > 0) {
        modelHasElements = true
    } else if(model.inputsList.length > 0) {
        modelHasElements = true
    }
    return (
        <div className='copy-pattern-form'>
            <h3>Copy pattern</h3>
            {modelHasElements ? (
                <p>Model already has elements in it, cant be copied into now.</p>
            ) : (
                <div>
                    <p>Select a pattern and copy it to this pattern.</p>
                    <Select
                        placeholder="select a pattern to copy"
                        options={patternsByUser.map((pattern, i) => {
                            return {
                                key: pattern.name,
                                value: i,
                                text: pattern.name
                            }
                        })}
                        size="tiny"
                        style={{width: '100%', marginBottom: 5}}
                        value={selectedCopyPatternIndex}
                        onChange={(e, data) => {
                            console.log(data)
                            setSelectedCopyPatternIndex(data.value)
                        }}
                        />
                    <Button
                        size="tiny"
                        onClick={() => {
                            const patternToCopy = patternsByUser[selectedCopyPatternIndex]
                            var patternJsonToCopy = patternToCopy.patternJson
                            patternContext.actions.updatePattern({
                                ...pattern,
                                patternJson: patternJsonToCopy
                            })
                            uiState.setRefreshSelectedPattern(true)
                        }}
                        >
                        Copy pattern
                    </Button>
                </div>
            )}
        </div>
    )
}

export default CopyPatternForm