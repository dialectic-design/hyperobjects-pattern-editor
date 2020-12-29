import { EditorContext } from 'components/PatternEditor/PatternEditor'
import React, { useContext } from 'react'
import EditorContext from '../../PatternEditor'

const LayoutView = () => {
    const { pattern, modelData, actions } = useContext(EditorContext)
    return (
        <div className='layout-view'>
            Layout view
        </div>
    )
}

export default LayoutView