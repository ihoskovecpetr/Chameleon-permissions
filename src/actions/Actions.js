import * as ActionTypes from '../constants/ActionTypes';
import * as Constants from '../constants/Constatnts';

import * as logger from 'loglevel';

import * as server from '../lib/serverData';

let refreshTimer = null;

// *********************************************************************************************************************
// lLOGGED IN USER
// *********************************************************************************************************************
export function setUser(user) {
    return {type: ActionTypes.SET_USER, user: user};
}
// *********************************************************************************************************************
// ROUTING, INFO, ...
// *********************************************************************************************************************
export function setView(view) {
    return {type: ActionTypes.SET_VIEW, view: view};
}

export function returnToPreviousView() {
    return {type: ActionTypes.RETURN_TO_PREVIOUS_VIEW};
}

export function setFetching(isFetching) {
    return {type: ActionTypes.SET_FETCHING, isFetching: isFetching};
}

export function setMessage(message) {
    return {type: ActionTypes.SET_MESSAGE, message: message};
}

export function editItem(data) {
    return {type: ActionTypes.EDIT_ITEM, data: data};
}

export function setActiveBid(activeBid) {
    return {type: ActionTypes.SET_ACTIVE_BID, activeBid: activeBid};
}
// *********************************************************************************************************************
// DATA STORE
// *********************************************************************************************************************
export function setData(data) {
    return {type: ActionTypes.SET_DATA, data: data};
}

export function resetData() {
    return {type: ActionTypes.RESET_STORE};
}

export function getData(scheduled) {
    if(scheduled) logger.info('Refresh data - scheduled');
    if(refreshTimer) clearTimeout(refreshTimer);
    return async (dispatch, getState) => {
        if(!scheduled) dispatch(setFetching(true));
        if(!scheduled) dispatch(setMessage(null));
        try {
            const projects = await server.getProjects();
            const persons = await server.getPersons();
            const companies = await server.getCompanies();
            const users = await server.getUsers();

            dispatch(setData({projects, persons, companies, users}));
            if (!scheduled && Constants.SHOW_MESSAGE_ON_SUCCESS) dispatch(setMessage({
                type: 'info',
                text: 'Fetching done successfully!',
                timeout: Constants.DEFAULT_MESSAGE_TIMEOUT_MS
            }));
            if(Constants.SCHEDULED_DATA_REFRESH_TIME_MS) refreshTimer = setTimeout(() => dispatch(getData(true)), Constants.SCHEDULED_DATA_REFRESH_TIME_MS);
        } catch(e) {
            if(scheduled && Constants.SCHEDULED_DATA_REFRESH_TIME_MS) refreshTimer = setTimeout(() => dispatch(getData(true)), Constants.SCHEDULED_DATA_REFRESH_TIME_MS);
            if(!scheduled) logger.error(e);
            if(!scheduled) dispatch(setMessage({type: 'error', text: `Error occurred while fetching data from the server: ${e instanceof Error ? e.message : JSON.stringify(e)}`}));
        }
        if(!scheduled) dispatch(setFetching(false));
    }
}

// *********************************************************************************************************************
// BOX
// *********************************************************************************************************************
export function addToBox(id) {
    return {type: ActionTypes.ADD_TO_BOX, id: id};
}

export function removeFromBox(id) {
    return {type: ActionTypes.REMOVE_FROM_BOX, id: id};
}

export function emptyBox() {
    return {type: ActionTypes.EMPTY_BOX};
}

export function selectBoxItem(id) {
    return {type: ActionTypes.SELECT_BOX_ITEM, id: id};
}
// *********************************************************************************************************************
// PROJECTS
// *********************************************************************************************************************
export function selectProject(id) {
    return {type: ActionTypes.SELECT_PROJECT, id: id}
}

export function showProject(id) {
    return {type: ActionTypes.SHOW_PROJECT, id: id}
}

export function showProjectNext(id) {
    return {type: ActionTypes.SHOW_PROJECT_NEXT, id: id}
}

export function addProject() {
    return {type: ActionTypes.ADD_PROJECT}
}

export function editProject(id) {
    return {type: ActionTypes.EDIT_PROJECT, id: id}
}

export function setProjectsFilter(filter, remove) {
    return {type: ActionTypes.SET_PROJECTS_FILTER, filter: filter, state: remove};
}

export function setProjectsSearch(search) {
    return {type: ActionTypes.SET_PROJECTS_SEARCH, search: search};
}

export function setProjectsSort(sort) {
    return {type: ActionTypes.SET_PROJECTS_SORT, sort: sort};
}

export function setActiveBidSearch(search) {
    return {type: ActionTypes.SET_ACTIVE_BID_SEARCH, search: search};
}

export function setActiveBidSort(sort) {
    return {type: ActionTypes.SET_ACTIVE_BID_SORT, sort: sort};
}

// remote db opp
export function updateProject() {
    return async (dispatch, getState) => {
        const projectUpdate = getState().appState.editedData;
        const id = getState().appState.selectedProject;
        if(!id || !projectUpdate || Object.keys(projectUpdate).length === 0) return;
        dispatch(setFetching(true));
        dispatch(setMessage(null));
        try {
            const updatedProject = await server.updateProject(id, projectUpdate);
            dispatch({type: ActionTypes.UPDATE_PROJECT, project: updatedProject});
            if (Constants.SHOW_MESSAGE_ON_SUCCESS) dispatch(setMessage({
                type: 'info',
                text: 'Update project done successfully!',
                timeout: Constants.DEFAULT_MESSAGE_TIMEOUT_MS
            }));
        } catch(e) {
            logger.error(e);
            dispatch(setMessage({type: 'error', text: `Update project error: ${e instanceof Error ? e.message : JSON.stringify(e)}`}));
        }
        dispatch(setFetching(false));
    }
}

export function updateProjectDirect(id, projectUpdate) {
    return async (dispatch, getState) => {
        dispatch(setFetching(true));
        dispatch(setMessage(null));
        try {
            const updatedProject = await server.updateProject(id, projectUpdate);
            dispatch({type: ActionTypes.UPDATE_PROJECT, project: updatedProject});
            if (Constants.SHOW_MESSAGE_ON_SUCCESS) dispatch(setMessage({
                type: 'info',
                text: 'Update project done successfully!',
                timeout: Constants.DEFAULT_MESSAGE_TIMEOUT_MS
            }));
        } catch(e) {
            logger.error(e);
            dispatch(setMessage({type: 'error', text: `Update project error: ${e instanceof Error ? e.message : JSON.stringify(e)}`}));
        }
        dispatch(setFetching(false));
    }
}

export function createProject() {
    return async (dispatch, getState) => {
        const project = getState().appState.editedData;
        if(!project || Object.keys(project).length === 0) return;
        dispatch(setFetching(true));
        dispatch(setMessage(null));
        try {
            const newProject = await server.createProject(project);
            dispatch({type: ActionTypes.CREATE_PROJECT, project: newProject});
            if (Constants.SHOW_MESSAGE_ON_SUCCESS) dispatch(setMessage({
                type: 'info',
                text: 'Create project done successfully!',
                timeout: Constants.DEFAULT_MESSAGE_TIMEOUT_MS
            }));
        } catch(e) {
            logger.error(e);
            dispatch(setMessage({type: 'error', text: `Create project error: ${e instanceof Error ? e.message : JSON.stringify(e)}`}));
        }
        dispatch(setFetching(false));
    }
}

export function removeProject() {
    return async (dispatch, getState) => {
        const id = getState().appState.selectedProject;
        if(!id) return;
        dispatch(setFetching(true));
        dispatch(setMessage(null));
        try {
            await server.removeProject(id);
            dispatch({type: ActionTypes.REMOVE_PROJECT, project: id});
            if (Constants.SHOW_MESSAGE_ON_SUCCESS) dispatch(setMessage({
                type: 'info',
                text: 'Remove project done successfully!',
                timeout: Constants.DEFAULT_MESSAGE_TIMEOUT_MS
            }));
        } catch(e) {
            logger.error(e);
            dispatch(setMessage({type: 'error', text: `Remove project error: ${e instanceof Error ? e.message : JSON.stringify(e)}`}));
        }
        dispatch(setFetching(false));
    }
}

// *********************************************************************************************************************
// COMPANIES
// *********************************************************************************************************************
export function selectCompany(id) {
    return {type: ActionTypes.SELECT_COMPANY, id: id}
}

export function showCompany(id) {
    return {type: ActionTypes.SHOW_COMPANY, id: id}
}

export function showCompanyNext(id) {
    return {type: ActionTypes.SHOW_COMPANY_NEXT, id: id}
}

export function addCompany() {
    return {type: ActionTypes.ADD_COMPANY}
}

export function editCompany(id) {
    return {type: ActionTypes.EDIT_COMPANY, id: id}
}

export function setCompaniesFilter(filter, remove) {
    return {type: ActionTypes.SET_COMPANIES_FILTER, filter: filter, state: remove};
}

export function setCompaniesSearch(search) {
    return {type: ActionTypes.SET_COMPANIES_SEARCH, search: search};
}

export function setCompaniesSort(sort) {
    return {type: ActionTypes.SET_COMPANIES_SORT, sort: sort};
}

// remote db opp
export function updateCompany() {
    return async (dispatch, getState) => {
        const companyUpdate = getState().appState.editedData;
        const id = getState().appState.selectedCompany;
        if(!id || !companyUpdate || Object.keys(companyUpdate).length === 0) return;
        dispatch(setFetching(true));
        dispatch(setMessage(null));
        try {
            const updatedCompany = await server.updateCompany(id, companyUpdate);
            dispatch({type: ActionTypes.UPDATE_COMPANY, company: updatedCompany});
            if (Constants.SHOW_MESSAGE_ON_SUCCESS) dispatch(setMessage({
                type: 'info',
                text: 'Update company done successfully!',
                timeout: Constants.DEFAULT_MESSAGE_TIMEOUT_MS
            }));
        } catch(e) {
            logger.error(e);
            dispatch(setMessage({type: 'error', text: `Update company error: ${e instanceof Error ? e.message : JSON.stringify(e)}`}));
        }
        dispatch(setFetching(false));
    }
}

export function createCompany() {
    return async (dispatch, getState) => {
        const company = getState().appState.editedData;
        if(!company || Object.keys(company).length === 0) return;
        dispatch(setFetching(true));
        dispatch(setMessage(null));
        try {
            const newCompany = await server.createCompany(company);
            dispatch({type: ActionTypes.CREATE_COMPANY, company: newCompany});
            if (Constants.SHOW_MESSAGE_ON_SUCCESS) dispatch(setMessage({
                type: 'info',
                text: 'Create company done successfully!',
                timeout: Constants.DEFAULT_MESSAGE_TIMEOUT_MS
            }));
        } catch(e) {
            logger.error(e);
            dispatch(setMessage({type: 'error', text: `Create company error: ${e instanceof Error ? e.message : JSON.stringify(e)}`}));
        }
        dispatch(setFetching(false));
    }
}

export function removeCompany() {
    return async (dispatch, getState) => {
        const id = getState().appState.selectedCompany;
        if(!id) return;
        dispatch(setFetching(true));
        dispatch(setMessage(null));
        try {
            await server.removeCompany(id);
            dispatch({type: ActionTypes.REMOVE_COMPANY, company: id});
            if (Constants.SHOW_MESSAGE_ON_SUCCESS) dispatch(setMessage({
                type: 'info',
                text: 'Remove company done successfully!',
                timeout: Constants.DEFAULT_MESSAGE_TIMEOUT_MS
            }));
        } catch(e) {
            logger.error(e);
            dispatch(setMessage({type: 'error', text: `Remove company error: ${e instanceof Error ? e.message : JSON.stringify(e)}`}));
        }
        dispatch(setFetching(false));
    }
}

// *********************************************************************************************************************
// PERSONS
// *********************************************************************************************************************
export function selectPerson(id) {
    return {type: ActionTypes.SELECT_PERSON, id: id}
}

export function showPerson(id) {
    return {type: ActionTypes.SHOW_PERSON, id: id}
}

export function showPersonNext(id) {
    return {type: ActionTypes.SHOW_PERSON_NEXT, id: id}
}

export function addPerson() {
    return {type: ActionTypes.ADD_PERSON}
}

export function editPerson(id) {
    return {type: ActionTypes.EDIT_PERSON, id: id}
}

export function setPersonsFilter(filter, remove) {
    return {type: ActionTypes.SET_PERSONS_FILTER, filter: filter, state: remove};
}

export function setPersonsSearch(search) {
    return {type: ActionTypes.SET_PERSONS_SEARCH, search: search};
}

export function setPersonsSort(sort) {
    return {type: ActionTypes.SET_PERSONS_SORT, sort: sort};
}

// remote db opp
export function updatePerson() {
    return async (dispatch, getState) => {
        const personUpdate = getState().appState.editedData;
        const id = getState().appState.selectedPerson;
        if(!id || !personUpdate || Object.keys(personUpdate).length === 0) return;
        dispatch(setFetching(true));
        dispatch(setMessage(null));
        try {
            const updatedPerson = await server.updatePerson(id, personUpdate);
            dispatch({type: ActionTypes.UPDATE_PERSON, person: updatedPerson});
            if (Constants.SHOW_MESSAGE_ON_SUCCESS) dispatch(setMessage({
                type: 'info',
                text: 'Update person done successfully!',
                timeout: Constants.DEFAULT_MESSAGE_TIMEOUT_MS
            }));
        } catch(e) {
            logger.error(e);
            dispatch(setMessage({type: 'error', text: `Update person error: ${e instanceof Error ? e.message : JSON.stringify(e)}`}));
        }
        dispatch(setFetching(false));
    }
}

export function createPerson() {
    return async (dispatch, getState) => {
        const person = getState().appState.editedData;
        if(!person || Object.keys(person).length === 0) return;
        dispatch(setFetching(true));
        dispatch(setMessage(null));
        try {
            const newPerson = await server.createPerson(person);
            dispatch({type: ActionTypes.CREATE_PERSON, person: newPerson});
            if (Constants.SHOW_MESSAGE_ON_SUCCESS) dispatch(setMessage({
                type: 'info',
                text: 'Create person done successfully!',
                timeout: Constants.DEFAULT_MESSAGE_TIMEOUT_MS
            }));
        } catch(e) {
            logger.error(e);
            dispatch(setMessage({type: 'error', text: `Create person error: ${e instanceof Error ? e.message : JSON.stringify(e)}`}));
        }
        dispatch(setFetching(false));
    }
}

export function removePerson() {
    return async (dispatch, getState) => {
        const id = getState().appState.selectedPerson;
        if(!id) return;
        dispatch(setFetching(true));
        dispatch(setMessage(null));
        try {
            await server.removePerson(id);
            dispatch({type: ActionTypes.REMOVE_PERSON, person: id});
            if (Constants.SHOW_MESSAGE_ON_SUCCESS) dispatch(setMessage({
                type: 'info',
                text: 'Remove person done successfully!',
                timeout: Constants.DEFAULT_MESSAGE_TIMEOUT_MS
            }));
        } catch(e) {
            logger.error(e);
            dispatch(setMessage({type: 'error', text: `Remove person error: ${e instanceof Error ? e.message : JSON.stringify(e)}`}));
        }
        dispatch(setFetching(false));
    }
}