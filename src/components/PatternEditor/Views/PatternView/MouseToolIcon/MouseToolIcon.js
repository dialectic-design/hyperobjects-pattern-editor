import React from 'react'
import _ from 'lodash'
import './mouse-tool-icon.scss'
import {
    Icon
} from 'semantic-ui-react'
import useMouse from '@react-hook/mouse-position'

import { tools } from '../PatternView'

const MouseToolIcon = ({ tool, containerRef }) => {
    const mouse = useMouse(containerRef.current, {
        enterDelay: 10,
        leaveDelay: 10,
    })
    const x = _.get(mouse, 'x', 0)
    const y = _.get(mouse, 'y', 0)
    return (
            <div className='mouse-icon-container'>
                {mouse.isOver && (
                    <React.Fragment>
                        <div style={{left: x, top: y}} className='mouse-tool-icon'>
                            {tool === tools.remove && (
                                <Icon name='remove' />
                            )}
                            {tool === tools.add && (
                                <Icon name='pencil' />
                            )}
                            </div>
                    </React.Fragment>
                )}
                
            </div>
    )
}

export default MouseToolIcon