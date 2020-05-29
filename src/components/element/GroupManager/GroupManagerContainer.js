import React, {useState, useEffect} from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Popover from '@material-ui/core/Popover';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles } from '@material-ui/core/styles';

import { connect } from "react-redux";
import { createSelector } from 'reselect'

import useSortGroupMembers from "../../../Hooks/useSortGroupMembers"
import { addEditGroupManagers, deleteManagerEditGroup , stopEditingGroup, saveNewGroupManagers, deleteAllMembsEditGroup} from "../../modules/GroupManagerModule"

import GroupManagerView from "./GroupManagerView"


function GroupContainer({  group_name, 
                  groupObj,
                  project_name, 
                  isEditting, 
                  isSaving,
                  loadingMembers,
                  autoFocus,
                  currentEditMemb, 
                  confirmedADMemb,
                  mapMngGroupByName,
                  mapUsrResource,
                  bookingUserResources,
                  deleteMngrEditGroupDisp,
                  addEditGroupMngsDisp,
                  deleteGroupMbsDisp,
                  saveEditToAD,
                  stopEditingGroupDisp,
                  //startEditingGroup
                }) {

  const classes = useStyles();
  // const [anchorEl, setAnchorEl] = useState(null);
  const {stable, newOnes, deleted} = useSortGroupMembers(confirmedADMemb , currentEditMemb, isEditting)

  console.log("GroupContainer rerender ,",confirmedADMemb , currentEditMemb,)
  // console.log("Group HOOK sorted: stable, newOnes, deleted ", stable, newOnes, deleted)


  // const togglePopover = (event) => {
  //   if(!anchorEl) handlePopoverOpen(event)
  //   if(anchorEl) handlePopoverClose()
  // }

  // const handlePopoverOpen = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handlePopoverClose = () => {
  //   setAnchorEl(null);
  // }; 


  const handleDeleting = async (sAMAccountName) => {
    console.log("handle Deleting deleteMngrEditGroupDisp: ");
    deleteMngrEditGroupDisp(currentEditMemb ? currentEditMemb : confirmedADMemb , sAMAccountName, group_name)
  }; 


  const handleSaveEditToAD = () => {
    saveEditToAD( currentEditMemb, group_name )
  }

  const handleStopEditingGroup = () => {
    stopEditingGroupDisp(group_name)
  }

  const handleRemoveAll = () => {
    deleteGroupMbsDisp(group_name)
  }

  const handlePopulateGroupFromBooking = () => {
    console.log("bookingUserResources: I was here ", bookingUserResources)
    const projectGroups = mapMngGroupByName[group_name]
    console.log("bookingUserResources: groups", projectGroups)

    projectGroups.map(group => {

      let candidatesObjArr = []
      bookingUserResources && Object.keys(bookingUserResources).map(function(key, index) {
        console.log("candidatesObjArr ", candidatesObjArr)
        console.log("mapUsrResource[key]: ", mapUsrResource[key])
        if(group.roles.indexOf(bookingUserResources[key][0]) != -1){
          console.log("Tady je toto: ", group.roles, bookingUserResources[key][0])
          candidatesObjArr.push(mapUsrResource[key])
        }
        
      })

      console.log("Just Candidates from Booking to be Pushed: ", candidatesObjArr)
      //MOCK
      addEditGroupMngsDisp(candidatesObjArr, group.name)
    })
  }


  return (
            <GroupManagerView group_name={group_name} 
                      groupObj={groupObj}
                      stable={stable} 
                      newOnes={newOnes} 
                      deleted={deleted}
                      handleDeleting={handleDeleting}
                      handleRemoveAll={handleRemoveAll}
                      isEditting={isEditting}
                      isSaving={isSaving}
                      loadingMembers={loadingMembers}
                      autoFocus={autoFocus}
                      handleStopEditingGroup={handleStopEditingGroup}
                      handleSaveEditToAD={handleSaveEditToAD}
                      handlePopulateGroupFromBooking={handlePopulateGroupFromBooking}
                      />
  );
}

const makeGetIsEditting = () => createSelector(
  (_, props) => props.group_name,
  (state) => state.group_manager_state.editingGroupsManagers,
  (group_name, editingGroupsManagers) => {
    if(editingGroupsManagers[group_name]) return true
    return false
  }
) 

const makeGetIsSaving = () => createSelector(
  (_, props) => props.group_name,
  (state, {group_name}) => {
    if(state.group_manager_state.currentlySavingGroups.indexOf(group_name) != -1) return true
    return false
  },
  (__, result) => {
    return result
  }
) 

const makeGetEditMemb = () => createSelector(
  (state, props) => state.group_manager_state.editingGroupsManagers[props.group_name],
  (state) => state.group_manager_state.editingGroupsManagers,
  (editActualmemb, __) => {
    return editActualmemb //? editActualmemb : []
  }
) 

const makeGetConfADMemb = () => createSelector(
  (state, props) => {
    console.log("state.group_manager_state: ", state.group_manager_state)
    return state.group_manager_state.confirmedGroupsManagers[props.group_name]
  },
  (confADMemb) => {
    console.log("Conf Managrs: ", confADMemb)
    return confADMemb
  }
) 



const StateToProps = () => {
  const getIsEdit = makeGetIsEditting()
  const getIsSaving = makeGetIsSaving()
  const getEditMmbs = makeGetEditMemb()
  const getADMmbs = makeGetConfADMemb()
    return (state, ownProps) => {
      return {
        isEditting: getIsEdit(state, ownProps),
        isSaving: getIsSaving(state, ownProps),
        currentEditMemb: getEditMmbs(state, ownProps),
        confirmedADMemb: getADMmbs(state, ownProps),
        loadingMembers: state.group_state.confirmedGroupMembersLoading,
        allCandidates: state.candidate_state.allCandidates.candidates,
        mapMngGroupByName: state.project_state.ADManagerGroups.mapGroupsByName,
        bookingUserResources: state.group_state.bookingEventsUsers.resources,
        mapUsrResource: state.person_state.allPersons.mapUsrResource,

      } 
  }
}

const mapDispatchToProps = dispatch => {
  return {
      dispatch: (action) => dispatch(action),
      // startEditingGroup: (group_name) => dispatch(setEditingGroupManagers(group_name)),
      deleteMngrEditGroupDisp: (editGroupOriginal, sAMAccountName, group_name) => dispatch(deleteManagerEditGroup(editGroupOriginal, sAMAccountName, group_name)),
      saveEditToAD: (currentEditMemb, group_name) => dispatch(saveNewGroupManagers(currentEditMemb, group_name)),
      stopEditingGroupDisp: (group_name) => dispatch(stopEditingGroup(group_name)),
      deleteGroupMbsDisp: (group_name) => dispatch(deleteAllMembsEditGroup(group_name)),
      addEditGroupMngsDisp: (candidateObjArr, group_name) => dispatch(addEditGroupManagers(candidateObjArr, group_name)),

  }
}

export default connect(StateToProps, mapDispatchToProps)(GroupContainer)


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '50%',
  },
  helper: {
    borderLeft: `2px solid lightGrey`,
    padding: theme.spacing(1, 2),
  },
  divider: {
    marginLeft: 10,
    marginRight: 10,
  },
  newOneChip: {
    backgroundColor: '#4caf50'
  },
  saveChip: {
    backgroundColor: '#daaa4b'
  }
}));