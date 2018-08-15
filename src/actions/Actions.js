import * as ActionTypes from '../constants/ActionTypes';
import * as Constants from '../constants/Constatnts';

import * as logger from 'loglevel';

import * as server from '../lib/serverData';

export function setView(view) {
    return {
        type: ActionTypes.SET_VIEW,
        view: view
    }
}

export function setUser(user) {
    return {
        type: ActionTypes.SET_USER,
        user: user
    }
}

export function setFetching(isFetching) {
    return {
        type: ActionTypes.SET_FETCHING,
        isFetching: isFetching
    }
}

export function setMessage(message) {
    return {
        type: ActionTypes.SET_MESSAGE,
        message: message
    }
}

export function setData(data) {
    return {
        type: ActionTypes.SET_DATA,
        data: data
    }
}

export function editProject(project) {
    return {
        type: ActionTypes.EDIT_PROJECT,
        project: project
    }
}

export function createProject() {
    return {
        type: ActionTypes.CREATE_PROJECT
    }
}

//**********************************************************************************************************************
// SERVER / THUNK ACTIONS
//**********************************************************************************************************************
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
//PROJECTS
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

export function addProject(project) {
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