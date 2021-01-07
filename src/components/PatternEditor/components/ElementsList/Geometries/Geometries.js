import React, { useContext, createContext, useState } from 'react'
import { getListStyle } from './dragDropStyles'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import {
    List
} from 'semantic-ui-react'
import { EditorContext } from 'components/PatternEditor/PatternEditor'
import Geometry from './Geometry'
import NewGeometryPopUp from './NewGeometryPopUp'

export const GeometriesListContext = createContext()

const Geometries = () => {
    const { modelData, actions } = useContext(EditorContext)
    const [showEditElementPopUp, setShowEditElementPopUp] = useState(false)
    const geometries = modelData.editableGeometriesList.map(key => {
        return {
            key: key,
            geometry: modelData.geometries[key]
        }
    })
    const geometriesListUI = {
        showEditElementPopUp,
        setShowEditElementPopUp
    }
    return (
        <GeometriesListContext.Provider value={geometriesListUI}>
        <div className='geometries draggable-list'>
            <h3>Geometries</h3>
            <div>
                <DragDropContext onDragEnd={(result) => {
                    actions.moveGeometry(result.source.index, result.destination.index)
                }}>
                    <List>
                        <Droppable droppableId="geometries-droppable">
                            {(provided, snapshot) => {
                                return (
                                    <div {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}
                                        >
                                        {geometries.map((geometry, i, a) => {
                                            return (
                                                <Geometry
                                                    key={i}
                                                    isDraggingList={snapshot.isDraggingOver}
                                                    geometry={geometry}
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
            </div>
            <NewGeometryPopUp />
        </div>
        </GeometriesListContext.Provider>
    )
}

export default Geometries