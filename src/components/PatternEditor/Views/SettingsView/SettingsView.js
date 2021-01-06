import React, { useContext } from 'react'
import { EditorContext } from '../../PatternEditor'

const SettingsView = () => {
    const editor = useContext(EditorContext)
    console.log(editor)
    return (
        <div className='settings-view'>
            <h2>Pattern settings</h2>
        </div>
    )
}

export default SettingsView