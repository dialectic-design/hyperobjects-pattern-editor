import React, { useContext } from 'react'
import { List, Button } from 'semantic-ui-react'
import { Draggable } from 'react-beautiful-dnd'
import { getItemStyle } from './dragDropStyles'
import OrderControls from './OrderControls'
import { EditorContext } from 'components/PatternEditor/PatternEditor'
import { GeometriesListContext } from './Geometries'
import EditElementPopUp from './EditElementPopUp'

const Geometry = ({
    geometry,
    i,
    a
}) => {
    return (
        <Draggable key={geometry.key} draggableId={`id-${geometry.key}`} index={i}>
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
    isDragging,
    geometry,
    i,
    a
}) => {
    const {
        actions,
        selectedElement,
        setSelectedElement,
        hoveredElement,
        setHoveredElement
    } = useContext(EditorContext)
    const list = useContext(GeometriesListContext)
    var classname = 'geometry draggable-list-item'
    if(selectedElement === geometry.key) {
        classname += ' selected'
    }
    if(hoveredElement === geometry.key) {
        classname += ' hovered'
    }
    return (
        <List.Item className={classname}>
            <div className='select-div' onClick={() => {
                if(isDragging === false) {
                    if(selectedElement !== geometry.key) {
                        setSelectedElement(geometry.key)
                    } else {
                        setSelectedElement(false)
                    }
                }
                
            }}
            onPointerEnter={() => {
                if(isDragging === false) {
                    setHoveredElement(geometry.key)
                }
                
            }}
            onPointerLeave={() => {
                setHoveredElement(false)
            }}>
            </div>
            <List.Content className='list-content'>
                <div className='left-content'>
                    <OrderControls
                        index={i}
                        total={a.length}
                        actions={actions}
                        />
                    <p>
                        {geometry.key}
                    </p>
                </div>
                <div className='right-content'>
                    <Button
                        icon="trash"
                        onClick={(e) => {
                            actions.removeGeometry(geometry.key)
                            e.preventDefault()
                        }}
                        size='mini'
                        className='edit-button'
                        floated='right'
                        />
                    <Button
                        size='mini'
                        className='edit-button'
                        floated='right'
                        onClick={() => {
                            if(list.showEditElementPopUp === geometry.key) {
                                list.setShowEditElementPopUp(false)
                            } else {
                                list.setShowEditElementPopUp(geometry.key)
                            }
                        }}
                        >
                        Edit
                    </Button>
                </div>
            </List.Content>
            {list.showEditElementPopUp === geometry.key && (
                <EditElementPopUp
                    geometry={geometry}
                    />
            )}
        </List.Item>
    )
}, (prev, next) => {
    if(prev.i !== next.i) {
        return false
    }
    if(prev.geometry.key !== next.geometry.key) {
        return false
    }
    if(prev.geometry.geometry.closed !== next.geometry.geometry.closed) {
        return false
    }
    return true
})


export default Geometry