import React, { useState } from 'react'
import {
    Button
} from 'semantic-ui-react'
import './fold-out-box.scss'

const FoldOutBox = ({
    title,
    children
}) => {
    const [showing, setShowing] = useState(false)
    return (
        <div className='fold-out-box'>
            <h4>{title}</h4>
            <Button
                size="tiny"
                onPointerDown={() => setShowing(!showing)}
                icon={showing ? 'angle up' : 'angle down'}
                className='show-editor-button-toggle'
                basic
                />
            {showing && (
                <div className='fold-out-container'>
                    {children}
                </div>
            )}
            
        </div>
    )
}

export default FoldOutBox