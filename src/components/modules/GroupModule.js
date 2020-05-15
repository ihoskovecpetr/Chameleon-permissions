import * as server from '../../lib/serverData';

// Action types
const SET_ALL_EDITING_GROUP_MEMBERS = 'my-app/group/SET_ALL_EDITING_GROUP_MEMBERS';
const ADD_EDIT_GROUP_MEMBERS = 'my-app/group/ADD_EDIT_GROUP_MEMBERS';
const SET_EDITING_GROUP_MEMBERS = 'my-app/group/SET_EDITING_GROUP_MEMBERS';
const STOP_EDITING_GROUP = 'my-app/group/STOP_EDITING_GROUP';
const DELETE_MEMBER_EDIT_GROUP = 'my-app/group/DELETE_MEMBER_EDIT_GROUP';
const FETCH_AD_GROUPS_MEMBERS_SUCCESS = 'my-app/group/FETCH_AD_GROUPS_MEMBERS_SUCCESS';

const initialState = {
      confirmedGroupMembers: {test_Skupina: [{name: "jan.tester"}]},
      editingGroupMembers: {copy_skupina: [{name: "jan.copy.tester"}]}
  };

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {

    case ADD_EDIT_GROUP_MEMBERS:

            let oldMbs
            if(state.editingGroupMembers[action.payload.group_name]){
              oldMbs = [...state.editingGroupMembers[action.payload.group_name]]
            }else{ oldMbs = [] }

            let mergeMbs
            if(oldMbs.length === 0) { 
              mergeMbs = action.payload.candidateObj
            } else{
                mergeMbs = [ ...oldMbs, ...action.payload.candidateObj
                ]
            }

            mergeMbs = mergeMbs.filter((member, index, self) =>
            index === self.findIndex((t) => (
                t.displayName === member.displayName
            ))
            )

            console.log("NO DUPLICIT: ", mergeMbs)
            // console.log("ADD_ONE_EDIT_GROUP_MEMBER: DATA ", state.editingGroupMembers[action.payload.group_name])
            // console.log("ADD_ONE_EDIT_GROUP_MEMBER: PAYLOAD ", state.editingGroupMembers[action.payload.group_name])
    
                    return {
                        ...state,
                        editingGroupMembers: {
                            ...state.editingGroupMembers, 
                            [action.payload.group_name]: mergeMbs
                            }
                    };

    case FETCH_AD_GROUPS_MEMBERS_SUCCESS:

        console.log("DUCT case 2 reducer: ", action.payload.data)

        const confWork = state.confirmedGroupMembers

        action.payload.data.map(group => {
            const k = Object.keys(group)[0]
            confWork[k] = group[k]
        })

            return {
                ...state,
                confirmedGroupMembers: confWork
            };


    case SET_EDITING_GROUP_MEMBERS:
        console.log("DUCK SET_EDITING_GROUP_MEMBERS")

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

        console.log("DUCK STOP_EDITING_GROUP")

        let newEditGroups = state.editingGroupMembers
            delete newEditGroups[action.payload.group_name]
        
        console.log("Groups after closing: ", newEditGroups)

              return {
                  ...state,
                  editingGroupMembers: {
                    ...newEditGroups
                  }
              };

    case DELETE_MEMBER_EDIT_GROUP:

            console.log("DELETING EDIT GRP NEW: ", action.payload.newEditGroup)

            return {
                ...state,
                editingGroupMembers: {...state.editingGroupMembers , [action.payload.group_name]: action.payload.newEditGroup}
            };

    default: 
        return state;
  }
}

// Action Creators

// FETCH AD Groups Members
export function fetchADGroupsMembers(groupsNamesArr) {

  console.log("fetchADGroupsMembers MODULE", groupsNamesArr)
 
  return dispatch => {
    return server.getGroupsMembers(groupsNamesArr)
      .then(json => {
        console.log("json fetchADGroupsMembersProjects: ", json)
        dispatch(fetchADGroupsMembersSuccess(json.data))
      //   fetchGroupMembers(StringFormatter.getProjectNamesFromArr(json.userData))
        return json;
      })
      .catch(err =>
        console.log("ERR: ", err)
      );
  };
}

export function fetchADGroupsMembersSuccess(data){
        return ({
            type: FETCH_AD_GROUPS_MEMBERS_SUCCESS,
            payload: { data: data }
        }); 
} 


// FETCH AD Groups Members
export function fetchProjectGroupsMembers(project_name) {

  console.log("fetchProjectGroupsMembers MODULE", project_name)
 
  return dispatch => {
    return server.getProjectGroupsMembers(project_name)
      .then(json => {
        console.log("json fetchADGroupsMembersProjects: ", json)
        dispatch(fetchADGroupsMembersSuccess(json.data))
        // fetchGroupMembers(StringFormatter.getProjectNamesFromArr(json.userData))
        return json;
      })
      .catch(err =>
        console.log("ERR: ", err)
      );
  };
}

// export function fetchADGroupsMembersSuccess(data){
//         return ({
//             type: FETCH_AD_GROUPS_MEMBERS_SUCCESS,
//             payload: { data: data }
//         }); 
// } 



// ADD members to edit group
export function addEditGroupMbrs(candidateObj, group_name){
  console.log("addEditGroupMbrs: ", candidateObj, group_name)
 return ({
      type: ADD_EDIT_GROUP_MEMBERS,
      payload: { 
          candidateObj: candidateObj,
          group_name: group_name
              }
      });
} 






// Set Group to start being Edited
export function setEditingGroupMembers(group_name){
    console.log("setEditingGroupMembers: ", group_name)
   return ({
    type: SET_EDITING_GROUP_MEMBERS,
    payload: {  
        groupName: group_name
            }
    });
} 

// Stop Editing Group
export function stopEditingGroup(group_name){
  console.log("stopEditingGroup: ", group_name)

 return ({
  type: STOP_EDITING_GROUP,
  payload: {  
    group_name: group_name
          }
  });
} 


// SAVE new members to AD

export function saveNewGroupMembers(currentEditMemb, group_name) {

  return dispatch => {
  return server.saveGroupMembers(group_name, currentEditMemb)
    .then(json => {
        console.log("json setNewGroupMembers MODULE: ", json)
        if(json.new_mbs_success === true){
            //Fetch newly added members from AD
            dispatch(fetchADGroupsMembersSuccess([
              {[group_name]: currentEditMemb}
            ]))
            //Close (delete) Editting group
            dispatch(stopEditingGroup(group_name))

        }
      // dispatch(fetchProjectsSuccess(StringFormatter.getProjectNamesFromArr(json.userData)))
    //   fetchGroupMembers(StringFormatter.getProjectNamesFromArr(json.userData))
      return json;
    })
    .catch(error =>
      console.log("saving members err: ", error)
    );
};
}

export function deleteMemberEditGroup(editGroupOriginal, sAMAccountName, group_name){

    console.log("deleteMemberEditGroup type of act: ", sAMAccountName)

    const newEditGroup = editGroupOriginal.filter(item => item.sAMAccountName != sAMAccountName)

    console.log("deleteMemberEditGroup bez sAMAccountName ", newEditGroup)

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