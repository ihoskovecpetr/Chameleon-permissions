import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { compose, bindActionCreators, createStore, applyMiddleware } from 'redux';
import persistState from 'redux-sessionstorage';
import thunk from 'redux-thunk';

import * as logger from 'loglevel';
import { getAuthenticatedUser } from './lib/serverData';

import Reducer from './reducers/Reducer';

import AppRouter from './app_router';
import AppLayout from './components/AppLayout';
import * as Actions from './actions_redux/Actions';
import * as ProjectActions from './components/modules/ProjectModule';

import initialState from './reducers/InitialState';
import createIconLibrary from './lib/createIconLibrary';

import checkAuthToken from './lib/checkAuthToken';

logger.setLevel('debug');

createIconLibrary();

import './app.scss';

const appStatePath = 'appState';

console.log("appStatePath: ", appStatePath)

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
            personsFilter: state[path].personsFilter,
            personsSearch: state[path].personsSearch,
            personsSort: state[path].personsSort,
            selectedCompany: state[path].selectedCompany,
            companiesFilter: state[path].companiesFilter,
            companiesSearch: state[path].companiesSearch,
            companiesSort: state[path].companiesSort,
            box: state[path].box,
            projectEditedData: state[path].projectEditedData,
            personEditedData: state[path].personEditedData,
            companyEditedData: state[path].companyEditedData,
            activeBid: state[path].activeBid,
            activeBidSearch: state[path].activeBidSearch,
            activeBidSort: state[path].activeBidSort,
        }),
        merge: (initialState, persistedState) => ({...initialState, [appStatePath]: {...initialState[appStatePath], ...persistedState}})
    }),
    applyMiddleware(thunk)
)(createStore);

const store = finalCreateStore(Reducer, initialState);

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);

const AppRouterConnected = connect(mapStateToProps, mapDispatchToProps)(AppRouter);
const rootElement = document.getElementById('app');

(async () => {
    try {
        const user = await getAuthenticatedUser();
        store.dispatch(Actions.setUser(user));
        logger.info(user);
        if(user.exp) logger.info(`Session will expire on ${new Date(user.exp)}`)
    } catch(e) {
        store.dispatch(Actions.setUser(null));
        logger.warn('Error while getAuthenticatedUser');
        return;
    }

    try {
        store.dispatch(ProjectActions.fetchADProjects());
        store.dispatch(ProjectActions.fetchK2Projects());
        ReactDOM.render(
            <Provider store={store}>
                <AppRouterConnected/>
            </Provider>,
            rootElement
        );
        // checkAuthToken();
    } catch(e) {
        logger.warn('Error while getting initial data')
    }

})();

if (module.hot) {
    logger.debug('Accepting Hot Module');
    module.hot.accept('./reducers/Reducer', () => {
        const nextRootReducer = require('./reducers/Reducer');
        store.replaceReducer(nextRootReducer);
    });
}

