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

export function setFetching(isFetching) {
    return {type: ActionTypes.SET_FETCHING, isFetching: isFetching};
}

export function setMessage(message) {
    return {type: ActionTypes.SET_MESSAGE, message: message};
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
// PROJECTS
// *********************************************************************************************************************
export function selectProject(id) {
    return {type: ActionTypes.SELECT_PROJECT, id: id}
}

export function editProject(project) {
    return {type: ActionTypes.EDIT_PROJECT, project: project}
}

export function updateProject(id, project) {
    return async (dispatch, getState) => {
        dispatch(setFetching(true));
        dispatch(setMessage(null));
        try {
            const updatedProject = await server.updateProject(id, project);
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

export function createProject(project) {
    return async (dispatch, getState) => {
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

export function removeProject(id) {
    return async (dispatch, getState) => {
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
    return {type: ActionTypes.SET_PROJECTS_SERACH, search: search};
}

export function setProjectsSort(sort) {
    return {type: ActionTypes.SET_PROJECTS_SORT, sort: sort};
}
// *********************************************************************************************************************
// PEOPLE
// *********************************************************************************************************************