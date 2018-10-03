import * as ViewTypes from "../constants/ViewTypes";
import * as FilterTypes from "../constants/FilterTypes";

export default {
    appState: {
        view: {type: ViewTypes.PROJECT_LIST, selected: null, editable: false}, //TODO
        previousView: [],

        fetching: false,
        message: null,
        dataTimeStamp: null,

        selectedProject: null,
        projectsFilter: [FilterTypes.USER_FILTER, FilterTypes.ACTIVE_PROJECTS_FILTER],
        projectsSearch: '',
        projectsSort: '',
        projectEditedData: {},
        activeBid: false,
        activeBidSearch: '',
        activeBidSort: '',

        selectedPerson: null,
        personsFilter: [],
        personsSearch: '',
        personsSort: '',
        personEditedData: {},

        selectedCompany: null,
        companiesFilter: [],
        companiesSearch: '',
        companiesSort: '',
        companyEditedData: {},

        box: [],
    },
    projects: {},
    persons: {},
    companies: {},
    users: {},
    user: null
}