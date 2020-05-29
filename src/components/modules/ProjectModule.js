import * as server from '../../lib/serverData';
import * as StringFormatter from '../../lib/stringFormatHelper';

// Action types
const FETCH_K2_PROJECTS_BEGIN = 'my-app/project/FETCH_K2_PROJECTS_BEGIN';
const FETCH_K2_PROJECTS_SUCCESS = 'my-app/project/FETCH_K2_PROJECTS_SUCCESS';
const FETCH_K2_PROJECTS_FAILURE = 'my-app/project/FETCH_K2_PROJECTS_FAILURE';

const FETCH_AD_GROUPS_BEGIN = 'my-app/project/FETCH_AD_GROUPS_BEGIN';
const FETCH_AD_GROUPS_SUCCESS = 'my-app/project/FETCH_AD_GROUPS_SUCCESS';
const FETCH_AD_GROUPS_FAILURE = 'my-app/project/FETCH_AD_GROUPS_FAILURE';

const FETCH_AD_MANAGER_GROUPS_BEGIN = 'my-app/project/FETCH_AD_MANAGER_GROUPS_BEGIN';
const FETCH_AD_MANAGER_GROUPS_SUCCESS = 'my-app/project/FETCH_AD_MANAGER_GROUPS_SUCCESS';
const FETCH_AD_MANAGER_GROUPS_FAILURE = 'my-app/project/FETCH_AD_MANAGER_GROUPS_FAILURE';

const SET_ACTIVE_PROJECT = 'my-app/project/SET_ACTIVE_PROJECT';
const CLEAN_ACTIVE_PROJECT = 'my-app/project/CLEAN_ACTIVE_PROJECT';

const SET_SEARCH_TEXT = 'my-app/project/SET_SEARCH_TEXT';

const initialState = {
  k2Projects: {
    loading: false,
    error: null,
    projects: []
  },
  ADGroups:{
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

    case FETCH_AD_GROUPS_BEGIN:
      return {
        ...state,
        ADGroups: {
          loading: true,
          error: null,
          items: null
        }
      };

    case FETCH_AD_GROUPS_SUCCESS:

      const mapItms = action.payload.projects.reduce((acumul, currentValue) => {
          const projectId = currentValue.name.split('_')[1]
          if(acumul[projectId]){
            acumul[projectId] = [...acumul[projectId], currentValue]
          }else{
            acumul[projectId] = [currentValue]
          }
            return acumul
      }, {})


      const mapGroupsName = action.payload.projects.reduce((acumul, currentValue) => {
          const groupName = currentValue.name
          currentValue.roles = currentValue.uppAdvGroupAttribute.split(':')
          if(acumul[groupName]){
            acumul[groupName] = [...acumul[groupName], currentValue]
          }else{
            acumul[groupName] = [currentValue]
          }
            return acumul
      }, {})


      const mapGrpRoles = action.payload.projects.reduce((acumul, currentValue) => {
        console.log("MapRole tohle:: ", currentValue)
        const projectRoles = currentValue.uppAdvGroupAttribute.split(':')

        projectRoles.map(role => {
          if(acumul[role]){
            acumul[role] = [...acumul[role], currentValue]
          }else{
            acumul[role] = [currentValue]
          }
        } )


          return acumul
      }, {})


      return {
        ...state,
        ADGroups: {
          loading: false,
          items: action.payload.projects,
          mapItemsByProjectId: mapItms,
          mapGroupsByName: mapGroupsName,
          mapGroupsByRoles: mapGrpRoles
        }
      };

    case FETCH_AD_GROUPS_FAILURE:

      return {
        ...state,
        ADGroups: {
          loading: false,
          error: action.payload.error,
          items: []
        }
      };


// FETCH AD MANAGER GROUPS

    case FETCH_AD_MANAGER_GROUPS_BEGIN:
      return {
        ...state,
        ADManagerGroups: {
          loading: true,
          error: null,
          XXgroups: []
        }
      };

    case FETCH_AD_MANAGER_GROUPS_SUCCESS:

      const mapGrps = action.payload.projects.reduce((acumul, currentValue) => {
        const projectId = currentValue.name.split('_')[1]
        if(acumul[projectId]){
          acumul[projectId] = [...acumul[projectId], currentValue]
        }else{
          acumul[projectId] = [currentValue]
        }
          return acumul
      }, {})


      const mapGrpsName = action.payload.projects.reduce((acumul, currentValue) => {
        const grpName = currentValue.name
        currentValue.roles = currentValue.uppAdvGroupAttribute.split(':')
        if(acumul[grpName]){
          acumul[grpName] = [...acumul[grpName], currentValue]
        }else{
          acumul[grpName] = [currentValue]
        }
          return acumul
      }, {})


      return {
        ...state,
        ADManagerGroups: {
          loading: false,
          XXgroups: action.payload.projects,
          mapGroupsByProjectId: mapGrps,
          mapGroupsByName: mapGrpsName
        }
      };

    case FETCH_AD_MANAGER_GROUPS_FAILURE:

      return {
        ...state,
        ADManagerGroups: {
          loading: false,
          error: action.payload.error,
          XXgroups: []
        }
      };

// mark ACTIVE project reducer

      case SET_ACTIVE_PROJECT:
    const obj = action.payload.projectObj
          obj.projectADGroups = state.ADGroups.items['test_project'] // MOCK state.ADGroups.items[action.payload.projectObj.K2name]

        return {
            ...state,
            activeProject: obj
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



// FETCH all AD Groups 
export function fetchADGroups() {

  console.log("fetchProjects: START ")
return dispatch => {
  dispatch(fetchADGroupsBegin());
  return server.getAllGroups() // was: getMyGroups()
    .then(json => {
        console.log("json fetchADGroups getMyGroups:  ", json)
        dispatch(fetchADGroupsSuccess(json.allGroups))
        // dispatch(fetchADGroupsSuccess(StringFormatter.getSeparatedManagedObjects(json.allGroups)))
      return json;
    })
    .catch(error =>
      dispatch(fetchADGroupsFailure(error))
    );
};
}

export const fetchADGroupsBegin = () => ({
      type: FETCH_AD_GROUPS_BEGIN
    });
export const fetchADGroupsSuccess = data => {
  return ({
      type: FETCH_AD_GROUPS_SUCCESS,
      payload: { projects: data }
    });
} 
export const fetchADGroupsFailure = error => ({
      type: FETCH_AD_GROUPS_FAILURE,
      payload: { error }
    });



    
// FETCH all AD manager Groups 
export function fetchADManagerGroups() {
  
  console.log("fetchADManagerGroups: START ")
  return dispatch => {
    dispatch(fetchADManagerGroupsBegin());
    return server.getAllManagerGroups() // was: getMyGroups()
      .then(json => {
          console.log("json fetchADGroups getMyGroups:  ", json)
          dispatch(fetchADManagerGroupsSuccess(json.allGroups))
          // dispatch(fetchADGroupsSuccess(StringFormatter.getSeparatedManagedObjects(json.allGroups)))
        return json;
      })
      .catch(error =>
        dispatch(fetchADManagerGroupsFailure(error))
      );
  };
}

export const fetchADManagerGroupsBegin = () => ({
      type: FETCH_AD_MANAGER_GROUPS_BEGIN
    });
export const fetchADManagerGroupsSuccess = data => {
  return ({
      type: FETCH_AD_MANAGER_GROUPS_SUCCESS,
      payload: { projects: data }
    });
} 
export const fetchADManagerGroupsFailure = error => ({
      type: FETCH_AD_MANAGER_GROUPS_FAILURE,
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
