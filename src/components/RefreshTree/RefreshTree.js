import React, { useState, useEffect } from 'react'
import {
    Container
} from 'semantic-ui-react'


const RefreshTree = ({
    refreshKey,
    children
}) => {
    const [currentKey, setCurrentKey] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    useEffect(() => {
        if(refreshKey !== currentKey) {
            setRefreshing(true)
            setCurrentKey(refreshKey)
            setTimeout(() => {
                setRefreshing(false)
            }, 1)
        }
    }, [refreshKey, currentKey] )
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

RefreshTree.defaultProps = {
    refreshKey: "set key"
}

export default RefreshTree