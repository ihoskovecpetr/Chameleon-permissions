import * as ActionTypes from './ActionTypes';
import * as Constants from '../constants/Constatnts';

import * as logger from 'loglevel';

import * as server from '../lib/serverData';
import * as StringFormatter from '../lib/stringFormatHelper';

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

export function returnToPreviousView(toList) {
    return {type: ActionTypes.RETURN_TO_PREVIOUS_VIEW, toList: toList};
}

export function setFetching(isFetching) {
    return {type: ActionTypes.SET_FETCHING, isFetching: isFetching};
}

export function setMessage(message) {
    return {type: ActionTypes.SET_MESSAGE, message: message};
}

export function setActiveBid(activeBid) {
    return {type: ActionTypes.SET_ACTIVE_BID, activeBid: activeBid};
}

export function setJustAddedObject(data) {
    return {type: ActionTypes.SET_JUST_ADDED_OBJECT, data: data};
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
    if(scheduled) logger.info(`Refresh data - scheduled ${new Date()}`);
    if(refreshTimer) clearTimeout(refreshTimer);
    return async (dispatch, getState) => {
        if(!scheduled) dispatch(setFetching(true));
        if(!scheduled) dispatch(setMessage(null));
        try {
            // const projects = await server.getProjects();
            // const persons = await server.getPersons();
            // const users = await server.getUsers();

            dispatch(setData({projects })); //persons, users
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
// *********************************************************************************************************************
// PROJECTS
// *********************************************************************************************************************
export function selectProject(id) {
    return {type: ActionTypes.SELECT_PROJECT, id: id}
}

export function showProject(id, set, disableEdit) {
    return {type: ActionTypes.SHOW_PROJECT, id: id, set: set, disableEdit: disableEdit}
}

export function addProject() {
    return {type: ActionTypes.ADD_PROJECT}
}

export function editProject(id, set) {
    return {type: ActionTypes.EDIT_PROJECT, id: id, set: set}
}

export function setProjectsFilter(filter, state) {
    return {type: ActionTypes.SET_PROJECTS_FILTER, filter: filter, state: state};
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

export function changeProjectEditedData(data) {
    return {type: ActionTypes.CHANGE_PROJECT_EDIT_DATA, data: data};
}

// remote db opp
export function updateProject(id, updateData) {
    return async (dispatch, getState) => {
        const projectUpdate = updateData ? updateData : {...getState().appState.projectEditedData};
        const projectId = id ? id : getState().appState.selectedProject;
        if(!projectId || !projectUpdate || Object.keys(projectUpdate).length === 0) return;
        if(projectUpdate.name) projectUpdate.name = projectUpdate.name.toUpperCase().trim();
        if(projectUpdate.alias) projectUpdate.alias = projectUpdate.alias.toUpperCase().trim();
        dispatch(setFetching(true));
        dispatch(setMessage(null));
        try {
            const updatedProject = await server.updateProject(projectId, projectUpdate);
            dispatch({type: ActionTypes.UPDATE_PROJECT, project: updatedProject});
            if (Constants.SHOW_MESSAGE_ON_SUCCESS) dispatch(setMessage({
                type: 'info',
                text: 'Update project done successfully!',
                timeout: Constants.DEFAULT_MESSAGE_TIMEOUT_MS
            }));
        } catch(e) {
            logger.error(e);
            dispatch(setFetching(false));
            dispatch(setMessage({type: 'error', text: `Update project error: ${e instanceof Error ? e.message : JSON.stringify(e)}`}));
            throw e;
        }
        dispatch(setFetching(false));
    }
}

export function createProject() {
    return async (dispatch, getState) => {
        const project = {...getState().appState.projectEditedData};
        if(!project || Object.keys(project).length === 0) return;
        if(project.name) project.name = project.name.toUpperCase().trim();
        if(project.alias) project.alias = project.alias.toUpperCase().trim();
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
            dispatch(setFetching(false));
            dispatch(setMessage({type: 'error', text: `Create project error: ${e instanceof Error ? e.message : JSON.stringify(e)}`}));
            throw e;
        }
        dispatch(setFetching(false));
    }
}

export function removeProject(id) {
    return async (dispatch, getState) => {
        const projectId = id ? id : getState().appState.selectedProject;
        if(!projectId) return;
        dispatch(setFetching(true));
        dispatch(setMessage(null));
        try {
            await server.removeProject(projectId);
            dispatch({type: ActionTypes.REMOVE_PROJECT, project: projectId});
            if (Constants.SHOW_MESSAGE_ON_SUCCESS) dispatch(setMessage({
                type: 'info',
                text: 'Remove project done successfully!',
                timeout: Constants.DEFAULT_MESSAGE_TIMEOUT_MS
            }));
        } catch(e) {
            logger.error(e);
            dispatch(setFetching(false));
            dispatch(setMessage({type: 'error', text: `Remove project error: ${e instanceof Error ? e.message : JSON.stringify(e)}`}));
            throw e;
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

export function showCompany(id, set, disableEdit) {
    return {type: ActionTypes.SHOW_COMPANY, id: id, set: set, disableEdit: disableEdit}
}

export function addCompany(name, person) {
    return {type: ActionTypes.ADD_COMPANY, name: name, person: person}
}

export function editCompany(id, set) {
    return {type: ActionTypes.EDIT_COMPANY, id: id, set: set}
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

export function changeCompanyEditedData(data) {
    return {type: ActionTypes.CHANGE_COMPANY_EDIT_DATA, data: data};
}

// remote db opp
export function updateCompany(id, updateData) {
    return async (dispatch, getState) => {
        const companyUpdate = updateData ? updateData : {...getState().appState.companyEditedData};
        const companyId = id ? id : getState().appState.selectedCompany;
        if(!companyId || !companyUpdate || Object.keys(companyUpdate).length === 0) return;
        if(companyUpdate.name) companyUpdate.name = companyUpdate.name.trim();
        dispatch(setFetching(true));
        dispatch(setMessage(null));
        try {
            const updatedCompany = await server.updateCompany(companyId, companyUpdate);
            dispatch({type: ActionTypes.UPDATE_COMPANY, company: updatedCompany});
            if (Constants.SHOW_MESSAGE_ON_SUCCESS) dispatch(setMessage({
                type: 'info',
                text: 'Update company done successfully!',
                timeout: Constants.DEFAULT_MESSAGE_TIMEOUT_MS
            }));
        } catch(e) {
            logger.error(e);
            dispatch(setFetching(false));
            dispatch(setMessage({type: 'error', text: `Update company error: ${e instanceof Error ? e.message : JSON.stringify(e)}`}));
            throw e;
        }
        dispatch(setFetching(false));
    }
}

export function createCompany() {
    return async (dispatch, getState) => {
        const company = {...getState().appState.companyEditedData};
        let newCompany;
        if(!company || Object.keys(company).length === 0) return;
        if(company.name) company.name = company.name.trim();
        dispatch(setFetching(true));
        dispatch(setMessage(null));
        try {
            newCompany = await server.createCompany(company);
            dispatch({type: ActionTypes.CREATE_COMPANY, company: newCompany});
            if (Constants.SHOW_MESSAGE_ON_SUCCESS) dispatch(setMessage({
                type: 'info',
                text: 'Create company done successfully!',
                timeout: Constants.DEFAULT_MESSAGE_TIMEOUT_MS
            }));
        } catch(e) {
            logger.error(e);
            dispatch(setFetching(false));
            dispatch(setMessage({type: 'error', text: `Create company error: ${e instanceof Error ? e.message : JSON.stringify(e)}`}));
            throw e;
        }
        dispatch(setFetching(false));
        if(newCompany && newCompany._id) return newCompany;
    }
}

export function removeCompany(id) {
    return async (dispatch, getState) => {
        const companyId = id ? id : getState().appState.selectedCompany;
        if(!companyId) return;
        dispatch(setFetching(true));
        dispatch(setMessage(null));
        try {
            await server.removeCompany(companyId);
            dispatch({type: ActionTypes.REMOVE_COMPANY, company: companyId});
            if (Constants.SHOW_MESSAGE_ON_SUCCESS) dispatch(setMessage({
                type: 'info',
                text: 'Remove company done successfully!',
                timeout: Constants.DEFAULT_MESSAGE_TIMEOUT_MS
            }));
        } catch(e) {
            logger.error(e);
            dispatch(setFetching(false));
            dispatch(setMessage({type: 'error', text: `Remove company error: ${e instanceof Error ? e.message : JSON.stringify(e)}`}));
            throw e;
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

export function showPerson(id, set, disableEdit) {
    return {type: ActionTypes.SHOW_PERSON, id: id, set: set, disableEdit: disableEdit}
}

export function addPerson(name, company) {
    return {type: ActionTypes.ADD_PERSON, name: name, company: company}
}

export function editPerson(id, set) {
    return {type: ActionTypes.EDIT_PERSON, id: id, set: set}
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

export function changePersonEditedData(data) {
    return {type: ActionTypes.CHANGE_PERSON_EDIT_DATA, data: data};
}

// remote db opp
export function updatePerson(id, updateData) {
    return async (dispatch, getState) => {
        const personUpdate = updateData ? updateData : {...getState().appState.personEditedData};
        const personId = id ? id : getState().appState.selectedPerson;
        if(!personId || !personUpdate || Object.keys(personUpdate).length === 0) return;
        if(personUpdate.name) personUpdate.name = personUpdate.name.trim();
        dispatch(setFetching(true));
        dispatch(setMessage(null));
        try {
            const updatedPerson = await server.updatePerson(personId, personUpdate);
            dispatch({type: ActionTypes.UPDATE_PERSON, person: updatedPerson});
            if (Constants.SHOW_MESSAGE_ON_SUCCESS) dispatch(setMessage({
                type: 'info',
                text: 'Update person done successfully!',
                timeout: Constants.DEFAULT_MESSAGE_TIMEOUT_MS
            }));
        } catch(e) {
            logger.error(e);
            dispatch(setFetching(false));
            dispatch(setMessage({type: 'error', text: `Update person error: ${e instanceof Error ? e.message : JSON.stringify(e)}`}));
            throw e;
        }
        dispatch(setFetching(false));
    }
}

export function createPerson() {
    return async (dispatch, getState) => {
        const person = {...getState().appState.personEditedData};
        let newPerson;
        if(!person || Object.keys(person).length === 0) return;
        if(person.name) person.name = person.name.trim();
        dispatch(setFetching(true));
        dispatch(setMessage(null));
        try {
            newPerson = await server.createPerson(person);
            dispatch({type: ActionTypes.CREATE_PERSON, person: newPerson});
            if (Constants.SHOW_MESSAGE_ON_SUCCESS) dispatch(setMessage({
                type: 'info',
                text: 'Create person done successfully!',
                timeout: Constants.DEFAULT_MESSAGE_TIMEOUT_MS
            }));
        } catch(e) {
            logger.error(e);
            dispatch(setFetching(false));
            dispatch(setMessage({type: 'error', text: `Create person error: ${e instanceof Error ? e.message : JSON.stringify(e)}`}));
            throw e;
        }
        dispatch(setFetching(false));
        if(newPerson && newPerson._id) return newPerson;
    }
}

export function removePerson(id) {
    return async (dispatch, getState) => {
        const personId = id ? id : getState().appState.selectedPerson;
        if(!personId) return;
        dispatch(setFetching(true));
        dispatch(setMessage(null));
        try {
            await server.removePerson(personId);
            dispatch({type: ActionTypes.REMOVE_PERSON, person: personId});
            if (Constants.SHOW_MESSAGE_ON_SUCCESS) dispatch(setMessage({
                type: 'info',
                text: 'Remove person done successfully!',
                timeout: Constants.DEFAULT_MESSAGE_TIMEOUT_MS
            }));
        } catch(e) {
            logger.error(e);
            dispatch(setFetching(false));
            dispatch(setMessage({type: 'error', text: `Remove person error: ${e instanceof Error ? e.message : JSON.stringify(e)}`}));
            throw e;
        }
        dispatch(setFetching(false));
    }
}