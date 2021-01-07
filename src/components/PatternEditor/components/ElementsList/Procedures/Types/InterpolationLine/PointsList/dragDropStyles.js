export const grid = 3;
export const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "rgba(240,0,30,0.4)" : "rgba(255,255,255,0.2)",
    borderRadius: 3,
    border: isDraggingOver ? '1px solid #15232E' : '1px solid rgba(255,255,255,0.4)',
    padding: grid,
    paddingBottom: isDraggingOver ? grid + 12 : grid,
    width: 303
});



export const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",

    // change background colour if dragging
    background: isDragging ? "rgb(240,240,240)" : "rgba(255,255,255,0.7)",
    marginBottom: 2,
    marginTop: 2,
    borderRadius: 2,
    padding: 2,
    width: 295,
    pointerEvents: 'initial',
    // styles we need to apply on draggables
    ...draggableStyle
});