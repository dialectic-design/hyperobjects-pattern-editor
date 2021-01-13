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
                    <Card.Content>
                        <Button.Group size='tiny' style={{width: 88}}>
                            <Button icon='backward'
                                toggle
                                active={simulation.animateCamera === -1}
                                onClick={() => simulation.setAnimateCamera(-1)}
                                />
                            <Button icon='pause'
                                toggle
                                active={simulation.animateCamera === false}
                                onClick={() => simulation.setAnimateCamera(false)}
                                />
                            <Button icon='forward'
                                toggle
                                active={simulation.animateCamera === 1}
                                onClick={() => simulation.setAnimateCamera(1)}
                                />
                        </Button.Group>
                        <br />
                        <br />
                        <Button.Group size='tiny' style={{width: 88}}>
                            <Button
                                toggle
                                active={simulation.cameraAnimationSpeed === 1}
                                onClick={() => simulation.setCameraAnimationSpeed(1)}
                                >
                                1x
                            </Button>
                            <Button
                                toggle
                                active={simulation.cameraAnimationSpeed === 2}
                                onClick={() => simulation.setCameraAnimationSpeed(2)}
                                >
                                2x
                            </Button>
                            <Button
                                toggle
                                active={simulation.cameraAnimationSpeed === 3}
                                onClick={() => simulation.setCameraAnimationSpeed(3)}
                                >
                                3x
                            </Button>
                        </Button.Group>
                    </Card.Content>
                </Card>
            </Draggable>
        </div>
    )
}

export default SimulationSettings