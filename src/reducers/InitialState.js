import * as ViewTypes from "../constants/ViewTypes";
import * as FilterTypes from "../constants/FilterTypes";

export default {
    appState: {
        view: ViewTypes.PROJECTS_LIST,
        fetching: false,
        message: null,
        dataTimeStamp: null,

        selectedProject: null,
        projectsFilter: [],//[FilterTypes.USER_FILTER, FilterTypes.ACTIVE_PROJECTS_FILTER],
        projectsSearch: '',
        projectsSort: '',
        activeBid: false,
        activeBidSearch: '',
        activeBidSort: '',

        selectedPerson: null,
        personsFilter: [],
        personsSearch: '',
        personsSort: '',

        selectedCompany: null,
        companiesFilter: [],
        companiesSearch: '',
        companiesSort: '',

        box: [],
        selectedBoxItem: null,

        previousView: null,

        editedData: {},

        nextDetailId: null
    },
    projects: {},
    persons: {},
    companies: {},
    users: {},
    user: null
}