import React, { useState, useEffect } from 'react'

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

    console.log(mode, ' - ', patternId)

    useEffect(() => {

    })
    return (
        <div className='embed-page'>
            <h1>Embed page</h1>
        </div>
    )
}

export default EmbedPage