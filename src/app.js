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

import initialState from './reducers/InitialState';

logger.setLevel('debug');

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(fas, far);
window.FontAwesomeConfig.searchPseudoElements= true;

import './app.scss';

const appStatePath = 'appState';

const finalCreateStore = compose(
    persistState(appStatePath, {
        key : 'projects',
        slicer: path => state => ({
            view: state[path].view,
            previousView: state[path].previousView,
            selectedProject: state[path].selectedProject,
            projectsFilter: state[path].projectsFilter,
            projectsSearch: state[path].projectsSearch,
            projectsSort: state[path].projectsSort,
            selectedPerson: state[path].selectedPerson,
            peopleFilter: state[path].peopleFilter,
            peopleSearch: state[path].peopleSearch,
            peopleSort: state[path].peopleSort,
            selectedCompany: state[path].selectedCompany,
            companiesFilter: state[path].companiesFilter,
            companiesSearch: state[path].companiesSearch,
            companiesSort: state[path].companiesSort,
            box: state[path].box,
            selectedBoxItem: state[path].selectedBoxItem,
            nextDetailId: state[path].nextDetailId,
            editedData: state[path].editedData,
            activeBid: state[path].activeBid
        }),
        merge: (initialState, persistedState) => ({...initialState, [appStatePath]: {...initialState[appStatePath], ...persistedState}})
    }),
    applyMiddleware(thunk)
)(createStore);

const store = finalCreateStore(Reducer, initialState);

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);

const AppLayoutConnected = connect(mapStateToProps, mapDispatchToProps)(AppLayout);
const rootElement = document.getElementById('app');

(async () => {
    try {
        const user = await getAuthenticatedUser();
        store.dispatch(Actions.setUser(user));
        logger.info(user);
    } catch(e) {
        logger.warn('Error while getAuthenticatedUser')
    }

    try {
        store.dispatch(Actions.getData());
        ReactDOM.render(
            <Provider store={store}>
                <AppLayoutConnected/>
            </Provider>,
            rootElement
        );
    } catch(e) {
        logger.warn('Error while getting initial data')
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


