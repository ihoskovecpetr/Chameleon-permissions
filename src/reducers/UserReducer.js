import * as ActionTypes from '../constants/ActionTypes';

function UserReducer (state = null, action = null) {
    if(action && action.type) {
        switch(action.type) {
            case ActionTypes.SET_USER:
                return action.user;
            default:
                return state;
        }
    } else return state;
}

export default UserReducer;