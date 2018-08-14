import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { compose, bindActionCreators, createStore, applyMiddleware } from 'redux';
import persistState from 'redux-sessionstorage';
import thunk from 'redux-thunk';

import * as logger from 'loglevel';
import { getAuthenticatedUser } from './lib/authenticatedUser';

import Reducer from './reducers/Reducer';

import AppLayout from './components/AppLayout';
import * as Actions from './actions/Actions';

logger.setLevel('debug');

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(fas, far);

import './app.scss';

const finalCreateStore = compose(
    persistState('appState', {key : 'projects', slicer: () => state => ({appState: {
        layout: state['appState'].layout,
        project: state['appState'].project
    }})}),
    applyMiddleware(thunk)
)(createStore);

const store = finalCreateStore(Reducer);

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);

const AppLayoutConnected = connect(mapStateToProps, mapDispatchToProps)(AppLayout);
const rootElement = document.getElementById('app');

(async () => {
    try {
        const user = await getAuthenticatedUser();
        logger.info(user);
        store.dispatch(Actions.setUser(user));
        store.dispatch(Actions.getData());
        ReactDOM.render(
            <Provider store = {store}>
                <AppLayoutConnected/>
            </Provider>,
            rootElement
        );
    } catch(e) {
        logger.warn('Error while getAuthenticatedUser')
    }
})();

if (module.hot) {
    logger.debug('Accepting Hot Module');
    module.hot.accept();
    /*module.hot.accept('./reducers', () => {
        const nextRootReducer = require('./reducers/Reducer');
        store.replaceReducer(nextRootReducer);
    });*/
}


