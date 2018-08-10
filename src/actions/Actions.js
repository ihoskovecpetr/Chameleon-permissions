import * as ActionTypes from '../constants/ActionTypes';
import * as Constants from '../constants/Constatnts';

import {getProjects, createProject, updateProject, removeProject} from '../lib/serverData';

export function setLayout(layout) {
    return {
        type: ActionTypes.SET_LAYOUT,
        layout: layout
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

//**********************************************************************************************************************
// THUNK ACTIONS
//**********************************************************************************************************************
export function getData() {
    return async (dispatch, getState) => {
        dispatch(setFetching(true));
        dispatch(setMessage(null));
        try {
            const projects = await getProjects();
            dispatch(setData({projects}));
            if (Constants.SHOW_MESSAGE_ON_SUCCESS) dispatch(setMessage({
                type: 'info',
                text: 'Fetching done successfully!',
                timeout: Constants.DEFAULT_MESSAGE_TIMEOUT_MS
            }));
        } catch(e) {
            logger.error(e);
            this.setMessage({type: 'error', text: `Error occurred while fetching data from the server: ${e instanceof Error ? e.message : JSON.stringify(e)}`})
        }
        dispatch(setFetching(false));
    }
}