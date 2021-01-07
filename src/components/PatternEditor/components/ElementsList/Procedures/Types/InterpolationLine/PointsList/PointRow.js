import { EditorContext } from 'components/PatternEditor/PatternEditor'
import React, { useContext } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { List, Button } from 'semantic-ui-react'
import { getItemStyle } from './dragDropStyles'
import OrderControls from './OrderControls'
import _ from 'lodash'

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
    const description = procedure.procedure
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