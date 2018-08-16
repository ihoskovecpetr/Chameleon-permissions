import * as ActionTypes from '../constants/ActionTypes';

function PeopleReducer (state = {}, action = null) {
    if(action && action.type) {
        switch(action.type) {
            case ActionTypes.RESET_STORE:
                return {};

            case ActionTypes.SET_DATA:
                if(action.data.people) return action.data.people.reduce((object, person) => {object[person._id] = person; return object}, {});
                return state;

            default:
                return state;
        }
    } else return state;
}

export default PeopleReducer;