import React, { useContext, useState } from 'react'
import {
    Card,
    Button,
    Icon,
    Form,
    Input
} from 'semantic-ui-react'
import { EditorContext } from 'components/PatternEditor/PatternEditor'
import { GeometriesListContext } from './Geometries'

const EditElementPopUp = ({
    geometry
}) => {
    const [newName, setNewName] = useState(geometry.key)
    const { actions } = useContext(EditorContext)
    const list = useContext(GeometriesListContext)
    console.log(geometry.geometry.closedPath)
    return (
        <Card className='edit-element-pop-up'>
            <Card.Content>
                <Button
                    className='close-button'
                    tiny
                    onClick={() => list.setShowEditElementPopUp(false)}
                    >
                    <Icon name='close'  />
                </Button>
                <p>
                    Edit <strong>{geometry.key}</strong>
                </p>
                
                <div className='ui form'>
                    <Form.Field>
                    <label>Name</label>
                    <Input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className={newName !== geometry.key ? "changed" : " "}
                        />
                    </Form.Field>
                    <Button
                        disabled={newName === geometry.key}
                        size="tiny"
                        onClick={() => {
                            actions.renameGeometry(geometry.key, newName)
                        }}
                        >
                        Update name
                    </Button>
                </div>
            </Card.Content>
            <Card.Content>
                <Button.Group basic>
                <Button
                        toggle
                        active={geometry.geometry.closedPath}
                        onClick={() => {
                            actions.updateGeometry({
                                ...geometry.geometry,
                                closedPath: !geometry.geometry.closedPath
                            })
                        }}
                        >
                        Closed
                    </Button>
                    <Button
                        toggle
                        active={!geometry.geometry.closedPath}
                        onClick={() => {
                            actions.updateGeometry({
                                ...geometry.geometry,
                                closedPath: !geometry.geometry.closedPath
                            })
                        }}
                        >
                        Open
                    </Button>
                </Button.Group>
            </Card.Content>
        </Card>
    )
}

export default EditElementPopUp