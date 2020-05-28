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
import { setEditingGroupMembers, deleteMemberEditGroup , saveNewGroupMembers, stopEditingGroup, deleteAllMembsEditGroup} from "../../modules/GroupModule"
import GroupView from "./GroupView"


function GroupContainer({  group_name, 
                  groupObj,
                  project_name, 
                  isEditting, 
                  isSaving,
                  loadingMembers,
                  allCandidates,
                  autoFocus,
                  currentEditMemb, 
                  confirmedADMemb,
                  deleteMembrEditGroup,
                  deleteGroupMbsDisp,
                  saveEditToAD,
                  stopEditingGroupDisp,
                  startEditingGroup}) {

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const {stable, newOnes, deleted} = useSortGroupMembers(confirmedADMemb , currentEditMemb, isEditting)

  console.log("GroupContainer rerender ,",confirmedADMemb , currentEditMemb,)
  // console.log("Group HOOK sorted: stable, newOnes, deleted ", stable, newOnes, deleted)


  const togglePopover = (event) => {
    if(!anchorEl) handlePopoverOpen(event)
    if(anchorEl) handlePopoverClose()
  }

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  }; 


  const handleDeleting = async (sAMAccountName) => {
    deleteMembrEditGroup(currentEditMemb ? currentEditMemb : confirmedADMemb , sAMAccountName, group_name)
  }; 

  const handleOpenAddCand = (e) => {
    startEditingGroup(group_name)
    togglePopover(e)
  }

  const handleSaveEditToAD = () => {
    saveEditToAD( currentEditMemb, group_name )
  }

  const handleStopEditingGroup = () => {
    stopEditingGroupDisp(group_name)
  }

  const handleRemoveAll = () => {
    deleteGroupMbsDisp(group_name)
  }

  const openPop = Boolean(anchorEl);

  return (
            <GroupView group_name={group_name} 
                      groupObj={groupObj}
                      project_name={project_name} 
                      anchorEl={anchorEl}
                      stable={stable} 
                      newOnes={newOnes} 
                      deleted={deleted}
                      allCandidates={allCandidates}
                      handleOpenAddCand={handleOpenAddCand}
                      handleDeleting={handleDeleting}
                      handleRemoveAll={handleRemoveAll}
                      isEditting={isEditting}
                      isSaving={isSaving}
                      loadingMembers={loadingMembers}
                      autoFocus={autoFocus}
                      handleStopEditingGroup={handleStopEditingGroup}
                      handleSaveEditToAD={handleSaveEditToAD}
                      togglePopover={togglePopover}/>
  );
}

const makeGetIsEditting = () => createSelector(
  (state, props) => props.group_name,
  (state) => state.group_state.editingGroupMembers,
  (group_name, editingGroupMembers) => {
    if(editingGroupMembers[group_name]) return true
    return false
  }
) 

const makeGetIsSaving = () => createSelector(
  (state, props) => props.group_name,
  (state, {group_name}) => {
    if(state.group_state.currentlySavingGroups.indexOf(group_name) != -1) return true
    return false
  },
  (group_name, result) => {
    console.log("currentlySavingGroups CHeck MEMOIZED: ")
    return result
  }
) 

const makeGetEditMemb = () => createSelector(
  (state, props) => state.group_state.editingGroupMembers[props.group_name],
  (state) => state.group_state.editingGroupMembers,
  (editActualmemb, xx) => {
    // if(editingGroupMembers[group_name] && editingGroupMembers[group_name].length != 0) return true
    // console.log("makeGetEditMemb: ")
    return editActualmemb //? editActualmemb : []
  }
) 

const makeGetConfADMemb = () => createSelector(
  (state, props) => state.group_state.confirmedGroupMembers[props.group_name],
  (confADMemb) => {
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
      } 
  }
}

const mapDispatchToProps = dispatch => {
  return {
      dispatch: (action) => dispatch(action),
      startEditingGroup: (group_name) => dispatch(setEditingGroupMembers(group_name)),
      deleteMembrEditGroup: (editGroupOriginal, sAMAccountName, group_name) => dispatch(deleteMemberEditGroup(editGroupOriginal, sAMAccountName, group_name)),
      saveEditToAD: (currentEditMemb, group_name) => dispatch(saveNewGroupMembers(currentEditMemb, group_name)),
      stopEditingGroupDisp: (group_name) => dispatch(stopEditingGroup(group_name)),
      deleteGroupMbsDisp: (group_name) => dispatch(deleteAllMembsEditGroup(group_name))
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