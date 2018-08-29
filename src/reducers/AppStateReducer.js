import * as ViewTypes from '../constants/ViewTypes';
import * as ActionTypes from '../constants/ActionTypes';
import * as ProjectStatus from '../constants/ProjectStatus';

function AppStateReducer(state = null, action = null) {
    if(action && action.type) {
        switch(action.type) {
            // routing, info
            case ActionTypes.SET_VIEW:
                if(action.view && action.view !== state.view) {
                    return {...state, view: action.view, previousView: action.view === ViewTypes.PROJECT_DETAIL_NEXT || action.view === ViewTypes.PERSON_DETAI_NEXT || action.view === ViewTypes.COMPANY_DETAIL_NEXT ? state.view : null};
                } else return state;

            case ActionTypes.RETURN_TO_PREVIOUS_VIEW:
                    switch(state.view) {
                        case ViewTypes.PROJECT_EDIT:
                        case ViewTypes.PROJECT_DETAIL:
                            return {...state, view: ViewTypes.PROJECTS_LIST, previousView: null};
                        case ViewTypes.PROJECT_DETAIL_NEXT:
                            return {...state, view: state.previousView ? state.previousView : state.view, previousView: null};
                        default: return state;
                    }

            case ActionTypes.SET_FETCHING:
                if(action.isFetching !== state.fetching) {
                    if(action.isFetching) return {...state, fetching: action.isFetching};
                    else return {...state, fetching: action.isFetching, dataTimeStamp: +new Date()};
                } else return state;

            case ActionTypes.SET_MESSAGE:
                if(action.message !== state.message) {
                    return {...state, message: action.message};
                } else return state;

            case ActionTypes.EDIT_ITEM:
                if(action.data) {
                    return {...state, editedData: action.data};
                } else return state;

            case ActionTypes.SET_ACTIVE_BID:
                if(typeof action.activeBid !== 'undefined' && action.activeBid !== state.activeBid) {
                    return {...state, activeBid: action.activeBid};
                } else return state;

            // *********************************************************************************************************
            // PROJECTS
            // *********************************************************************************************************
            case ActionTypes.SELECT_PROJECT:
                if((action.id || action.id === null) && action.id !== state.selectedProject) {
                    return {...state, selectedProject: action.id};
                } else return state;

            case ActionTypes.SHOW_PROJECT:
                if(action.id) {
                    if(action.id !== state.selectedProject) {
                        return {...state, selectedProject: action.id, view: ViewTypes.PROJECT_DETAIL};
                    } else {
                        return {...state, view: ViewTypes.PROJECT_DETAIL};
                    }
                } else {
                    if(state.selectedProject) {
                        return {...state, view: ViewTypes.PROJECT_DETAIL};
                    } else return state;
                }

            case ActionTypes.SHOW_PROJECT_NEXT:
                if(action.id && action.id !== state.nextDetailId) {
                    return {...state, nextDetailId: action.id, view: ViewTypes.PROJECT_DETAIL_NEXT, previousView: state.view === ViewTypes.PROJECT_DETAIL || state.view === ViewTypes.PERSON_DETAIL || state.view === ViewTypes.COMPANY_DETAIL ? state.view : state.previousView};
                } else return state;

            case ActionTypes.EDIT_PROJECT:
                if(action.id) {
                    if(action.id !== state.selectedProject) {
                        return {...state, selectedProject: action.id, view: ViewTypes.PROJECT_EDIT, editedData: {}};
                    } else {
                        return {...state, view: ViewTypes.PROJECT_EDIT, editedData: {}};
                    }
                } else {
                    if(state.selectedProject) {
                        return {...state, view: ViewTypes.PROJECT_EDIT, editedData: {}};
                    } else return state;
                }

            case ActionTypes.ADD_PROJECT:
                return {...state, editedData: {status: 'PREBID'}, selectedProject: null, view: ViewTypes.PROJECT_EDIT};

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

            case ActionTypes.SET_PROJECTS_SEARCH:
                if(typeof action.search !== 'undefined' && action.search !== state.projectsSearch) {
                    return {...state, projectsSearch: action.search}
                } else return state;

            case ActionTypes.CREATE_PROJECT:
                if(action.project && action.project._id) {
                    return {...state, selectedProject: action.project._id};
                } else return state;

            case ActionTypes.REMOVE_PROJECT:
                if(action.project && state.selectedProject === action.project) {
                    return {...state, selectedProject: null};
                } else return state;

            // *********************************************************************************************************
            // BOX
            // *********************************************************************************************************
            case ActionTypes.SELECT_BOX_ITEM:
                if(action.id) {
                    return {...state, selectedBoxItem: action.id};
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