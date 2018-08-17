import * as ViewTypes from '../constants/ViewTypes';
import * as ActionTypes from '../constants/ActionTypes';
import * as FilterTypes from '../constants/FilterTypes';

const initialState = {
    view: ViewTypes.PROJECTS_LIST,
    prevView: null,
    fetching: false,
    message: null,
    dataTimeStamp: null,

    selectedProject: null,
    editedProject: {},
    projectsFilter: [],//[FilterTypes.USER_FILTER, FilterTypes.ACTIVE_PROJECTS_FILTER],
    projectsSearch: '',
    projectsSort: '',

    selectedPerson: null,
    editedPerson: {},
    peopleFilter: [],
    peopleSearch: '',
    peopleSort: '',

    selectedCompany: null,
    editedCompany: {},
    companiesFilter: [],
    companiesSearch: '',
    companiesSort: '',

    box: ['a', 'b', 'c']
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

            case ActionTypes.SET_PROJECTS_FILTER:
                if(action.filter) {
                    if(Array.isArray(action.filter)) {
                        if(state.projectsFilter.length !== action.filter.length) return {...state, projectsFilter: action.filter};
                        for(const filter of action.filter) {
                            if(state.projectsFilter.indexOf(filter) < 0) return {...state, projectsFilter: action.filter};
                        }
                        return state;
                    } else {
                        const index = state.projectsFilter.indexOf(action.filter);
                        if(action.state) {
                            if(index < 0) return {...state, projectsFilter: [...state.projectsFilter, action.filter]};
                            else return state;
                        } else {
                            if(index >= 0) {
                                const filter = [...state.projectsFilter];
                                filter.splice(index, 1);
                                return {...state, projectsFilter: filter};
                            } else return state;
                        }
                    }
                } else return state;

            case ActionTypes.SET_PROJECTS_SORT:
                if(typeof action.sort !== 'undefined' && action.sort !== state.projectsSort) {
                    return {...state, projectsSort: action.sort}
                } else return state;

            case ActionTypes.SET_PROJECTS_SERACH:
                if(typeof action.search !== 'undefined' && action.search !== state.projectsSearch) {
                    return {...state, projectsSearch: action.search}
                } else return state;

            default:
                return state;
        }
    } else return state;
}

export default AppStateReducer;