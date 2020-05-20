import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Popover from '@material-ui/core/Popover';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles } from '@material-ui/core/styles';

import clsx from 'clsx';
import { connect } from "react-redux";
import { createSelector } from 'reselect'

import { setEditingGroupMembers, deleteMemberEditGroup , saveNewGroupMembers} from "../../modules/GroupModule"

import CandidateContainer from "../Candidate/CandidateContainer"
import CandidateAutofillContainer from "../Candidate/CandidateAutofillContainer"


function Group({  group_name,
                  project_name,
                  anchorEl,
                  stable,
                  newOnes,
                  deleted,
                  allCandidates,
                  handleOpenAddCand,
                  handleDeleting,
                  isEditting,
                  loadingMembers,
                  autoFocus,
                  handleSaveEditToAD,
                  togglePopover}) {

  const classes = useStyles();

  const openPop = Boolean(anchorEl);

  return (
            <Grid item xs={12}> 
            <Grid container className={classes.groupMainContainer}>
                <Grid item xs={4}> 
                  <Grid container justify="center" alignItems="center" className={classes.nameContainer}> 
                    <Grid item> 
                          {group_name.split(`${project_name}_adv_`)[1]}
                          {group_name}
                    </Grid>
                  </Grid>
                </Grid>
                  <Grid item xs={8}>
                    <div className={classes.helper} >
                <Grid container direction="row">
                {loadingMembers && <Grid item>
                      loading members...  <CircularProgress color="secondary" />
                    </ Grid>
                   }
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
                  <Grid container justify="flex-start" alignItems="center">
                      {/* <TextField type="text" autoFocus={autoFocus} /> */}
                      <Grid item>
                          <CandidateAutofillContainer autoFocus={autoFocus} group_name={group_name} />
                      </Grid>
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
                  </ Grid>
                </ Grid>
                
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
                          group_name={group_name} 
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
  groupMainContainer:{
    minHeight: 80,
  },
  nameContainer: {
    height: '100%',
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