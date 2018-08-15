import * as ViewTypes from '../constants/ViewTypes';
import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
    view: ViewTypes.PROJECT_LIST,
    prevView: null,
    fetching: false,
    message: null,
    dataTimeStamp: null,
    selectedProject: null,
    editedProject: {},
    selectedPerson: null,
    editedPerson: {},
    selectedCompany: null,
    editedCompany: {},
    box: []
};

function AppStateReducer(state = initialState, action = null) {
    if(action && action.type) {
        switch(action.type) {

            case ActionTypes.SET_VIEW:
                if(action.view && action.view !== state.view) {
                    return {...state, prevView: state.view,  view: action.view};
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

            case ActionTypes.SELECT_PROJECT:
                if((action.id || action.id === null) && action.id !== state.selectedProject) {
                    return {...state, selectedProject: action.id, editedProject: {}};
                } else return state;

            case ActionTypes.EDIT_PROJECT:
                if(action.project) {
                    return {...state, editedProject: action.project};
                } else return state;

            default:
                return state;
        }
    } else return state;
}

export default AppStateReducer;