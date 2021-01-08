import React, { useState, useContext } from 'react'
import { EditorContext } from 'components/PatternEditor/PatternEditor'
import { Draggable } from 'react-beautiful-dnd'
import { List, Button } from 'semantic-ui-react'
import { getItemStyle } from './dragDropStyles'
import OrderControls from './OrderControls'
import _ from 'lodash'
import CurvePointSelector from './CurvePointSelector'

const PointRow = ({
    procedure,
    geometry,
    i,
    a
}) => {
    return (
        <Draggable key={geometry.key} draggableId={`point-id-${i}`} index={i}>
            {(provided, snapshot) => {
                return (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                        >
                        <DraggableContent
                            isDragging={snapshot.isDragging}
                            procedure={procedure}
                            geometry={geometry}
                            i={i}
                            a={a}
                            />
                    </div>
                )
            }}
        </Draggable>
    )
}

const DraggableContent = React.memo(({
    procedure,
    geometry,
    i,
    a
}) => {
    const { actions } = useContext(EditorContext)
    const [showCurvePointSelector, setShowCurvePointSelector] = useState(false)

    const description = procedure.procedure
    let c1 = _.get(geometry, 'curvePoint1', false)
    let c2 = _.get(geometry, 'curvePoint2', false)
    return (
        <List.Item className='draggable-list-item'>
            <List.Content className='list-content'>
                <div className='point-row-content'>
                    <div className='left-content'>
                        <OrderControls
                            index={i}
                            total={description.geometries.length}
                            procedure={procedure}
                            actions={actions}
                            />
                        <p>
                            {geometry.path}
                        </p>
                        {[c1, c2].every(p => p === false) && (
                            <Button onClick={() => setShowCurvePointSelector(!showCurvePointSelector)}
                                size='tiny' floated='right' basic className='add-curve-point right'>
                                add curve points
                            </Button>
                        )}
                    </div>
                    <div className='right-content'>
                        <Button
                            icon="trash"
                            onClick={(e) => {
                                actions.updateProcedure({...procedure,
                                    procedure: {...description, geometries: description.geometries.filter((g, _i) => _i !== i)}
                                })
                                e.preventDefault()
                            }}
                            size='mini'
                            className='edit-button'
                            floated='right'
                            />
                    </div>
                </div>
                {(showCurvePointSelector || [c1, c2].some(p => p)) && (
                    <CurvePointSelector
                        procedure={procedure}
                        geometry={geometry}
                        geometryIndex={i}
                        />
                    )}
            </List.Content>
        </List.Item>
    )
}, (prev, next) => {
    if(prev.i !== next.i) {
        return false
    }
    if(prev.geometry.path !== next.geometry.path) {
        return false
    }
    if(!_.isEqual(prev.procedure.procedure, next.procedure.procedure)) {
        return false
    }
    return true
})

export default PointRow