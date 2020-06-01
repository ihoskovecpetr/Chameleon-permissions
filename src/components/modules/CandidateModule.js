import * as server from '../../lib/serverData';
import * as StringFormatter from '../../lib/stringFormatHelper';

// Action types
const FETCH_CANDIDATES_BEGIN = 'my-app/project/FETCH_CANDIDATES_BEGIN';
const FETCH_CANDIDATES_SUCCESS = 'my-app/project/FETCH_CANDIDATES_SUCCESS';
const FETCH_CANDIDATES_FAILURE = 'my-app/project/FETCH_CANDIDATES_FAILURE';

const FETCH_ALL_CANDIDATES_BEGIN = 'my-app/project/FETCH_ALL_CANDIDATES_BEGIN';
const FETCH_ALL_CANDIDATES_SUCCESS = 'my-app/project/FETCH_ALL_CANDIDATES_SUCCESS';
const FETCH_ALL_CANDIDATES_FAILURE = 'my-app/project/FETCH_ALL_CANDIDATES_FAILURE';


const initialState = {
    allCandidates: {
      loading: false,
      error: null,
      candidates: null,
      mapCandidByRole: null,
      mapCandidByRoleSeparated: null
    },
    loading: false,
    error: null,
    candidates: null
  };

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {

    case FETCH_ALL_CANDIDATES_BEGIN:
      return {
        ...state,
        allCandidates: {
          loading: true,
          error: null,
          candidates: null
        }

      };

    case FETCH_ALL_CANDIDATES_SUCCESS:

      return {
        ...state,
        allCandidates: {
          loading: false,
          candidates: action.payload.members,
          mapCandidByRole: action.payload.mapCandidByRole,
          mapCandidByRoleSeparated: action.payload.mapCandidByRoleSeparated
        }
      };

    case FETCH_ALL_CANDIDATES_FAILURE:

      return {
        ...state,
        allCandidates: {
          loading: false,
          error: action.payload.error,
          candidates: []
        }
      };

    case FETCH_CANDIDATES_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
        candidates: null
      };

    case FETCH_CANDIDATES_SUCCESS:

    console.log("Reduces setting membres: ", action.payload.members)

      return {
        ...state,
        loading: false,
        candidates: action.payload.members
      };

    case FETCH_CANDIDATES_FAILURE:

      return {
        ...state,
        loading: false,
        error: action.payload.error,
        candidates: []
      };

    default: 
        return state;
  }
}

// Action Creators

// FETCH Candidates
export function fetchAllCandidates(ArrRole) {
  console.log("by_role: ", ArrRole)
  return dispatch => {
    dispatch(fetchAllCandidatesBegin());
    return server.getUsersByRole(ArrRole)
      .then(json => {
          //FORMATING data to AD format
          const formatedMembers = json.map(item => {
              return ({
                  ...item,
                  displayName: item.name,
                  sAMAccountName: item.ssoId
              })
          })
          console.log("formatedMembers: pre ", formatedMembers)

        //HEREEE ???????????

        const mapCandidByRole = formatedMembers.reduce((acumul, currentValue) => {

          currentValue.role.map((item, index) => {
            currentValue.sorter = currentValue.role[0]
            if(acumul[currentValue.role[index]]){
              acumul[currentValue.role[index]].push(currentValue)
            }else{
              acumul[currentValue.role[index]] = [currentValue]
            }
            }
          )
          return acumul
        }, {})

        const mapCandidByRoleSeparated = formatedMembers.reduce((acumul, currentValue) => {

          currentValue.role.map((item, index) => {
            currentValue.sorter = currentValue.role[0]
            var justRole = item.split(':')[1]
            if(acumul[justRole]){
              acumul[justRole].push(currentValue)
            }else{
              acumul[justRole] = [currentValue]
            }
            }
          )
          return acumul
        }, {})

        console.log("mapCandidByRoleSeparated: ", mapCandidByRoleSeparated)

        dispatch(fetchAllCandidatesSuccess(formatedMembers, mapCandidByRole, mapCandidByRoleSeparated));

      //   return json.managedObjects;
      })
      .catch(error =>
        dispatch(fetchAllCandidatesFailure(error))
      );
  };
}

export const fetchAllCandidatesBegin = () => ({
  type: FETCH_ALL_CANDIDATES_BEGIN
});

export const fetchAllCandidatesSuccess = (formatedMembers, mapCandidByRole, mapCandidByRoleSeparated) => ({
type: FETCH_ALL_CANDIDATES_SUCCESS,
payload: { 
  members: formatedMembers, 
  mapCandidByRole: mapCandidByRole,
  mapCandidByRoleSeparated: mapCandidByRoleSeparated 
}
});

export const fetchAllCandidatesFailure = error => ({
type: FETCH_ALL_CANDIDATES_FAILURE,
payload: { error }
});




// FETCH Candidates
export function fetchCandidates(ArrRole) {
  console.log("by_role: ", ArrRole)
  return dispatch => {
    dispatch(fetchCandidatesBegin());
    return server.getUsersByRole(ArrRole)
      .then(json => {
          //FORMATING data to AD format
          const formatedMembers = json.map(item => {
              return ({
                  ...item,
                  displayName: item.name,
                  sAMAccountName: item.ssoId
              })
          })
        dispatch(fetchCandidatesSuccess(formatedMembers));

      //   return json.managedObjects;
      })
      .catch(error =>
        dispatch(fetchCandidatesFailure(error))
      );
  };
}

export const fetchCandidatesBegin = () => ({
  type: FETCH_CANDIDATES_BEGIN
});

export const fetchCandidatesSuccess = data => ({
type: FETCH_CANDIDATES_SUCCESS,
payload: { members: data }
});

export const fetchCandidatesFailure = error => ({
type: FETCH_CANDIDATES_FAILURE,
payload: { error }
});

