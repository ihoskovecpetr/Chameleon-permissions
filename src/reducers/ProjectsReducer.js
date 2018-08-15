import * as ActionTypes from '../constants/ActionTypes';

function ProjectsReducer (state = {}, action = null) {
    if(action && action.type) {
        switch(action.type) {
            case ActionTypes.SET_DATA:
                if(action.data.projects) {
                    state = action.data.projects.reduce((object, project) => {object[project._id] = project; return object}, {});
                } else return state;
                return state;

            case ActionTypes.RESET_STORE:
                return {};

            case ActionTypes.UPDATE_PROJECT:
            case ActionTypes.CREATE_PROJECT:
                if(action.project && action.project._id) return {...state, [action.project._id]: action.project};
                else return state;

            case ActionTypes.REMOVE_PROJECT:
                if(action.id && state[action.id]) {
                    const projects = {...state};
                    delete projects[action.id];
                    return projects;
                } else return state;

            default:
                return state;
        }
    } else return state;
}

export default ProjectsReducer;