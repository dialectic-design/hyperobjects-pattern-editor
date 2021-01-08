import React, { useState, useContext, createContext, useEffect } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route
} from 'react-router-dom'
import {
	UserProvider,
	UserContext
} from '@dialectic-design/hyperobjects-user-context'
import {
  	createStore
} from '@dialectic-design/hyperobjects-entity-context'

import MainMenu from 'components/MainMenu'
import MainPage from 'containers/MainPage'
import AccountPage from 'containers/AccountPage'
import CreateAccountPage from 'containers/CreateAccountPage'
import 'semantic-ui-css/semantic.min.css';
import '@dialectic-design/hyperobjects-entity-context/dist/index.css'
import '@dialectic-design/hyperobjects-user-context/dist/index.css'
import './App.scss';
import _ from 'lodash'
import EmbedPage from 'containers/EmbedPage';

export const patternStore = createStore('pattern')
const PatternProvider = patternStore.provider
export const PatternContext = patternStore.context

export const UIContext = createContext()

const App = () => {
	return (
		<UserProvider>
			<AppWithUser />
		</UserProvider>
	);
}

const AppWithUser = () => {
	const user = useContext(UserContext)
	return (
		<PatternProvider user={user}>
			<AppWithUserAndPattern />
		</PatternProvider>
	)
}

const AppWithUserAndPattern = () => {
	const patternContext = useContext(PatternContext)
	const [selectedPatternId, setSelectedPatternId] = useState(false)
	const [refreshSelectedPattern, setRefreshSelectedPattern] = useState(false)
	const selectedPattern = _.get(patternContext, `dict.${selectedPatternId}`, false)
	useEffect(() => {
		if(refreshSelectedPattern) {
			setTimeout(() => {
				setRefreshSelectedPattern(false)
			}, 10)
		}
	}, [refreshSelectedPattern, setRefreshSelectedPattern])
	const uiState = {
		selectedPatternId: refreshSelectedPattern ? false : selectedPatternId,
		setSelectedPatternId,
		selectedPattern,
		setRefreshSelectedPattern
	}
	return (
		<UIContext.Provider value={uiState}>
		<Router>
			<Switch>
				<Route path='/embed'>
					<EmbedPage />
				</Route>
				<div className='app'>
					<MainMenu uiState={uiState} />
					<div className='page-content'>
						
						<Route path='/create-account'>
							<CreateAccountPage />
						</Route>
						<Route path='/account'>
							<AccountPage />
						</Route>
						
						<Route path='/'>
							<MainPage uiState={uiState} />
						</Route>
						
					</div>
				</div>
			</Switch>
		</Router>
		</UIContext.Provider>
	)
}



export default App;
