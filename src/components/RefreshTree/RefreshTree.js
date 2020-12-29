import React, { useState, useEffect } from 'react'
import {
    Container
} from 'semantic-ui-react'


const RefreshTree = ({
    key,
    children
}) => {
    const [currentKey, setCurrentKey] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    useEffect(() => {
        if(key !== currentKey) {
            setRefreshing(true)
            setCurrentKey(key)
            setTimeout(() => {
                setRefreshing(false)
            }, 1)
        }
    })
    if(refreshing) {
        return (
            <Container style={{paddingTop: 100, textAlign: 'center', opacity: 0.1}}>
                    <p>refreshing</p>
            </Container>
        )
    } else {
        return (
            <React.Fragment>
                {children}
            </React.Fragment>
        )
    }
}

export default RefreshTree