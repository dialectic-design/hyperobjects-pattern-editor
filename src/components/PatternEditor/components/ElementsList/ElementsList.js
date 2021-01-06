import React from 'react'
import Inputs from './Inputs'
import Geometries from './Geometries'
import "./elements-list.scss"

const ElementsList = () => {
    return (
        <div className='elements-list'>
            <Inputs />
            <Geometries />
        </div>
    )
}

export default ElementsList