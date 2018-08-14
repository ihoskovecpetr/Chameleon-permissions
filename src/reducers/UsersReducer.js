import * as ActionTypes from "../constants/ActionTypes";

function UsersReducer (state = [], action = null) {
    if(action && action.type) {
        switch(action.type) {
            case ActionTypes.SET_DATA:
                if(action.data.users) {
                    state = action.data.users.reduce((object, user) => {object[user._id] = user; return object}, {});
                } else return state;
                return state;
            default:
                return state;
        }
    } else return state;
}

export default UsersReducer;