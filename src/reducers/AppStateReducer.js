import * as ViewTypes from '../constants/ViewTypes';
import * as ActionTypes from '../actions/ActionTypes';
import * as ProjectStatus from '../constants/ProjectStatus';

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
                return {...state, selectedProject: null, selectedPerson: null, selectedCompany: null, box: []};
            // routing, info
            case ActionTypes.SET_VIEW: //Only from header
                if(action.view && action.view !== state.view.type) {
                    const selected = action.view === ViewTypes.PROJECT_LIST ? state.selectedProject : action.view === ViewTypes.PERSON_LIST ? state.selectedPerson : action.view === ViewTypes.COMPANY_LIST ? state.selectedCompany : action.view === ViewTypes.BOX_LIST ? null : -1 ;
                    if(selected === -1) return state;
                    return {...state, view: {type: action.view, selected: selected, editable: false}, previousView : []};
                } else return state;

            case ActionTypes.RETURN_TO_PREVIOUS_VIEW:
                if(state.previousView && state.previousView.length > 0) {
                    const previousView = [...state.previousView];
                    const view = previousView.pop();
                    return {...state, view: view, previousView: previousView};
                } else return {...state, view: {type: ViewTypes.PROJECT_LIST, selected: null, editable: false}, previousView: []};

            case ActionTypes.SET_FETCHING:
                if(action.isFetching !== state.fetching) {
                    if(action.isFetching) return {...state, fetching: action.isFetching};
                    else return {...state, fetching: action.isFetching, dataTimeStamp: +new Date()};
                } else return state;

            case ActionTypes.SET_MESSAGE:
                if(action.message !== state.message) {
                    return {...state, message: action.message};
                } else return state;

            case ActionTypes.SET_ACTIVE_BID:
                if(typeof action.activeBid !== 'undefined' && action.activeBid !== state.activeBid) {
                    return {...state, activeBid: action.activeBid};
                } else return state;

            case ActionTypes.SET_JUST_ADDED_OBJECT:
                if(typeof action.data === 'undefined' || state.previousView.length === 0) return state;
                const lastView = state.previousView[state.previousView.length - 1];
                switch (lastView.type) {
                    case ViewTypes.PROJECT_EDIT:
                        const personIndex = state.projectEditedData && state.projectEditedData.person && state.projectEditedData.person.length > 0 ? state.projectEditedData.person.findIndex(person => person.waiting) : -1;
                        const companyIndex = state.projectEditedData && state.projectEditedData.company && state.projectEditedData.company.length > 0 ? state.projectEditedData.company.findIndex(company => company.waiting) : -1;
                        if(personIndex >= 0) {
                            const newPerson = [...state.projectEditedData.person];
                            delete newPerson[personIndex].waiting;
                            if(action.data && action.data._id) newPerson[personIndex] = {id: action.data._id, profession: action.data.profession ? action.data.profession : [], flag: [], note: ''};
                            return {...state, projectEditedData: {...state.projectEditedData, person: newPerson}}
                        }
                        if (companyIndex >= 0) {
                            const newCompany = [...state.projectEditedData.company];
                            delete newCompany[companyIndex].waiting;
                            if(action.data && action.data._id) newCompany[companyIndex] = {id: action.data._id, business: action.data.business ? action.data.business : [], flag: [], note: ''};
                            return {...state, projectEditedData: {...state.projectEditedData, company: newCompany}}
                        } else return state;
                    case ViewTypes.PERSON_LIST: //TODO *********************
                        if(action.data) {
                            console.log('Add company to person');
                            return state
                        } else return state;
                    case ViewTypes.COMPANY_EDIT:
                        if(action.data) {
                            return {...state, companyEditedData: {...state.companyEditedData, person: [...state.companyEditedData.person, action.data._id]}};
                        } else return state;
                    default: return state;
                }

            // *********************************************************************************************************
            // PROJECTS
            // *********************************************************************************************************
            case ActionTypes.SELECT_PROJECT:
                if((action.id || action.id === null) && action.id !== state.selectedProject) {
                    return {...state, selectedProject: action.id, view: {...state.view, selected: action.id}};
                } else return state;

            case ActionTypes.SHOW_PROJECT:
                return {...state, selectedProject: action.set ? action.id : state.selectedProject, view: {type: ViewTypes.PROJECT_DETAIL, selected: action.id ? action.id : state.selectedProject, editable: !action.disableEdit}, previousView: [...state.previousView, {...state.view, selected: action.set ? action.id : state.view.selected}]};

            case ActionTypes.EDIT_PROJECT:
                return {...state, projectEditedData: {}, selectedProject: action.set ? action.id : state.selectedProject, view: {type: ViewTypes.PROJECT_EDIT, selected: action.id ? action.id : state.selectedProject, editable: !action.disableEdit}, previousView: [...state.previousView, {...state.view, selected: action.set ? action.id : state.view.selected}]};

            case ActionTypes.ADD_PROJECT:
                return {...state, projectEditedData: {status: ProjectStatus.PRE_BID.id}, view: {type: ViewTypes.PROJECT_EDIT, selected: null, editable: false}, previousView: [...state.previousView, state.view]};

            case ActionTypes.CHANGE_PROJECT_EDIT_DATA:
                if(action.data) {
                    return {...state, projectEditedData: action.data};
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
                    return {...state, selectedCompany: action.id, view: {...state.view, selected: action.id}};
                } else return state;

            case ActionTypes.SHOW_COMPANY:
                return {...state, selectedCompany: action.set ? action.id : state.selectedCompany, view: {type: ViewTypes.COMPANY_DETAIL, selected: action.id ? action.id : state.selectedCompany, editable: !action.disableEdit}, previousView: [...state.previousView, {...state.view, selected: action.set ? action.id : state.view.selected}]};

            case ActionTypes.EDIT_COMPANY:
                return {...state, companyEditedData: {}, selectedCompany: action.set ? action.id : state.selectedCompany, view: {type: ViewTypes.COMPANY_EDIT, selected: action.id ? action.id : state.selectedCompany, editable: !action.disableEdit}, previousView: [...state.previousView, {...state.view, selected: action.set ? action.id : state.view.selected}]};

            case ActionTypes.ADD_COMPANY:
                if(typeof action.name === 'undefined') return {...state, companyEditedData: {}, view: {type: ViewTypes.COMPANY_EDIT, selected: null, editable: false}, previousView: [...state.previousView, state.view]};
                else return {...state, companyEditedData: {name: action.name}, view: {type: ViewTypes.COMPANY_EDIT, selected: null, editable: false}, previousView: [...state.previousView, state.view]};

            case ActionTypes.CHANGE_COMPANY_EDIT_DATA:
                if(action.data) {
                    return {...state, companyEditedData: action.data};
                } else return state;

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
                    return {...state, selectedPerson: action.id, view: {...state.view, selected: action.id}};
                } else return state;

            case ActionTypes.SHOW_PERSON:
                return {...state, selectedPerson: action.set ? action.id : state.selectedPerson, view: {type: ViewTypes.PERSON_DETAIL, selected: action.id ? action.id : state.selectedPerson, editable: !action.disableEdit}, previousView: [...state.previousView, {...state.view, selected: action.set ? action.id : state.view.selected}]};

                case ActionTypes.EDIT_PERSON:
                return {...state, personEditedData: {}, selectedPerson: action.set ? action.id : state.selectedPerson, view: {type: ViewTypes.PERSON_EDIT, selected: action.id ? action.id : state.selectedPerson, editable: !action.disableEdit}, previousView: [...state.previousView, {...state.view, selected: action.set ? action.id : state.view.selected}]};

                case ActionTypes.ADD_PERSON:
                if(typeof action.name === 'undefined') return {...state, personEditedData: {}, view: {type: ViewTypes.PERSON_EDIT, selected: null, editable: false}, previousView: [...state.previousView, state.view]};
                else return {...state, personEditedData: {name: action.name}, view: {type: ViewTypes.PERSON_EDIT, selected: null, editable: false}, previousView: [...state.previousView, state.view]};

            case ActionTypes.CHANGE_PERSON_EDIT_DATA:
                if(action.data) {
                    return {...state, personEditedData: action.data};
                } else return state;

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