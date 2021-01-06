import React from 'react'
import {
    Button
} from 'semantic-ui-react'

const OrderControls = React.memo(({
    index,
    total,
    actions
}) => {
    return (
        <div className='change-index-order-controls'>
            <Button
                disabled={index === 0}
                onPointerDown={(e) => {
                    actions.moveGeometryKeyUp(index)
                    e.preventDefault()
                }}
                size='mini'
                icon="arrow up"
                className='left' />

            <Button
                disabled={index === total - 1}
                onPointerDown={(e) => {
                    actions.moveGeometryKeyDown(index)
                    e.preventDefault()
                }}
                size='mini'
                icon="arrow down"
                className='left' />
        </div>
    )
}, (prev, next) => {
    return next.index === prev.index
})

export default OrderControls