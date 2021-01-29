import React, { useState, useEffect, useMemo } from 'react'
import { generateProcedures } from 'components/PatternEditor/procedures'
import parsePatternFromJsonString from 'components/PatternEditor/utils/parsePatternFromJsonString'
import {
    Model,
} from '@dp50mm/hyperobjects-language'
import Display from './Modes/Display'
import _ from 'lodash'

export const EDITOR_MODE = 'EDITOR'
export const LAYOUT_MODE = 'LAYOUT'
export const SIMULATION_MODE = 'SIMULATION'

const modes = [
    EDITOR_MODE,
    LAYOUT_MODE,
    SIMULATION_MODE
]

const EmbedPage = () => {
    const [loadingData, setLoadingData] = useState(false)
    const [patternData, setPatternData] = useState(false)
    const [loadingError, setLoadingError] = useState(false)
    
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)

    const patternId = urlParams.get("pattern")
    const mode = urlParams.get('mode')


    useEffect(() => {
        if(!_.isNull(patternId) && loadingData === false && patternData === false) {
            setLoadingData(true)
            var fetchUrl = false
            if(window.location.hostname.includes('localhost')) {
                fetchUrl = `http://localhost:5000/pattern/embed/${patternId}`
            } else {
                fetchUrl = `https://api.hyperobjects.design/pattern/embed/${patternId}`
            }
            fetch(fetchUrl)
                .then(resp => {
                    console.log(resp)
                    if(resp.status === 200) {
                            resp.json().then(pattern => {
                                setPatternData({
                                    ...pattern,
                                    construction: JSON.parse(_.get(pattern, 'construction', '{}')),
                                    fabrication: JSON.parse(_.get(pattern, 'fabrication', '{}'))
                                })
                            })
                    } else {
                        setLoadingError(true)
                    }
                }).catch(error => {
                    console.log(error)
                })
        }
    }, [patternId, loadingData, patternData])
    if(loadingError) {
        return (
            <p>Loading error</p>
        )
    }
    if(!modes.includes(mode)) {
        return (
            <p>Unspecified mode</p>
        )
    }
    if(patternData === false) {
        return (
            <p>Loading</p>
        )
    }
    

    return (
        <div className='embed-page'>
            {_.isNull(mode) && (
                <p>Set a mode in the url.</p>
            )}
            {_.isNull(patternId) && (
                <p>Set a pattern in the url.</p>
            )}
            {patternData && (
                <React.Fragment>
                    <p style={{
                        position: 'absolute',
                        top: 5, left: 10,
                        fontSize: 10,
                        opacity: 0.5, zIndex: 2000,
                        }}>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={`https://pattern.hyperobjects.design/embed/?pattern=${patternId}&mode=${mode}`}
                            >
                            open full screen
                        </a>
                    </p>
                    <ParsedModel patternData={patternData} mode={mode} />
                </React.Fragment>
                
            )}
        </div>
    )
}

const ParsedModel = ({
    patternData,
    mode
}) => {
    var parsedModelData = parsePatternFromJsonString(patternData.patternJson)
    parsedModelData.procedures = generateProcedures(_.get(parsedModelData, '_procedures'), [])
    var model = useMemo(() => {
        return new Model(patternData.name)
    }, [patternData])
    
    model.importModel(parsedModelData)
    return (
        <div className='parsed-model'>
            
        {mode === EDITOR_MODE && (
            <Display model={model} />
        )}
        </div>
    )
}

export default EmbedPage