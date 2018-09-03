import * as ActionTypes from '../constants/ActionTypes';

function PersonsReducer (state = null, action = null) {
    if(action && action.type) {
        switch(action.type) {
            case ActionTypes.RESET_STORE:
                return {};

            case ActionTypes.SET_DATA:
                if(action.data.persons) return action.data.persons.reduce((object, person) => {object[person._id] = person; return object}, {});
                return state;

            case ActionTypes.UPDATE_PERSON:
            case ActionTypes.CREATE_PERSON:
                if(action.person && action.person._id) return {...state, [action.person._id]: action.person};
                else return state;

            case ActionTypes.REMOVE_PERSON:
                if(action.person && state[action.person]) {
                    const projects = {...state};
                    delete projects[action.person];
                    return projects;
                } else return state;

            default:
                return state;
        }
    } else return state;
}

export default PersonsReducer;