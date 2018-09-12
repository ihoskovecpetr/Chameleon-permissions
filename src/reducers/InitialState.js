import * as ViewTypes from "../constants/ViewTypes";
import * as FilterTypes from "../constants/FilterTypes";

export default {
    appState: {
        view: ViewTypes.PROJECT_LIST,
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
        selectedBoxItem: null,

        previousView: [],

        nextDetailId: null
    },
    projects: {},
    persons: {},
    companies: {},
    users: {},
    user: null
}