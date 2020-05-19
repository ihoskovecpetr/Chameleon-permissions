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

import useSortGroupMembers from "../../Hooks/useSortGroupMembers"
import { setEditingGroupMembers, deleteMemberEditGroup , saveNewGroupMembers} from "../modules/GroupModule"
import GroupView from "./GroupView"


function Group({  group_name, 
                  project_name, 
                  isEditting, 
                  currentEditMemb, 
                  confirmedADMemb,
                  deleteMembrEditGroup,
                  saveEditToAD,
                  startEditingGroup}) {

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const {stable, newOnes, deleted} = useSortGroupMembers(confirmedADMemb , currentEditMemb, isEditting)

  // console.log("PRE Group HOOK sorted: group_name project_name,", group_name, project_name)
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

  const openPop = Boolean(anchorEl);

  return (
            <GroupView group_name={group_name} 
                      project_name={project_name} 
                      anchorEl={anchorEl}
                      stable={stable} 
                      newOnes={newOnes} 
                      deleted={deleted}
                      handleOpenAddCand={handleOpenAddCand}
                      handleDeleting={handleDeleting}
                      isEditting={isEditting}
                      handleSaveEditToAD={handleSaveEditToAD}
                      togglePopover={togglePopover}/>
  );
}

const makeGetisEditting = () => createSelector(
  (state, props) => props.group_name,
  (state) => state.group_state.editingGroupMembers,
  (group_name, editingGroupMembers) => {
    if(editingGroupMembers[group_name]) return true
    return false
  }
)  

const makeGetEditMemb = () => createSelector(
  (state, props) => state.group_state.editingGroupMembers[props.group_name],
  (state) => state.group_state.editingGroupMembers,
  (editActualmemb, xx) => {
    // if(editingGroupMembers[group_name] && editingGroupMembers[group_name].length != 0) return true
    return editActualmemb
  }
) 

const makeGetConfADMemb = () => createSelector(
  (state, props) => state.group_state.confirmedGroupMembers[props.group_name],
  (confADMemb) => {
    return confADMemb
  }
) 



const StateToProps = () => {
  const getIsEdit = makeGetisEditting()
  const getEditMmbs = makeGetEditMemb()
  const getADMmbs = makeGetConfADMemb()
    return (state, ownProps) => {
      return {
        isEditting: getIsEdit(state, ownProps),
        currentEditMemb: getEditMmbs(state, ownProps),
        confirmedADMemb: getADMmbs(state, ownProps)
      }


}
}

const mapDispatchToProps = dispatch => {
  return {
      dispatch: (action) => dispatch(action),
      startEditingGroup: (group_name) => dispatch(setEditingGroupMembers(group_name)),
      deleteMembrEditGroup: (editGroupOriginal, sAMAccountName, group_name) => dispatch(deleteMemberEditGroup(editGroupOriginal, sAMAccountName, group_name)),
      saveEditToAD: (currentEditMemb, group_name) => dispatch(saveNewGroupMembers(currentEditMemb, group_name)),
  }
}

export default connect(StateToProps, mapDispatchToProps)(Group)


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