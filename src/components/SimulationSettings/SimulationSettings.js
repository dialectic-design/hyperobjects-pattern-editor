import React, { useContext, useState } from 'react'
import {
    Card,
    Button,
    Input
} from 'semantic-ui-react'
import { EditorContext } from 'components/PatternEditor/PatternEditor'
import Draggable from 'react-draggable';
import {CompactPicker} from 'react-color'
import './simulation-settings.scss'

const SimulationSettings = ({
    simulation
}) => {
    const [particleStepSize, setParticleStepSize] = useState(simulation.particleStepSize)
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
                        <Button size='tiny' onPointerDown={() => simulation.resetMomentum()}>
                            Reset momentum
                        </Button>
                    </Card.Content>
                    <Card.Content>
                        <Input
                            label="particle step size"
                            value={particleStepSize}
                            onChange={(e) => {setParticleStepSize(e.target.value)}}
                            size="mini"
                            />
                        <br />
                        <Button
                            active={particleStepSize !== simulation.particleStepSize}
                            onPointerDown={() => simulation.updateParticleStepSize(parseInt(particleStepSize))}
                            size="tiny"
                            >
                            Update step size
                        </Button>
                        <br /><br />
                        <p>Preset step sizes</p>
                        <Button.Group size='tiny' style={{width: 88}}>
                            <Button
                                onPointerDown={() => {
                                    setParticleStepSize(20)
                                    simulation.updateParticleStepSize(20)
                                }}
                                >
                                20
                            </Button>
                            <Button
                                onPointerDown={() => {
                                    setParticleStepSize(30)
                                    simulation.updateParticleStepSize(30)
                                }}
                                >
                                30
                            </Button>
                            <Button
                                onPointerDown={() => {
                                    setParticleStepSize(40)
                                    simulation.updateParticleStepSize(40)
                                }}
                                >
                                40
                            </Button>
                        </Button.Group>
                    </Card.Content>
                    <Card.Content>
                        <Button.Group size='tiny' style={{width: 88}}>
                            <Button icon='backward'
                                toggle
                                active={simulation.animateCamera === -1}
                                onPointerDown={() => simulation.setAnimateCamera(-1)}
                                />
                            <Button icon='pause'
                                toggle
                                active={simulation.animateCamera === false}
                                onPointerDown={() => simulation.setAnimateCamera(false)}
                                />
                            <Button icon='forward'
                                toggle
                                active={simulation.animateCamera === 1}
                                onPointerDown={() => simulation.setAnimateCamera(1)}
                                />
                        </Button.Group>
                        <br />
                        <br />
                        <Button.Group size='tiny' style={{width: 88}}>
                            <Button
                                toggle
                                active={simulation.cameraAnimationSpeed === 1}
                                onPointerDown={() => simulation.setCameraAnimationSpeed(1)}
                                >
                                1x
                            </Button>
                            <Button
                                toggle
                                active={simulation.cameraAnimationSpeed === 2}
                                onPointerDown={() => simulation.setCameraAnimationSpeed(2)}
                                >
                                2x
                            </Button>
                            <Button
                                toggle
                                active={simulation.cameraAnimationSpeed === 3}
                                onPointerDown={() => simulation.setCameraAnimationSpeed(3)}
                                >
                                3x
                            </Button>
                        </Button.Group>
                    </Card.Content>
                    <Card.Content>
                        <CompactPicker
                            onChangeComplete={(color) => {
                                simulation.setBackgroundColor(color.hex)
                            }}
                            />
                    </Card.Content>
                </Card>
            </Draggable>
        </div>
    )
}

export default SimulationSettings