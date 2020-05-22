import * as server from '../../lib/serverData';
import * as StringFormatter from '../../lib/stringFormatHelper';

// Action types
const FETCH_ALL_USERS_BEGIN = 'my-app/project/FETCH_ALL_USERS_BEGIN';
const FETCH_ALL_USERS_SUCCESS = 'my-app/project/FETCH_ALL_USERS_SUCCESS';
const FETCH_ALL_USERS_FAILURE = 'my-app/project/FETCH_ALL_USERS_FAILURE';

const FETCH_SINGLE_PERSON_BEGIN = 'my-app/project/FETCH_SINGLE_PERSON_BEGIN';
const FETCH_SINGLE_PERSON_SUCCESS = 'my-app/project/FETCH_SINGLE_PERSON_SUCCESS';


const initialState = {
  allPersons: {
    loading: false,
    error: null,
    persons: [],
    mapUsrResource: {}
  },
  activePerson: {
    _id: null,
    name: ''
  }
  };

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
      //ALL PERSON
      case FETCH_ALL_USERS_BEGIN:
        return {
          ...state, 
          allPersons: {
            loading: true,
            error: null,
            persons: []
          }
        };
    case FETCH_ALL_USERS_SUCCESS:
        return {
          ...state,
          allPersons: {
            loading: false,
            error: null,
            persons: action.payload.presonArr,
            mapUsrResource: action.payload.mapUsrResource
          },
        };
    case FETCH_ALL_USERS_FAILURE:
        return {
          ...state,
          allPersons: {
            loading: false,
            error: action.payload.error,
            persons: []
          }
        };


    //SILGLE PERSON
    case FETCH_SINGLE_PERSON_BEGIN:
        return {
          ...state,
          activePerson: {
            loading: true,
          }
        };
    case FETCH_SINGLE_PERSON_SUCCESS:

    console.log("Person OBJ: ", action.payload.personObj )
        return {
          ...state,
          activePerson: {
            loading: false,
            _id: action.payload.personObj._id,
            name: action.payload.personObj.name,
            person: action.payload.personObj,
            adManagedObjects: action.payload.adManagedObjects,
            adMemberOf: action.payload.adMemberOf
          }
        };

    default: 
        return state;
  }
}

// ACTION CREATORS

// FETCH All Person from DB

export function fetchAllPerson() {

  return dispatch => {
    // dispatch(fetchK2ProjectsBegin());
    // console.time("Pre call")
    return server.getAllActiveUsers()
      .then(json => {
          console.log("AllPersons HERE ", json)
          console.timeEnd("Pre call");

        dispatch(fetchAllPersonSuccess(json))
        return json;
      })
      .catch(error =>
        console.log(error)
        // dispatch(fetchK2ProjectsFailure(error))
      );
  };
}

// export const fetchK2ProjectsBegin = () => ({
// type: FETCH_K2_PROJECTS_BEGIN
// });

export const fetchAllPersonSuccess = data => {

  const mapUsrResource = data.reduce((acum, current) => {

    //Just to bring correct format of AD members
    current.displayName = current.name
    current.sAMAccountName = current.ssoId

    acum[current.resource] = current
    return acum
  }, {})

      return ({
    type: FETCH_ALL_USERS_SUCCESS,
    payload: { 
      presonArr: data, 
      mapUsrResource: mapUsrResource
    }
    })
};

// export const fetchK2ProjectsFailure = error => ({
// type: FETCH_K2_PROJECTS_FAILURE,
// payload: { error }
// });


// FETCH Single Person data

export function fetchSinglePerson(_id) {

  return dispatch => {
    // dispatch(fetchK2ProjectsBegin());
    return server.getSingleUser(_id)
      .then(json => {
          console.log("One Person HERE ", json)
          console.log("One Person CUTTED: ", StringFormatter.getSeparatedManagedObjects(json[0].ad))
        dispatch(fetchSinglePersonSuccess(json, ))
        return json;
      })
      .catch(error =>
        console.log(error)
        // dispatch(fetchK2ProjectsFailure(error))
      );
  };
}

export const fetchSinglePersonBegin = () => ({
type: FETCH_SINGLE_PERSON_SUCCESS
});

export const fetchSinglePersonSuccess = data => ({
type: FETCH_SINGLE_PERSON_SUCCESS,
payload: {  personObj: data[0],
            adManagedObjects: StringFormatter.getSeparatedManagedObjects(data[0].ad),
            adMemberOf: StringFormatter.getSeparatedMemberOf(data[0].ad),
          }
});

// export const fetchK2ProjectsFailure = error => ({
// type: FETCH_K2_PROJECTS_FAILURE,
// payload: { error }
// });




// side effects, only as applicable
// e.g. thunks, epics, etc
export function getWidget () {
  return dispatch => get('/widget').then(widget => dispatch(updateWidget(widget)))
}