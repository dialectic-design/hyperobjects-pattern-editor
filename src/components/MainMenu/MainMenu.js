import React, { useState, useRef, useEffect } from 'react'
import {
    UserContext,
    LoginForm
} from '@dialectic-design/hyperobjects-user-context'
import { useContext } from 'react'
import {
    Menu,
    Container,
    Button,
    Modal,
    Dropdown,
    Loader,
    Message,
    Icon
} from 'semantic-ui-react'
import {
    Link
} from 'react-router-dom'
import './main-menu.scss'
import { PatternContext } from 'App'
import $ from 'jquery'

const MainMenu = ({ uiState }) => {
    const patternSelectdDropdownRef = useRef(null)
    const user = useContext(UserContext)
    const patternContext = useContext(PatternContext)
    const [modal, setModal] = useState(false)
    const [defocus, setDefocus] = useState(false)

    let patternsForMenu = patternContext.list.map(p => {
        return {
            key: p._id,
            value: p._id,
            text: p.name
        }
    })
    useEffect(() => {
        if(defocus) {
            setTimeout(() => {
                const inputElement = $('.main-menu-pattern-select input').first()[0]
                inputElement.blur()
            }, 20)
            setDefocus(false)
        }
    }, [defocus, setDefocus])
    const selectedPattern = uiState.selectedPattern
    return (
        <React.Fragment>
            <Modal
                open={modal === 'login-modal'}
                onClose={() => setModal(false)}
                closeIcon
                size="mini"
                >
                <Modal.Content>
                    <LoginForm />
                </Modal.Content>
            </Modal>
            
            <Menu className='main-menu'>
                <Container fluid>
                    <Link to='/'>
                        <Menu.Item header>
                            Pattern editor
                        </Menu.Item>
                    </Link>
                    {user.authenticated === false ? (
                        <Menu.Menu position='right'>
                            
                            <Menu.Item position='right'>
                                <Link to='/create-account'>
                                    <Button size="tiny" basic>
                                        Create account
                                    </Button>
                                </Link>
                            </Menu.Item>
                            
                            <Menu.Item position="right">
                                <Button size='tiny' basic
                                    onClick={() => {
                                        setModal('login-modal')
                                    }}
                                    >
                                    Log in
                                </Button>
                            </Menu.Item>
                        </Menu.Menu>
                    ) : (
                        <React.Fragment>
                            <Menu.Menu position="left">
                                <Menu.Item><p>Your patterns: </p></Menu.Item>
                                <Menu.Item>
                                    <Dropdown
                                        search
                                        searchInput={{type: 'text'}}
                                        value={uiState.selectedPatternId}
                                        placeholder='patterns'
                                        fluid
                                        selection
                                        ref={patternSelectdDropdownRef}
                                        className='main-menu-pattern-select'
                                        onChange={(e, data) => {
                                            if(uiState.selectedPatternId !== data.value) {
                                                uiState.setSelectedPatternId(data.value)
                                                setDefocus(true)
                                            }
                                            
                                        }}
                                        options={patternsForMenu}
                                        />
                                </Menu.Item>
                                {uiState.selectedPatternId && (
                                    <React.Fragment>
                                    <Menu.Item>
                                        <Button size="tiny" basic onClick={() => uiState.setSelectedPatternId(false)} >Close</Button>
                                    </Menu.Item>
                                    <Menu.Item className='pattern-storage-state'>
                                    {selectedPattern.updating ? (
                                        <Loader active />
                                    ) : selectedPattern.updateError ? (
                                        <Message negative style={{padding: 3, width: '100%', paddingLeft: 9}}><Icon name='warning circle'/>Store error</Message>
                                    ) : selectedPattern.updateSuccessful ? (
                                        <p>pattern stored <Icon name='checkmark'/></p>
                                    ) : (
                                        <p>No change</p>
                                    )}
                                    </Menu.Item>
                                    </React.Fragment>
                                )}
                            </Menu.Menu>
                            <Menu.Menu position="right">
                                <Menu.Item>
                                    <p className='account-name'> Signed in with <i>{user.email}</i></p>
                                </Menu.Item>
                                <Menu.Item position='right'>
                                    <Link to='/account'>
                                        <Button size='tiny' basic>
                                            Account
                                        </Button>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item position="right">
                                    <Button size='tiny' basic onClick={() => user.actions.userLogOut()}>
                                        Sign out
                                    </Button>
                                </Menu.Item>
                            </Menu.Menu>
                        </React.Fragment>
                    )}
                </Container>
            </Menu>
        </React.Fragment>
    )
}

export default MainMenu