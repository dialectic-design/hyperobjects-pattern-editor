import React, { useState, useContext } from 'react'
import { EditorContext } from 'components/PatternEditor/PatternEditor'
import {
    Select,
    Button
} from 'semantic-ui-react'

const AddPointForm = React.memo(({ procedure }) => {
    const { modelData, actions } = useContext(EditorContext)
    const [addPath, setAddPath] = useState(false)
    const description = procedure.procedure
    return (
        <div className='add-point-form'>
            <Select
                placeholder='select path'
                value={addPath}
                onChange={(e, data) => setAddPath(data.value)}
                options={modelData.editableGeometriesList.map((g) => {
                    return {
                        key: g,
                        value: g,
                        text: g
                    }
                })}
                />
            <Button
                size='mini'
                disabled={!addPath}
                onClick={() => {
                    actions.updateProcedure({...procedure,
                        procedure: {...description, geometries: description.geometries.concat([{path: addPath, curvePoint: false}])}
                    })
                }}
                >
                Add point
            </Button>
        </div>
    )
})

export default AddPointForm