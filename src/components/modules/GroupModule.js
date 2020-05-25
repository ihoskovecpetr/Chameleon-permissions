import * as server from '../../lib/serverData';

// Action types
const SET_ALL_EDITING_GROUP_MEMBERS = 'my-app/group/SET_ALL_EDITING_GROUP_MEMBERS';
const ADD_EDIT_GROUP_MEMBERS = 'my-app/group/ADD_EDIT_GROUP_MEMBERS';
const SET_EDITING_GROUP_MEMBERS = 'my-app/group/SET_EDITING_GROUP_MEMBERS';

const STOP_EDITING_GROUP = 'my-app/group/STOP_EDITING_GROUP';
const STOP_EDITING_ALL_GROUPS = 'my-app/group/STOP_EDITING_ALL_GROUPS';

const DELETE_MEMBER_EDIT_GROUP = 'my-app/group/DELETE_MEMBER_EDIT_GROUP';
const DELETE_EDIT_GROUPS_MEMBERS = 'my-app/group/DELETE_EDIT_GROUPS_MEMBERS';

const FETCH_AD_CONFIRMED_MEMBERS_BEGIN = 'my-app/group/FETCH_AD_CONFIRMED_MEMBERS_BEGIN';
const FETCH_AD_CONFIRMED_MEMBERS_SUCCESS = 'my-app/group/FETCH_AD_CONFIRMED_MEMBERS_SUCCESS';

const SAVING_MULTI_GROUPS_MBS_BEGIN = 'my-app/group/SAVING_MULTI_GROUPS_MBS_BEGIN';
const SAVING_MULTI_GROUPS_MBS_SUCCESS = 'my-app/group/SAVING_MULTI_GROUPS_MBS_SUCCESS';

const START_SAVING_GROUP_MEMBERS = 'my-app/group/START_SAVING_GROUP_MEMBERS';
const STOP_SAVING_GROUP_MEMBERS = 'my-app/group/STOP_SAVING_GROUP_MEMBERS';

const FETCH_BOOKING_EVENTS_BEGIN = 'my-app/group/FETCH_BOOKING_EVENTS_BEGIN';
const FETCH_BOOKING_EVENTS_SUCCESS = 'my-app/group/FETCH_BOOKING_EVENTS_SUCCESS';


const initialState = {
      confirmedGroupMembers: {test_skupina: [{name: "jan.tester"}]},
      editingGroupMembers: {},
      currentlySavingGroups: [],
      bookingEventsUsers: {
        loading: null,
        resources: []
      }
  };

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {

    case ADD_EDIT_GROUP_MEMBERS:
      
      //Sort out all UNDEFINED users
      const noUndefCandidates = action.payload.candidateObjArr.filter(item => item ? true : false)

      let oldMbs
      if(state.editingGroupMembers[action.payload.group_name]){
        oldMbs = [...state.editingGroupMembers[action.payload.group_name]]
      }else{ oldMbs = [] }
      console.log("Old Mbs: ", oldMbs)

      let mergeMbs
      if(oldMbs.length === 0) { 
        mergeMbs = noUndefCandidates
      } else{  mergeMbs = [ ...oldMbs, ...noUndefCandidates] }
      
      console.log("mergeMbs: ", mergeMbs)

      mergeMbs = mergeMbs.filter((member, index, self) =>
      index === self.findIndex((t) => (
          t.displayName === member.displayName
      ))
      )

            return {
                ...state,
                editingGroupMembers: {
                    ...state.editingGroupMembers, 
                    [action.payload.group_name]: mergeMbs
                    }
            };

    case FETCH_AD_CONFIRMED_MEMBERS_BEGIN:
          return {
              ...state,
              confirmedGroupMembersLoading: true,
          };

    case FETCH_AD_CONFIRMED_MEMBERS_SUCCESS:

        const confWork = state.confirmedGroupMembers
        action.payload.data.map(group => {
            const k = Object.keys(group)[0]
            confWork[k] = group[k]
        })
          return {
              ...state,
              confirmedGroupMembersLoading: false,
              confirmedGroupMembers: confWork
          };

    //GET BOOKING EVENTS

    case FETCH_BOOKING_EVENTS_BEGIN:
          return {
              ...state,
              bookingEventsUsers: {
                loading: true
              },
          };

    case FETCH_BOOKING_EVENTS_SUCCESS:

        console.log("Payload: ", action.payload)

          return {
              ...state,
              bookingEventsUsers: {
                loading: false,
                resources: action.payload.resources
              },
          };
  

    case SET_EDITING_GROUP_MEMBERS:

        let prevDataEditGroups
        if(state.editingGroupMembers){
          prevDataEditGroups = state.editingGroupMembers
        } else{
          prevDataEditGroups = []
        }

        let groupMembers
        if(!state.editingGroupMembers[action.payload.groupName]){
          groupMembers = state.confirmedGroupMembers[action.payload.groupName]
        } else{
          groupMembers = state.editingGroupMembers[action.payload.groupName]
        }

              return {
                  ...state,
                  editingGroupMembers: {
                    ...prevDataEditGroups,
                    [action.payload.groupName]: groupMembers}
              };
    case STOP_EDITING_GROUP:
      console.log("Stop Editing GROUP: pre", )

        let newEditGroups = state.editingGroupMembers
            delete newEditGroups[action.payload.group_name]
        

              return {
                  ...state,
                  editingGroupMembers: {
                    ...newEditGroups
                  }
              };

    case STOP_EDITING_ALL_GROUPS:
            return {
                ...state,
                editingGroupMembers: {}
            };

    case DELETE_MEMBER_EDIT_GROUP:
            return {
                ...state,
                editingGroupMembers: {...state.editingGroupMembers , [action.payload.group_name]: action.payload.newEditGroup}
            };

    case DELETE_EDIT_GROUPS_MEMBERS:

        const editObj = action.payload.projectObj.projectADGroups.reduce((acumul, currentValue) => {
          if(state.confirmedGroupMembers[currentValue]){
            acumul[currentValue] = []
          }
          return acumul
        }, {})

            return {
                ...state,
                editingGroupMembers: editObj
            };

    case START_SAVING_GROUP_MEMBERS:

        const  newArr = state.currentlySavingGroups
        if(state.currentlySavingGroups.indexOf(action.payload.group_name) === -1){
          newArr.push(action.payload.group_name)
        }
            
          return {
              ...state,
              currentlySavingGroups: newArr
          };

    case STOP_SAVING_GROUP_MEMBERS:

      const group_name_index = state.currentlySavingGroups.indexOf(action.payload.group_name)
      const  newArrSpliced = state.currentlySavingGroups
      newArrSpliced.splice(group_name_index, 1)

            return {
                ...state,
                currentlySavingGroups: newArrSpliced
            };

    default: 
        return state;
  }
}

// Action Creators

// FETCH AD Groups Members
export function fetchProjectGroupsMembers(project_name) {

  return dispatch => {
    dispatch(fetchADGroupsMembersBegin())
    return server.getProjectGroupsMembers(project_name)
      .then(json => {
        dispatch(fetchADGroupsMembersSuccess(json.data))
        return json;
      })
      .catch(err =>
        console.log("ERR: ", err)
      );
  };
}

export function fetchADGroupsMembersBegin(){
  return ({
      type: FETCH_AD_CONFIRMED_MEMBERS_BEGIN,
  }); 
} 
export function fetchADGroupsMembersSuccess(data){
  return ({
      type: FETCH_AD_CONFIRMED_MEMBERS_SUCCESS,
      payload: { data: data }
  }); 
} 


// FETCH AD Groups Members
export function fetchBookingEvents(project_id) {

 console.log("fetchBookingEvents???")
  return dispatch => {
    dispatch(fetchBookingEventsBegin())
    return server.getBookingEvents(project_id)
      .then(json => {
        console.log("FETCH_BOOKING_EVENTS_SUCCESS ", json)
        dispatch(fetchBookingEventsSuccess(json))
        return json;
      })
      .catch(err =>
        console.log("ERR: ", err)
      );
  };
}

export function fetchBookingEventsBegin(){
  return ({
      type: FETCH_BOOKING_EVENTS_BEGIN,
  }); 
} 
export function fetchBookingEventsSuccess(data){
  return ({
      type: FETCH_BOOKING_EVENTS_SUCCESS,
      payload: { resources: data }
  }); 
} 



// ADD members to edit group
export function addEditGroupMbrs(candidateObjArr, group_name){

 return ({
      type: ADD_EDIT_GROUP_MEMBERS,
      payload: { 
        candidateObjArr: candidateObjArr,
          group_name: group_name
              }
      });
} 


// Clear ALL Edit group members
export function deleteAllEditGroupsMbs(projectObj){

  console.log("DELETE THIS Project MBS: ", projectObj)

  return ({
       type: DELETE_EDIT_GROUPS_MEMBERS,
       payload: { projectObj }
       });
 }  



// Set Group to start being Edited
export function setEditingGroupMembers(group_name){
   return ({
    type: SET_EDITING_GROUP_MEMBERS,
    payload: {  
        groupName: group_name
            }
    });
} 

// Stop Editing Group
export function stopEditingGroup(group_name){

  console.log("Stop Editing this group: ", group_name)

 return ({
  type: STOP_EDITING_GROUP,
  payload: {  
    group_name: group_name
          }
  });
} 

// Stop Editing All Groups
export function stopEditingAllGroups(){

  return ({
   type: STOP_EDITING_ALL_GROUPS,
   payload: { }
   });
 } 

 // Set Saving group members
export function startSavingStageGroup(group_name){
  return ({
   type: START_SAVING_GROUP_MEMBERS,
   payload: {group_name}
   });
 } 

 export function stopSavingStageGroup(group_name){
  return ({
   type: STOP_SAVING_GROUP_MEMBERS,
   payload: {group_name}
   });
 } 
// SAVE new members to AD

export function saveNewGroupMembers(currentEditMemb, group_name) {

  return dispatch => {
    dispatch(startSavingStageGroup(group_name))
  return server.saveGroupMembers(group_name, currentEditMemb)
    .then(json => {
        if(json.new_mbs_success === true){
            //Fetch newly added members from AD
            dispatch(fetchADGroupsMembersSuccess([
              {[group_name]: currentEditMemb}
            ]))
            //Close (delete) Editting group
            dispatch(stopSavingStageGroup(group_name))
            dispatch(stopEditingGroup(group_name))

        }
      return json;
    })
    .catch(error =>
      console.log("saving members err: ", error)
    );
};
}

// SAVE new members to AD

export function saveMultipleGroupsMembers(groupsObjObj) {
console.log("groupsObjObj: ", groupsObjObj)
  return dispatch => {
    return  Object.keys(groupsObjObj).map(key => {

      const groupMbsArr = groupsObjObj[key]
      const groupName = key

      console.log("PAIR name mbs: ", groupName, groupMbsArr)
      dispatch(startSavingStageGroup(groupName))
      return server.saveGroupMembers(groupName, groupMbsArr)
        .then(json => {
            console.log("Response: ", json)
            if(json.new_mbs_success === true){
                //Fetch newly added members from AD
                dispatch(fetchADGroupsMembersSuccess([
                  {[groupName]: groupMbsArr}
                ]))
                //Close (delete) Editting group
                dispatch(stopEditingGroup(groupName))
                dispatch(stopSavingStageGroup(groupName))

            }
          return json;
        })
        .catch(error =>
          console.log("saving members err: ", error)
        );
    })

};
}



export function deleteMemberEditGroup(editGroupOriginal, sAMAccountName, group_name){

    const newEditGroup = editGroupOriginal.filter(item => item.sAMAccountName != sAMAccountName)

    return ({
        type: DELETE_MEMBER_EDIT_GROUP,
        payload: {  
            group_name: group_name,
            newEditGroup: newEditGroup
                }
        });
} 


// export function removeWidget(widget) {
//   return { type: REMOVE, widget };
// }

// side effects, only as applicable
// e.g. thunks, epics, etc
export function getWidget () {
  return dispatch => get('/widget').then(widget => dispatch(updateWidget(widget)))
}