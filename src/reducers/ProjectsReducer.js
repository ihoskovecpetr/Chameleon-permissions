import * as ActionTypes from '../constants/ActionTypes';

function ProjectsReducer (state = null, action = null) {
    if(action && action.type) {
        switch(action.type) {
            case ActionTypes.RESET_STORE:
                return {};

            case ActionTypes.SET_DATA:
                if(action.data.projects) return action.data.projects.reduce((object, project) => {object[project._id] = project; return object}, {});
                return state;

            case ActionTypes.UPDATE_PROJECT:
            case ActionTypes.CREATE_PROJECT:
                if(action.project && action.project._id) return {...state, [action.project._id]: action.project};
                else return state;

            case ActionTypes.REMOVE_PROJECT:
                if(action.project && state[action.project]) {
                    const projects = {...state};
                    delete projects[action.project];
                    return projects;
                } else return state;

            default:
                return state;
        }
    } else return state;
}

export default ProjectsReducer;