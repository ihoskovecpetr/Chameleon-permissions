import * as ActionTypes from '../constants/ActionTypes';

function ProjectsReducer (state = {}, action = null) {
    if(action && action.type) {
        switch(action.type) {
            case ActionTypes.SET_DATA:
                if(action.data.projects) {
                    state = action.data.projects.reduce((object, project) => {object[project._id] = project; return object}, {});
                } else return state;
                return state;

            case ActionTypes.UPDATE_PROJECT:
            case ActionTypes.ADD_PROJECT:
                if(action.project && action.project._id) return {...state, [action.project._id]: action.project};
                else return state;

            default:
                return state;
        }
    } else return state;
}

export default ProjectsReducer;