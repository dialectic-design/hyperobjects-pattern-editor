import React from 'react'
import Inputs from './Inputs'
import Geometries from './Geometries'
import Procedures from './Procedures'
import "./elements-list.scss"
import './draggable-lists.scss'

const ElementsList = () => {
    return (
        <div className='elements-list'>
            <Inputs />
            <Geometries />
            <Procedures />
        </div>
    )
}

export default ElementsList