import * as ActionTypes from '../constants/ActionTypes';
import * as Constants from '../constants/Constatnts';

import * as logger from 'loglevel';

import * as server from '../lib/serverData';
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
// *********************************************************************************************************************
// DATA STORE
// *********************************************************************************************************************
export function setData(data) {
    return {type: ActionTypes.SET_DATA, data: data};
}

export function resetData() {
    return {type: ActionTypes.RESET_STORE};
}

export function getData() {
    return async (dispatch, getState) => {
        dispatch(setFetching(true));
        dispatch(setMessage(null));
        try {
            const projects = await server.getProjects();
            const people = await server.getPeople();
            const companies = await server.getCompanies();
            const users = await server.getUsers();

            dispatch(setData({projects, people, companies, users}));
            if (Constants.SHOW_MESSAGE_ON_SUCCESS) dispatch(setMessage({
                type: 'info',
                text: 'Fetching done successfully!',
                timeout: Constants.DEFAULT_MESSAGE_TIMEOUT_MS
            }));
        } catch(e) {
            logger.error(e);
            dispatch(setMessage({type: 'error', text: `Error occurred while fetching data from the server: ${e instanceof Error ? e.message : JSON.stringify(e)}`}));
        }
        dispatch(setFetching(false));
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

export function selectProjectNext(id) {
    return {type: ActionTypes.SELECT_PROJECT_NEXT, id: id}
}

export function editProject() {
    return {type: ActionTypes.EDIT_PROJECT}
}

export function updateProject() {
    return async (dispatch, getState) => {
        const projectUpdate = getState().appState.editedData;
        const id = getState().appState.selectedProject;
        if(!id || !projectUpdate || Object.keys(projectUpdate).length === 0) return;
        dispatch(setFetching(true));
        dispatch(setMessage(null));
        try {
            const updatedProject = await server.updateProject(id, projectUpdate);
            console.log(updatedProject);
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
            dispatch({type: ActionTypes.ADD_PROJECT, project: newProject});
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

export function setProjectsFilter(filter, remove) {
    return {type: ActionTypes.SET_PROJECTS_FILTER, filter: filter, state: remove};
}

export function setProjectsSerach(search) {
    return {type: ActionTypes.SET_PROJECTS_SEARCH, search: search};
}

export function setProjectsSort(sort) {
    return {type: ActionTypes.SET_PROJECTS_SORT, sort: sort};
}
// *********************************************************************************************************************
// PEOPLE
// *********************************************************************************************************************