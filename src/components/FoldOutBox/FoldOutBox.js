import React, { useState } from 'react'

const FoldOutBox = ({
    title,
    children
}) => {
    var iconStyle = {
        transform: 'rotate(0)'
    }
    return (
        <div className='fold-out-box'>
            <h4>{title} <Icon /></h4>
            <div className='fold-out-container'>
                {children}
            </div>
        </div>
    )
}