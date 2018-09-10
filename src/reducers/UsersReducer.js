import * as ActionTypes from "../actions/ActionTypes";

function UsersReducer (state = null, action = null) {
    if(action && action.type) {
        switch(action.type) {
            case ActionTypes.RESET_STORE:
                return {};

            case ActionTypes.SET_DATA:
                if(action.data.users) return action.data.users.reduce((object, user) => {object[user._id] = user; return object}, {});
                return state;

            default:
                return state;
        }
    } else return state;
}

export default UsersReducer;