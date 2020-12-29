import React, { useState } from 'react'
import {
    Container
} from 'semantic-ui-react'
import {
    CreateAccountForm
} from '@dialectic-design/hyperobjects-user-context'


const CreateAccountPage = () => {
    return (
        <div className='create-account-page'>
            <Container
                style={{paddingTop: 100}}
                >
                <CreateAccountForm />
            </Container>
        </div>
    )
}

export default CreateAccountPage