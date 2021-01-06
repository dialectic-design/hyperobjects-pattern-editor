import { Button, Icon, Form } from 'semantic-ui-react'
import { tools } from '../PatternView'
const ToolsPanel = ({
    tool,
    setTool
}) => {
    return (
        <div className='tools-panel'>
            <Form.Field>
                <Button size='tiny'
                    toggle active={tool === tools.move}
                    onClick={() => {
                        setTool(tools.move)
                    }}
                    >
                    <Icon name='move' />
                    <p className='tooltip'>Move points</p>
                </Button>
            </Form.Field>
            <Form.Field>
                <Button
                    size='tiny' toggle active={tool === tools.add}
                    onClick={() => {
                        if(tool === tools.add) {
                            setTool(tools.move)
                        } else {
                            setTool(tools.add)
                        }
                    }}
                    >
                    <Icon name='pencil' />
                    <p className='tooltip'>Add points</p>
                </Button>
            </Form.Field>
            <Form.Field>
                <Button
                    size='tiny' toggle active={tool === tools.remove}
                    onClick={() => {
                        if(tool === tools.remove) {
                            setTool(tools.move)
                        } else {
                            setTool(tools.remove)
                        }
                    }}
                    >
                    <Icon name='remove' />
                    <p className='tooltip'>Remove points</p>
                </Button>
            </Form.Field>
        </div>
    )
}

export default ToolsPanel