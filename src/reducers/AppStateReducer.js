import * as ViewTypes from '../constants/ViewTypes';
import * as ActionTypes from '../constants/ActionTypes';

function AppStateReducer(state = null, action = null) {
    if(action && action.type) {
        switch(action.type) {
            // data
            case ActionTypes.SET_DATA:
                if(state.box.length > 0) {
                    let ids = [];
                    if(action.data.projects) ids = ids.concat(action.data.projects.map(item => item._id));
                    if(action.data.companies) ids = ids.concat(action.data.companies.map(item => item._id));
                    if(action.data.persons) ids = ids.concat(action.data.persons.map(item => item._id));
                    const newBox = [...state.box].filter(boxId => ids.indexOf(boxId) >= 0);
                    if(newBox.length < state.box.length) return {...state, box: newBox}; //TODO set to null selectedObjects if they are missing in new update
                    else return state;
                } else return state;
            case ActionTypes.RESET_STORE:
                return {...state, selectedProject: null, selectedPerson: null, selectedCompany: null, selectedBoxItem: null, nextDetailId: null, box: []};
            // routing, info
            case ActionTypes.SET_VIEW:
                if(action.view && action.view !== state.view) {
                    return {...state, view: action.view, previousView: action.view === ViewTypes.PROJECT_DETAIL_NEXT || action.view === ViewTypes.PERSON_DETAIL_NEXT || action.view === ViewTypes.COMPANY_DETAIL_NEXT ? state.view : null};
                } else return state;

            case ActionTypes.RETURN_TO_PREVIOUS_VIEW:
                    if(state.previousView) {
                        let previousView = null;
                        switch(state.previousView) {
                            case ViewTypes.PROJECT_EDIT:
                            case ViewTypes.PROJECT_DETAIL:
                                previousView = ViewTypes.PROJECTS_LIST;
                                break;
                            case ViewTypes.COMPANY_EDIT:
                            case ViewTypes.COMPANY_DETAIL:
                                previousView = ViewTypes.COMPANIES_LIST;
                                break;
                            case ViewTypes.PERSON_EDIT:
                            case ViewTypes.PERSON_DETAIL:
                                previousView = ViewTypes.PERSONS_LIST;
                                break;
                        }
                        return {...state, view: state.previousView, previousView: previousView};
                    } else return {...state, view: ViewTypes.PROJECTS_LIST, previousView: null};

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
                        return {...state, selectedProject: action.id, view: ViewTypes.PROJECT_DETAIL, previousView: ViewTypes.PROJECTS_LIST};
                    } else {
                        return {...state, view: ViewTypes.PROJECT_DETAIL, previousView: ViewTypes.PROJECTS_LIST};
                    }
                } else {
                    if(state.selectedProject) {
                        return {...state, view: ViewTypes.PROJECT_DETAIL, previousView: ViewTypes.PROJECTS_LIST};
                    } else return state;
                }

            case ActionTypes.SHOW_PROJECT_NEXT:
                if(action.id && action.id !== state.nextDetailId) {
                    return {...state, nextDetailId: action.id, view: ViewTypes.PROJECT_DETAIL_NEXT, previousView: state.view === ViewTypes.PROJECT_DETAIL || state.view === ViewTypes.PERSON_DETAIL || state.view === ViewTypes.COMPANY_DETAIL || state.view === ViewTypes.BOX ? state.view : state.previousView};
                } else return state;

            case ActionTypes.EDIT_PROJECT:
                if(action.id) {
                    if(action.id !== state.selectedProject) {
                        return {...state, selectedProject: action.id, view: ViewTypes.PROJECT_EDIT, editedData: {}, previousView: ViewTypes.PROJECTS_LIST};
                    } else {
                        return {...state, view: ViewTypes.PROJECT_EDIT, editedData: {}, previousView: ViewTypes.PROJECTS_LIST};
                    }
                } else {
                    if(state.selectedProject) {
                        return {...state, view: ViewTypes.PROJECT_EDIT, editedData: {}, previousView: ViewTypes.PROJECTS_LIST};
                    } else return state;
                }

            case ActionTypes.ADD_PROJECT:
                return {...state, editedData: {status: 'PREBID'}, selectedProject: null, view: ViewTypes.PROJECT_EDIT, previousView: ViewTypes.PROJECTS_LIST};

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

            case ActionTypes.SET_ACTIVE_BID_SORT:
                if(typeof action.sort !== 'undefined' && action.sort !== state.activeBidSort) {
                    return {...state, activeBidSort: action.sort}
                } else return state;

            case ActionTypes.SET_ACTIVE_BID_SEARCH:
                if(typeof action.search !== 'undefined' && action.search !== state.activeBidSearch) {
                    return {...state, activeBidSearch: action.search}
                } else return state;

            case ActionTypes.CREATE_PROJECT:
                if(action.project && action.project._id) {
                    return {...state, selectedProject: action.project._id};
                } else return state;

            case ActionTypes.REMOVE_PROJECT:
                if(action.project) {
                    const boxIndex = state.box.indexOf(action.project);
                    const isSelected = state.selectedProject === action.project;
                    if(boxIndex >= 0 || isSelected) {
                        const selectedProject = isSelected ? null : state.selectedProject;
                        const box = boxIndex >= 0 ? [...state.box] : state.box;
                        if(boxIndex >= 0 ) box.splice(boxIndex, 1);
                        return {...state, selectedProject: selectedProject, box: box};
                    } else return state;
                } else return state;

            // *********************************************************************************************************
            // COMPANIES
            // *********************************************************************************************************
            case ActionTypes.SELECT_COMPANY:
                if((action.id || action.id === null) && action.id !== state.selectedCompany) {
                    return {...state, selectedCompany: action.id};
                } else return state;

            case ActionTypes.SHOW_COMPANY:
                if(action.id) {
                    if(action.id !== state.selectedCompany) {
                        return {...state, selectedCompany: action.id, view: ViewTypes.COMPANY_DETAIL, previousView: ViewTypes.COMPANIES_LIST};
                    } else {
                        return {...state, view: ViewTypes.COMPANY_DETAIL, previousView: ViewTypes.COMPANIES_LIST};
                    }
                } else {
                    if(state.selectedCompany) {
                        return {...state, view: ViewTypes.COMPANY_DETAIL, previousView: ViewTypes.COMPANIES_LIST};
                    } else return state;
                }

            case ActionTypes.SHOW_COMPANY_NEXT:
                if(action.id && action.id !== state.nextDetailId) {
                    return {...state, nextDetailId: action.id, view: ViewTypes.COMPANY_DETAIL_NEXT, previousView: state.view === ViewTypes.PROJECT_DETAIL || state.view === ViewTypes.PERSON_DETAIL || state.view === ViewTypes.COMPANY_DETAIL ? state.view : state.previousView};
                } else return state;

            case ActionTypes.EDIT_COMPANY:
                if(action.id) {
                    if(action.id !== state.selectedCompany) {
                        return {...state, selectedCompany: action.id, view: ViewTypes.COMPANY_EDIT, editedData: {}, previousView: ViewTypes.COMPANIES_LIST};
                    } else {
                        return {...state, view: ViewTypes.COMPANY_EDIT, editedData: {}, previousView: ViewTypes.COMPANIES_LIST};
                    }
                } else {
                    if(state.selectedCompany) {
                        return {...state, view: ViewTypes.COMPANY_EDIT, editedData: {}, previousView: ViewTypes.COMPANIES_LIST};
                    } else return state;
                }

            case ActionTypes.ADD_COMPANY:
                return {...state, editedData: {}, selectedCompany: null, view: ViewTypes.COMPANY_EDIT, previousView: ViewTypes.COMPANIES_LIST};

            case ActionTypes.SET_COMPANIES_FILTER:
                if(action.filter) {
                    if(Array.isArray(action.filter)) {
                        if(state.companiesFilter.length !== action.filter.length) return {...state, companiesFilter: action.filter};
                        for(const filter of action.filter) {
                            if(state.companiesFilter.indexOf(filter) < 0) return {...state, companiesFilter: action.filter};
                        }
                        return state;
                    } else {
                        const index = state.companiesFilter.indexOf(action.filter);
                        if(action.state) {
                            if(index < 0) return {...state, companiesFilter: [...state.companiesFilter, action.filter]};
                            else return state;
                        } else {
                            if(index >= 0) {
                                const filter = [...state.companiesFilter];
                                filter.splice(index, 1);
                                return {...state, companiesFilter: filter};
                            } else return state;
                        }
                    }
                } else return state;

            case ActionTypes.SET_COMPANIES_SORT:
                if(typeof action.sort !== 'undefined' && action.sort !== state.companiesSort) {
                    return {...state, companiesSort: action.sort}
                } else return state;

            case ActionTypes.SET_COMPANIES_SEARCH:
                if(typeof action.search !== 'undefined' && action.search !== state.companiesSearch) {
                    return {...state, companiesSearch: action.search}
                } else return state;


            case ActionTypes.CREATE_COMPANY:
                if(action.company && action.company._id) {
                    return {...state, selectedCompany: action.company._id};
                } else return state;

            case ActionTypes.REMOVE_COMPANY:
                if(action.company) {
                    const boxIndex = state.box.indexOf(action.company);
                    const isSelected = state.selectedCompany === action.company;
                    if(boxIndex >= 0 || isSelected) {
                        const selectedCompany = isSelected ? null : state.selectedCompany;
                        const box = boxIndex >= 0 ? [...state.box] : state.box;
                        if(boxIndex >= 0 ) box.splice(boxIndex, 1);
                        return {...state, selectedCompany: selectedCompany, box: box};
                    } else return state;
                } else return state;

            // *********************************************************************************************************
            // PERSONS
            // *********************************************************************************************************
            case ActionTypes.SELECT_PERSON:
                if((action.id || action.id === null) && action.id !== state.selectedPerson) {
                    return {...state, selectedPerson: action.id};
                } else return state;

            case ActionTypes.SHOW_PERSON:
                if(action.id) {
                    if(action.id !== state.selectedPerson) {
                        return {...state, selectedPerson: action.id, view: ViewTypes.PERSON_DETAIL, previousView: ViewTypes.PERSONS_LIST};
                    } else {
                        return {...state, view: ViewTypes.PERSON_DETAIL, previousView: ViewTypes.PERSONS_LIST};
                    }
                } else {
                    if(state.selectedPerson) {
                        return {...state, view: ViewTypes.PERSON_DETAIL, previousView: ViewTypes.PERSONS_LIST};
                    } else return state;
                }

            case ActionTypes.SHOW_PERSON_NEXT:
                if(action.id && action.id !== state.nextDetailId) {
                    return {...state, nextDetailId: action.id, view: ViewTypes.PERSON_DETAIL_NEXT, previousView: state.view === ViewTypes.PROJECT_DETAIL || state.view === ViewTypes.PERSON_DETAIL || state.view === ViewTypes.COMPANY_DETAIL ? state.view : state.previousView};
                } else return state;

            case ActionTypes.EDIT_PERSON:
                if(action.id) {
                    if(action.id !== state.selectedPerson) {
                        return {...state, selectedPerson: action.id, view: ViewTypes.PERSON_EDIT, editedData: {}, previousView: ViewTypes.PERSONS_LIST};
                    } else {
                        return {...state, view: ViewTypes.PERSON_EDIT, editedData: {}, previousView: ViewTypes.PERSONS_LIST};
                    }
                } else {
                    if(state.selectedPerson) {
                        return {...state, view: ViewTypes.PERSON_EDIT, editedData: {}, previousView: ViewTypes.PERSONS_LIST};
                    } else return state;
                }

            case ActionTypes.ADD_PERSON:
                return {...state, editedData: {}, selectedPerson: null, view: ViewTypes.PERSON_EDIT, previousView: ViewTypes.PERSONS_LIST};

            case ActionTypes.SET_PERSONS_FILTER:
                if(action.filter) {
                    if(Array.isArray(action.filter)) {
                        if(state.personsFilter.length !== action.filter.length) return {...state, personsFilter: action.filter};
                        for(const filter of action.filter) {
                            if(state.personsFilter.indexOf(filter) < 0) return {...state, personsFilter: action.filter};
                        }
                        return state;
                    } else {
                        const index = state.personsFilter.indexOf(action.filter);
                        if(action.state) {
                            if(index < 0) return {...state, personsFilter: [...state.personsFilter, action.filter]};
                            else return state;
                        } else {
                            if(index >= 0) {
                                const filter = [...state.personsFilter];
                                filter.splice(index, 1);
                                return {...state, personsFilter: filter};
                            } else return state;
                        }
                    }
                } else return state;

            case ActionTypes.SET_PERSONS_SORT:
                if(typeof action.sort !== 'undefined' && action.sort !== state.personsSort) {
                    return {...state, personsSort: action.sort}
                } else return state;

            case ActionTypes.SET_PERSONS_SEARCH:
                if(typeof action.search !== 'undefined' && action.search !== state.personsSearch) {
                    return {...state, personsSearch: action.search}
                } else return state;


            case ActionTypes.CREATE_PERSON:
                if(action.person && action.person._id) {
                    return {...state, selectedPerson: action.person._id};
                } else return state;

            case ActionTypes.REMOVE_PERSON:
                if(action.person) {
                    const boxIndex = state.box.indexOf(action.person);
                    const isSelected = state.selectedPerson === action.person;
                    if(boxIndex >= 0 || isSelected) {
                        const selectedCompany = isSelected ? null : state.selectedPerson;
                        const box = boxIndex >= 0 ? [...state.box] : state.box;
                        if(boxIndex >= 0 ) box.splice(boxIndex, 1);
                        return {...state, selectedPerson: selectedCompany, box: box};
                    } else return state;
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
                if(state.box.length > 0) return {...state, box: []};
                else return state;

            default:
                return state;
        }
    } else return state;
}

export default AppStateReducer;