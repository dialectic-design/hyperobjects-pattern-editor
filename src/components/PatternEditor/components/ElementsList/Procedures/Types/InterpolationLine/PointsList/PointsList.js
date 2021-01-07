import React, { useContext } from 'react'
import { EditorContext } from 'components/PatternEditor/PatternEditor'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { getListStyle } from './dragDropStyles'
import PointRow from './PointRow'
import { List } from 'semantic-ui-react'
import AddPointForm from './AddPointForm'
import array_move from 'utils/array_move'

const PointsList = React.memo(({ procedure }) => {
    const { actions } = useContext(EditorContext)
    const description = procedure.procedure
    return (
        <div className='points-list draggable-list'>
            <DragDropContext onDragEnd={(result) => {
                var geometries = array_move(description.geometries, result.source.index, result.destination.index)
                actions.updateProcedure({...procedure,
                    procedure: {...description, geometries: geometries}
                })
            }}
            >
                <List>
                    <Droppable droppableId={`interpolation-line-points-droppable-${procedure.name}`}>
                        {(provided, snapshot) => {
                            return (
                                <div {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                                >
                                    {procedure.procedure.geometries.map((geometry, i, a) => {
                                        return (
                                            <PointRow
                                                procedure={procedure}
                                                geometry={geometry}
                                                key={i}
                                                i={i}
                                                a={a}
                                                />
                                        )
                                    })}
                                    {provided.placeholder}
                                </div>
                            )
                        }}
                    </Droppable>
                </List>
            </DragDropContext>
            <AddPointForm procedure={procedure} />
        </div>
    )
})

export default PointsList