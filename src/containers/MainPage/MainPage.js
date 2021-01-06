import React, { useState, useContext } from 'react'
import PatternEditor from 'components/PatternEditor'
import RefreshTree from 'components/RefreshTree'
import {
    Container,
    List,
    Card,
    Button,
    Modal
} from 'semantic-ui-react'
import { UserContext, LoginForm } from '@dialectic-design/hyperobjects-user-context'
import { NewEntityForm } from '@dialectic-design/hyperobjects-entity-context'
import { PatternContext } from 'App'
import './main-page.scss'

const MainPage = ({ uiState }) => {
    const [modal, setModal] = useState(false)
    const user = useContext(UserContext)
    const patternContext = useContext(PatternContext)
    if(user.authenticated === false) {
        return (
            <div className='main-page'>
                <Container style={{paddingTop: 100}}>
                    <p style={{textAlign: 'center'}}>Log in to start creating.</p>
                    <div style={{width: 400, marginLeft: 'auto', marginRight: 'auto'}}>
                    <LoginForm showHeading={false} />
                    </div>
                </Container>
            </div>
        )
    }
    return (
        <div className='main-page'>
            <Modal
                open={modal === 'new-pattern'}
                closeIcon
                size="mini"
                onClose={() => setModal(false)}
                >
                    <Modal.Content>
                        <NewEntityForm context={PatternContext} />
                    </Modal.Content>
            </Modal>
            {uiState.selectedPattern ? (
                <React.Fragment>
                    <RefreshTree refreshKey={uiState.selectedPatternId}>
                    <PatternEditor
                        pattern={uiState.selectedPattern}
                        onChange={(updatedPattern) => {
                            patternContext.actions.updatePattern(updatedPattern)
                        }}
                        />
                    </RefreshTree>
                </React.Fragment>
            ) : (
                <Container style={{paddingTop: 100, textAlign: 'center'}}>
                    <div className='create-new'>
                    <Button size='small' onClick={() => setModal('new-pattern')}>Create new pattern</Button>
                    </div>
                    <p>Select a pattern:</p>
                    <List className='main-page-pattern-list'>
                    {patternContext.list.map(pattern => {
                        return (
                            <List.Item key={pattern._id}>
                                <Card className='pattern-card'
                                    onPointerDown={() => {
                                        uiState.setSelectedPatternId(pattern._id)
                                    }}
                                    >
                                    <Card.Content>
                                    {pattern.name}
                                    </Card.Content>
                                </Card>
                            </List.Item>
                        )
                    })}
                    </List>
                    
                    
                    
                </Container>
            )}
        </div>
    )
}

export default MainPage