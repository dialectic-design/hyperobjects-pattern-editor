import React, { useContext } from 'react'
import {
    Card,
    Button
} from 'semantic-ui-react'
import { EditorContext } from 'components/PatternEditor/PatternEditor'
import Draggable from 'react-draggable';
import './simulation-settings.scss'

const SimulationSettings = ({
    simulation
}) => {
    const {
        editorUIState
    } = useContext(EditorContext)
    return (
        <div className='simulation-settings'>
            <Draggable>
                <Card>
                    <Card.Content>
                        <Button
                            size='tiny'
                            basic
                            circular
                            className='close-button'
                            floated='right' icon='close' onClick={() => editorUIState.setShowSettings(false)} />
                        <Card.Header>
                            Simulation
                        </Card.Header>
                    </Card.Content>
                    <Card.Content>
                        <Button size='tiny' icon={simulation.simulating ? "pause" : "play"}
                            onPointerDown={() => {
                                if(simulation.simulating) {
                                    simulation.pause()
                                } else {
                                    simulation.play()
                                }
                            }}
                            />
                    </Card.Content>
                    <Card.Content>
                        <Button size='tiny' onClick={() => simulation.resetMomentum()}>
                            Reset momentum
                        </Button>
                    </Card.Content>
                </Card>
            </Draggable>
        </div>
    )
}

export default SimulationSettings