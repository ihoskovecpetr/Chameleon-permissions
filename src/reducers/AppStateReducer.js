import * as ViewTypes from '../constants/ViewTypes';
import * as ActionTypes from '../constants/ActionTypes';
import * as FilterTypes from '../constants/FilterTypes';

const initialState = {
    view: ViewTypes.PROJECTS_LIST,
    fetching: false,
    message: null,
    dataTimeStamp: null,

    selectedProject: null,
    projectsFilter: [],//[FilterTypes.USER_FILTER, FilterTypes.ACTIVE_PROJECTS_FILTER],
    projectsSearch: '',
    projectsSort: '',

    selectedPerson: null,
    peopleFilter: [],
    peopleSearch: '',
    peopleSort: '',

    selectedCompany: null,
    companiesFilter: [],
    companiesSearch: '',
    companiesSort: '',

    box: [],
    selectedBoxItem: null,

    previousView: null,

    editedData: {},

    subDetailId: null

};

function AppStateReducer(state = initialState, action = null) {
    if(action && action.type) {
        switch(action.type) {

            case ActionTypes.SET_VIEW:
                if(action.view && action.view !== state.view) {
                    const storePrevious = state.view !== ViewTypes.SUB_PROJECT_DETAIL && state.view !== ViewTypes.SUB_PERSON_DETAIL && state.view !== ViewTypes.SUB_COMPANY_DETAIL;
                    return {...state, previousView: storePrevious ? state.view : state.previousView,  view: action.view};
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

            case ActionTypes.SELECT_BOX_ITEM:
                if(action.id) {
                    return {...state, selectedBoxItem: action.id};
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

            case ActionTypes.ADD_TO_BOX:
                if(action.id && state.box.indexOf(action.id) < 0) return {...state, box: [...state.box, action.id]};
                else return state;

            case ActionTypes.REMOVE_FROM_BOX:
                if(action.id) {
                    const index = state.box.indexOf(action.id);
                    if(index >= 0) {
                        const newBox = [...state.box];
                        newBox.splice(index, 1);
                        return {...state, box: newBox};
                    } else return state;
                } else return state;

            case ActionTypes.EMPTY_BOX:
                if(state.box.length > 0) return {...state, box: []}
                else return state;

            default:
                return state;
        }
    } else return state;
}

export default AppStateReducer;