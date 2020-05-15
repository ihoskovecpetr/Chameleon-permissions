import * as server from '../../lib/serverData';
import * as StringFormatter from '../../lib/stringFormatHelper';

// Action types
const FETCH_K2_PROJECTS_BEGIN = 'my-app/project/FETCH_K2_PROJECTS_BEGIN';
const FETCH_K2_PROJECTS_SUCCESS = 'my-app/project/FETCH_K2_PROJECTS_SUCCESS';
const FETCH_K2_PROJECTS_FAILURE = 'my-app/project/FETCH_K2_PROJECTS_FAILURE';

const FETCH_AD_PROJECTS_BEGIN = 'my-app/project/FETCH_AD_PROJECTS_BEGIN';
const FETCH_AD_PROJECTS_SUCCESS = 'my-app/project/FETCH_AD_PROJECTS_SUCCESS';
const FETCH_AD_PROJECTS_FAILURE = 'my-app/project/FETCH_AD_PROJECTS_FAILURE';

const SET_ACTIVE_PROJECT = 'my-app/project/SET_ACTIVE_PROJECT';
const CLEAN_ACTIVE_PROJECT = 'my-app/project/CLEAN_ACTIVE_PROJECT';

const SET_SEARCH_TEXT = 'my-app/project/SET_SEARCH_TEXT';

const initialState = {
  k2Projects: {
    loading: false,
    error: null,
    projects: []
  },
  ADProjects:{
    loading: false,
    error: null,
    projects: []
  }
  };

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {

      case FETCH_K2_PROJECTS_BEGIN:
        return {
          ...state, 
          k2Projects: {
            loading: true,
            error: null,
            projects: []
          }

        };
  
    case FETCH_K2_PROJECTS_SUCCESS:

      console.log("K2 payload: ", action.payload)
  
        return {
          ...state,
          k2Projects: {
            loading: false,
            error: null,
            projects: action.payload.projects
          }
        };
  
    case FETCH_K2_PROJECTS_FAILURE:
  
        return {
          ...state,
          k2Projects: {
            loading: false,
            error: action.payload.error,
            projects: []
          }
        };

// FETCH AD projects reducer

    case FETCH_AD_PROJECTS_BEGIN:
      return {
        ...state,
        ADProjects: {
          loading: true,
          error: null,
          items: null
        }
      };

    case FETCH_AD_PROJECTS_SUCCESS:
    console.log("SAVIBNG TO RET: ", action.payload.projects)
      return {
        ...state,
        ADProjects: {
          loading: false,
          items: action.payload.projects
        }
      };

    case FETCH_AD_PROJECTS_FAILURE:

      return {
        ...state,
        ADProjects: {
          loading: false,
          error: action.payload.error,
          items: []
        }
      };

// mark ACTIVE project reducer

      case SET_ACTIVE_PROJECT:

        return {
            ...state,
            activeProject: action.payload.projectObj
        };

    case CLEAN_ACTIVE_PROJECT:

        return {
            ...state,
            activeProject: null,
        };

//Set Search Text

      case SET_SEARCH_TEXT:

      console.log("SET_SEARCH_TEXT:::: ")

        return {
            ...state,
            searchText: action.payload.searchText,
        };


    default: 
        return state;
  }
}

// Action Creators

// FETCH Projects from DB with K2 connection

export function fetchK2Projects() {

  return dispatch => {
    dispatch(fetchK2ProjectsBegin());
    console.time("Pre call")
    return server.getK2Projects()
      .then(json => {
          console.log("json K2 Active PRJ: ", Date.now())
          console.timeEnd("Pre call");

        dispatch(fetchK2ProjectsSuccess(json))
      //   fetchGroupMembers(StringFormatter.getProjectNamesFromArr(json.userData))
        return json;
      })
      .catch(error =>
        dispatch(fetchK2ProjectsFailure(error))
      );
  };
}

export const fetchK2ProjectsBegin = () => ({
type: FETCH_K2_PROJECTS_BEGIN
});

export const fetchK2ProjectsSuccess = data => ({
type: FETCH_K2_PROJECTS_SUCCESS,
payload: { projects: data }
});

export const fetchK2ProjectsFailure = error => ({
type: FETCH_K2_PROJECTS_FAILURE,
payload: { error }
});



// FETCH my AD projects 
export function fetchADProjects() {
  console.log("fetchProjects: START ")
return dispatch => {
  dispatch(fetchProjectsBegin());
  return server.getMyGroups()
    .then(json => {
        console.log("json fetchADProjects getMyGroups:  ", json)
      dispatch(fetchProjectsSuccess(StringFormatter.getProjectNamesFromArr(json.userData)))
    //   fetchGroupMembers(StringFormatter.getProjectNamesFromArr(json.userData))
      return json;
    })
    .catch(error =>
      dispatch(fetchProjectsFailure(error))
    );
};
}

export const fetchProjectsBegin = () => ({
type: FETCH_AD_PROJECTS_BEGIN
});

export const fetchProjectsSuccess = data => {
  console.log("I got data from AD here: ", data)
  return ({
      type: FETCH_AD_PROJECTS_SUCCESS,
      payload: { projects: data }
    });
} 

export const fetchProjectsFailure = error => ({
type: FETCH_AD_PROJECTS_FAILURE,
payload: { error }
});


// marking of ACTIVE project

export const setActiveProject = (projectObj) => ({
  type: SET_ACTIVE_PROJECT,
  payload: { projectObj: projectObj }
});

export const cleanActiveProject = () => ({
  type: CLEAN_ACTIVE_PROJECT
});

// marking of ACTIVE project

export const setSearchText = (searchText) => {
  console.log("Fitinr Action searcj ")
  return({
  type: SET_SEARCH_TEXT,
  payload: { searchText: searchText }
});}



// export function removeWidget(widget) {
//   return { type: REMOVE, widget };
// }

// side effects, only as applicable
// e.g. thunks, epics, etc
export function getWidget () {
  return dispatch => get('/widget').then(widget => dispatch(updateWidget(widget)))
}