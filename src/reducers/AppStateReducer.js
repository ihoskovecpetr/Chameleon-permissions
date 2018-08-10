import * as LayoutTypes from '../constants/LayoutTypes';
import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
    layout: LayoutTypes.PROJECTS,
    fetching: false,
    message: null,
    dataTimeStamp: null
};

function AppStateReducer(state = initialState, action = null) {
    if(action && action.type) {
        switch(action.type) {

            case ActionTypes.SET_LAYOUT:
                if(action.layout && action.layout !== state.layout) {
                    return {...state, layout: action.layout};
                } else return state;

            case ActionTypes.SET_FETCHING:
                if(action.isFetching !== state.fetching) {
                    if(action.isFetching) return {...state, fetching: action.isFetching};
                    else return {...state, fetching: action.isFetching, dataTimeStamp: +new Date()};
                } else return state;

            case ActionTypes.SET_MESSAGE:
                if(action.message !== state.message) {
                    return {...state, message: action.message};
                } else return state;

            default:
                return state;
        }
    } else return state;
}

export default AppStateReducer;