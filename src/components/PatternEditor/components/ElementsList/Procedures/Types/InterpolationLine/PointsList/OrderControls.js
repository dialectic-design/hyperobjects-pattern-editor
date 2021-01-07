import React from 'react'
import {
    Button
} from 'semantic-ui-react'
import array_move from 'utils/array_move'
import _ from 'lodash'

const OrderControls = React.memo(({
    procedure,
    index,
    total,
    actions
}) => {
    const description = procedure.procedure

    return (
        <div className='change-index-order-controls'>
            <Button
                disabled={index === 0}
                onPointerDown={(e) => {
                    var geometries = array_move(description.geometries, index, index - 1)
                    actions.updateProcedure({...procedure,
                        procedure: {...description, geometries: geometries}
                    })
                    e.preventDefault()
                }}
                size='mini'
                icon="arrow up"
                className='left' />

            <Button
                disabled={index === total - 1}
                onPointerDown={(e) => {
                    var geometries = array_move(description.geometries, index, index + 1)
                    actions.updateProcedure({...procedure,
                        procedure: {...description, geometries: geometries}
                    })
                    e.preventDefault()
                }}
                size='mini'
                icon="arrow down"
                className='left' />
        </div>
    )
}, (prev, next) => {
    if(prev.index !== next.index) {
        return false
    }
    if(!_.isEqual(prev.procedure.procedure, next.procedure.procedure)) {
        return false
    }
    return true
})

export default OrderControls