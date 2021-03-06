import * as server from '../../lib/serverData';

// Action types
const SET_ALL_EDITING_GROUP_MEMBERS = 'my-app/group/SET_ALL_EDITING_GROUP_MEMBERS';
const ADD_EDIT_MANAGER = 'my-app/group/ADD_EDIT_MANAGER';
const SET_EDITING_GROUP_MANAGER = 'my-app/group/SET_EDITING_GROUP_MANAGER';

const STOP_EDITING_GROUP = 'my-app/group/STOP_EDITING_GROUP';
const STOP_EDITING_ALL_GROUPS = 'my-app/group/STOP_EDITING_ALL_GROUPS';

const DELETE_EDIT_GROUP_MANAGER = 'my-app/group/DELETE_EDIT_GROUP_MANAGER';
const DELETE_EDIT_SINGLE_GROUP = 'my-app/group/DELETE_EDIT_SINGLE_GROUP';
const DELETE_EDIT_PROJECT_GROUPS_MEMBERS = 'my-app/group/DELETE_EDIT_PROJECT_GROUPS_MEMBERS';

const FETCH_AD_CONFIRMED_MANAGERS_BEGIN = 'my-app/group/FETCH_AD_CONFIRMED_MANAGERS_BEGIN';
const FETCH_AD_CONFIRMED_MANAGERS_SUCCESS = 'my-app/group/FETCH_AD_CONFIRMED_MANAGERS_SUCCESS';

const START_SAVING_GROUP_MANAGERS = 'my-app/group/START_SAVING_GROUP_MANAGERS';
const STOP_SAVING_GROUP_MANAGERS = 'my-app/group/STOP_SAVING_GROUP_MANAGERS';


const initialState = {
      confirmedGroupsManagers: {},
      confirmedGroupsManagersLoading: false,
      mapConfGroupsByProjectId: {},
      editingGroupsManagers: {},

      currentlySavingGroups: [],

  };

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {


    case FETCH_AD_CONFIRMED_MANAGERS_BEGIN:
      return {
          ...state,
          confirmedGroupsManagersLoading: true,
      };

    case FETCH_AD_CONFIRMED_MANAGERS_SUCCESS:

        //TODO: here use .reduce() instead..
        const confWork = state.confirmedGroupsManagers
        action.payload.data.map(group => {
            const k = Object.keys(group)[0]
            confWork[k] = group[k]
        })

        console.log("Chci z toho ProjectId short: ", action.payload.data)

        let mapGrps = {}

        const managerGroup = action.payload.data[0]

        for (const key in managerGroup) {
          // console.log(`${property}: ${object[property]}`);
          console.log("MAM KEY: ", key)
          mapGrps[key.split('_')[1]] = managerGroup[key]
          console.log("Filat mapa managera: ", mapGrps)
        }
        // const mapGrps = action.payload.data.reduce((acumul, currentValue) => {
        //   const projectId = Object.keys()currentValue.name.split('_')[1]
        //   if(acumul[projectId]){
        //     acumul[projectId] = [...acumul[projectId], currentValue]
        //   }else{
        //     acumul[projectId] = [currentValue]
        //   }
        //     return acumul
        // }, {})


      return {
          ...state,
          confirmedGroupsManagersLoading: false,
          confirmedGroupsManagers: confWork,
          mapConfGroupsByProjectId: mapGrps
      };

    case ADD_EDIT_MANAGER:
      
        //Sort out all UNDEFINED users
        const noUndefCandidates = action.payload.candidateObjArr.filter(item => item ? true : false)

        let oldMbs
        if(state.editingGroupsManagers[action.payload.group_name]){
          oldMbs = [...state.editingGroupsManagers[action.payload.group_name]]
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
                  editingGroupsManagers: {
                      ...state.editingGroupsManagers, 
                      [action.payload.group_name]: mergeMbs
                      }
              };


    case SET_EDITING_GROUP_MANAGER:

        let prevDataEditGroups
        if(state.editingGroupsManagers){
          prevDataEditGroups = state.editingGroupsManagers
        } else{
          prevDataEditGroups = []
        }

        let groupMembers
        if(!state.editingGroupsManagers[action.payload.groupName]){
          groupMembers = state.confirmedGroupsManagers[action.payload.groupName]
        } else{
          groupMembers = state.editingGroupsManagers[action.payload.groupName]
        }

              return {
                  ...state,
                  editingGroupsManagers: {
                    ...prevDataEditGroups,
                    [action.payload.groupName]: groupMembers}
              };


    case STOP_EDITING_GROUP:
      console.log("Stop Editing GROUP: pre", )

        let newEditGroups = state.editingGroupsManagers
            delete newEditGroups[action.payload.group_name]
        

              return {
                  ...state,
                  editingGroupsManagers: {
                    ...newEditGroups
                  }
              };

    // case STOP_EDITING_ALL_GROUPS:
    //         return {
    //             ...state,
    //             editingGroupsManagers: {}
    //         };

    case DELETE_EDIT_GROUP_MANAGER:
            return {
                ...state,
                editingGroupsManagers: {...state.editingGroupsManagers , [action.payload.group_name]: action.payload.newEditGroup}
            };

    // case DELETE_EDIT_SINGLE_GROUP:
    //         return {
    //             ...state,
    //             editingGroupsManagers: {...state.editingGroupsManagers, [action.payload.group_name]: []}
    //         };

    // case DELETE_EDIT_PROJECT_GROUPS_MEMBERS:

    //     const editObj = action.payload.projectObj.projectADGroups.reduce((acumul, currentValue) => {
    //       if(state.confirmedGroupMembers[currentValue]){
    //         acumul[currentValue] = []
    //       }
    //       return acumul
    //     }, {})

    //         return {
    //             ...state,
    //             editingGroupsManagers: editObj
    //         };

    case START_SAVING_GROUP_MANAGERS:

        const  newArr = state.currentlySavingGroups
        if(state.currentlySavingGroups.indexOf(action.payload.group_name) === -1){
          newArr.push(action.payload.group_name)
        }
            
          return {
              ...state,
              currentlySavingGroups: newArr
          };

    case STOP_SAVING_GROUP_MANAGERS:

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
export function fetchProjectManagerGroup(project_id) {

  return dispatch => {
    dispatch(fetchADGroupsManagersBegin())
    return server.getProjectManagerGroup(project_id)
      .then(json => {

        console.log("ONLY managers: ", json)
        dispatch(fetchADGroupsManagersSuccess(json.data))
        return json;
      })
      .catch(err =>
        console.log("ERR: ", err)
      );
  };
}

export function fetchADGroupsManagersBegin(){
  return ({
      type: FETCH_AD_CONFIRMED_MANAGERS_BEGIN,
  }); 
} 
export function fetchADGroupsManagersSuccess(data){

  return ({
      type: FETCH_AD_CONFIRMED_MANAGERS_SUCCESS,
      payload: { data: data }
  }); 
} 



// // ADD members to edit group
export function addEditGroupManagers(candidateObjArr, group_name){

 return ({
      type: ADD_EDIT_MANAGER,
      payload: { 
        candidateObjArr: candidateObjArr,
          group_name: group_name
              }
      });
} 




// Set Group to start being Edited
export function setEditingGroupManagers(group_name){
   return ({
    type: SET_EDITING_GROUP_MANAGER,
    payload: {  
        groupName: group_name
      }
    });
} 

// // Stop Editing Group
export function stopEditingGroup(group_name){

  console.log("Stop Editing this group: ", group_name)

 return ({
  type: STOP_EDITING_GROUP,
  payload: {  
    group_name: group_name
          }
  });
} 

// // Stop Editing All Groups
// export function stopEditingAllGroups(){

//   return ({
//    type: STOP_EDITING_ALL_GROUPS,
//    payload: { }
//    });
//  } 

 // Set Saving group members
export function startSavingStageGroup(group_name){
  return ({
   type: START_SAVING_GROUP_MANAGERS,
   payload: {group_name}
   });
 } 

 export function stopSavingStageGroup(group_name){
  return ({
   type: STOP_SAVING_GROUP_MANAGERS,
   payload: {group_name}
   });
 } 

// SAVE new members to AD
export function saveNewGroupManagers(currentEditMemb, group_name) {

  return dispatch => {
    dispatch(startSavingStageGroup(group_name))
  return server.saveGroupManagers(group_name, currentEditMemb)
    .then(json => {
        if(json.new_mbs_success === true){
            //Fetch newly added members from AD
            dispatch(fetchADGroupsManagersSuccess([
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

// export function saveMultipleGroupsMembers(groupsObjObj) {
// console.log("groupsObjObj: ", groupsObjObj)
//   return dispatch => {
//     return  Object.keys(groupsObjObj).map(key => {

//       const groupMbsArr = groupsObjObj[key]
//       const groupName = key

//       console.log("PAIR name mbs: ", groupName, groupMbsArr)
//       dispatch(startSavingStageGroup(groupName))
//       return server.saveGroupMembers(groupName, groupMbsArr)
//         .then(json => {
//             console.log("Response: ", json)
//             if(json.new_mbs_success === true){
//                 //Fetch newly added members from AD
//                 dispatch(fetchADGroupsManagersSuccess([
//                   {[groupName]: groupMbsArr}
//                 ]))
//                 //Close (delete) Editting group
//                 dispatch(stopEditingGroup(groupName))
//                 dispatch(stopSavingStageGroup(groupName))
//             }
//           return json;
//         })
//         .catch(error =>
//           console.log("saving members err: ", error)
//         );
//     })

// };
// }



export function deleteManagerEditGroup(editGroupOriginal, sAMAccountName, group_name){

    const newEditGroup = editGroupOriginal.filter(item => item.sAMAccountName != sAMAccountName)

    return ({
        type: DELETE_EDIT_GROUP_MANAGER,
        payload: {  
            group_name: group_name,
            newEditGroup: newEditGroup
                }
        });
} 

// export function deleteAllMembsEditGroup(group_name){

//   return ({
//       type: DELETE_EDIT_SINGLE_GROUP,
//       payload: {
//           group_name: group_name
//               }
//       });
// } 

