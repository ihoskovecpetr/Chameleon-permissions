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

        nextDetailId: null
    },
    projects: {},
    people: {},
    companies: {},
    users: {},
    user: null
}