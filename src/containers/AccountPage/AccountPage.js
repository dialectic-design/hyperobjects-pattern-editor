import React, { useContext } from 'react'
import {
    Container,
    Button
} from 'semantic-ui-react'
import { UserContext } from '@dialectic-design/hyperobjects-user-context'
import { PatternContext } from 'App'
import {
    EntityList
} from '@dialectic-design/hyperobjects-entity-context'
import {
    Link
} from 'react-router-dom'

const AccountPage = () => {
    const user = useContext(UserContext)
    return (
        <div className='account-page'>
            <Container style={{paddingTop: 100, paddingBottom: 100}}>
                {user.authenticated ? (
                    <React.Fragment>
                        <h1>Your account</h1>
                        <EntityList context={PatternContext} />
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                    <h1>Not signed in</h1>
                    <div>
                        <Link to='/create-account'>
                        <Button>
                            Create an account!
                        </Button>
                        </Link>
                    </div>
                    </React.Fragment>
                    
                )}
                
            </Container>
            
        </div>
    )
}

export default AccountPage