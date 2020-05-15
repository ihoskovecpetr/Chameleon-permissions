import * as ActionTypes from '../actions_redux/ActionTypes';

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