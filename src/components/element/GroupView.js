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

import clsx from 'clsx';
import { connect } from "react-redux";
import { createSelector } from 'reselect'

import useSortGroupMembers from "../../Hooks/useSortGroupMembers"

import { setEditingGroupMembers, deleteMemberEditGroup , saveNewGroupMembers} from "../modules/GroupModule"

import GroupView from "./GroupView"
import CandidateContainer from "./CandidateContainer"


function Group({  group_name,
                  project_name,
                  anchorEl,
                  stable,
                  newOnes,
                  deleted,
                  handleOpenAddCand,
                  handleDeleting,
                  isEditting,
                  handleSaveEditToAD,
                  togglePopover}) {

  const classes = useStyles();

  const openPop = Boolean(anchorEl);

  return (
            <Grid item>
                <div className={classes.column}>
                  <Typography variant="caption">
                    {group_name.split(`${project_name}_adv_`)[1]}
                    {group_name}
                  </Typography>
                </div>
                <div className={clsx(classes.column, classes.helper)} >
                <Grid container direction="row" spacing={2}>
                {/* {data && data.loading && <Grid item>
                      loading members...  <CircularProgress color="secondary" />
                    </ Grid>
                   } */}
                  {stable && stable.map((item, index) => {
                    return(
                      <Grid item key={item.displayName}>
                      <Chip 
                          label={`${item.displayName}`}
                          key={item.displayName}
                          className={classes.anyChip}
                          color="primary"
                          onDelete={() => {handleDeleting(item.sAMAccountName)}} 
                          />
                    </ Grid>
                    )
                  })}
                  {newOnes && newOnes.map(item => {
                    return(
                      <Grid item key={item.sAMAccountName}>
                      <Chip 
                          label={`${item.displayName}`}
                          key={item.sAMAccountName}
                          className={clsx(classes.newOneChip, classes.anyChip)}
                          onDelete={() => {handleDeleting(item.sAMAccountName)}} 
                          />
                    </ Grid>
                    )
                  })}
                  {deleted && deleted.map(item => {
                    return(
                      <Grid item key={item.displayName}>
                      <Chip 
                          label={`${item.displayName}`}
                          key={item.displayName}
                          className={classes.anyChip}
                          color="secondary"
                          disabled={true}
                          />
                    </ Grid>
                    )
                  })}
                  </ Grid>
                  <Grid container direction="row">
                      <Grid item>
                        <Chip 
                            label="Add"
                            aria-owns='mouse-over-popover' 
                            // onDelete={() => {}} 
                            onClick={handleOpenAddCand}
                            icon={<AddIcon />}
                            />
                      </ Grid>
                      {isEditting && <Grid item>
                          <Chip 
                              label="Save"
                              aria-owns='mouse-over-popover' 
                              // onDelete={() => {}} 
                              className={classes.saveChip}
                              onClick={handleSaveEditToAD}
                              icon={<SaveIcon />}
                              />
                        </ Grid>}
                    </Grid>
                </div>
                
                <Divider className={classes.divider} />


                <Popover 
                    anchorOrigin={{
                      vertical: 'center',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'center',
                      horizontal: 'left',
                    }}
                    id="mouse-over-popover"
                    open={openPop}
                    anchorEl={anchorEl}
                    onClick={togglePopover}
                  >

                    <CandidateContainer 
                          roleName={group_name} 
                          // fetchDataGroup={fetchDataGroup} 
                          togglePopover={togglePopover} />
              </Popover>

            </Grid>
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
  anyChip: {
    // display: "inline-block",
  },
  newOneChip: {
    backgroundColor: '#4caf50'
  },
  saveChip: {
    backgroundColor: '#daaa4b'
  }
}));