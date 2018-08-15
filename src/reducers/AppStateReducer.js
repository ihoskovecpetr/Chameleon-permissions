import * as ViewTypes from '../constants/ViewTypes';
import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
    view: ViewTypes.PROJECTS,
    prevView: null,
    fetching: false,
    message: null,
    dataTimeStamp: null,
    selectedProject: null,
    selectedPerson: null,
    selectedCompany: null,
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

            case ActionTypes.EDIT_PROJECT:
                if(state.view === ViewTypes.PROJECTS) {
                    return {...state, prevView: state.view, view: ViewTypes.PROJECT_DETAIL, selectedProject: action.project};
                } else return state;

            case ActionTypes.CREATE_PROJECT:
                if(state.view === ViewTypes.PROJECTS) {
                    return {...state, prevView: state.view, view: ViewTypes.PROJECT_DETAIL, selectedProject: null};
                } else return state;

            default:
                return state;
        }
    } else return state;
}

export default AppStateReducer;