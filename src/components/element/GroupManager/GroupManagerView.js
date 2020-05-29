import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Popover from '@material-ui/core/Popover';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import BlockIcon from '@material-ui/icons/Block';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import CircularProgress from '@material-ui/core/CircularProgress';

import { makeStyles } from '@material-ui/core/styles';

import clsx from 'clsx';
import { connect } from "react-redux";
import { createSelector } from 'reselect'

import { setEditingGroupMembers, deleteMemberEditGroup , saveNewGroupMembers} from "../../modules/GroupModule"

import CandidateContainer from "../Candidate/CandidateContainer"
import CandidateAutofillContainer from "../Candidate/CandidateAutofillContainer"

function GroupView({  group_name,
                  groupObj,
                  anchorEl,
                  stable,
                  newOnes,
                  deleted,
                  handleDeleting,
                  handleRemoveAll,
                  handlePopulateGroupFromBooking,
                  isEditting,
                  isSaving,
                  loadingMembers,
                  autoFocus,
                  handleStopEditingGroup,
                  handleSaveEditToAD,
                  togglePopover}) {

  const classes = useStyles();
  const openPop = Boolean(anchorEl);

  console.log("Group View: stable: ", stable)

  return (
            <Grid item xs={12}> 
            MANAGER GROUP
            <Grid container className={classes.groupMainContainer}>
                <Grid item xs={4}> 
                  <Grid container justify="flex-start" alignItems="center" className={classes.nameContainer}> 
                    <Grid item> 
                        <ListItem>
                          <ListItemAvatar>
                              <Avatar className={classes.avatarIcon}>
                                  <FolderSharedIcon />
                              </Avatar>
                          </ListItemAvatar>
                            <ListItemText primary={`${group_name}`} />
                        </ListItem>
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
                          label={`${item.displayName ? item.displayName : item.sAMAccountName}`}
                          key={item.displayName}
                          className={classes.anyChip}
                          color={item.sAMAccountName == 'adv.test.hoskovec' ? "" : "secondary"}
                          disabled={item.sAMAccountName == 'adv.test.hoskovec'}
                          onDelete={() => {handleDeleting(item.sAMAccountName)}} 
                          // onClick={() => {handleDeleting(item.sAMAccountName)}}
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
                          // onClick={() => {handleDeleting(item.sAMAccountName)}} 
                          onDelete={() => {handleDeleting(item.sAMAccountName)}} 
                          />
                    </ Grid>
                    )
                  })}
                  {deleted && deleted.map(item => {
                    return(
                    <Grid item key={item.displayName}>
                      <Chip 
                          label={`${item.displayName ? item.displayName : item.sAMAccountName}`}
                          key={item.displayName}
                          className={classes.disabledChip}
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
                          <CandidateAutofillContainer managerGroup={true} autoFocus={autoFocus} group_name={group_name} groupObj={groupObj} />
                      </Grid>
                      
                      <Grid item>
                          <Chip 
                              label="Populate from Booking"
                              aria-owns='mouse-over-popover' 
                              // onDelete={() => {}} 
                              className={classes.populateChip}
                              onClick={handlePopulateGroupFromBooking}
                              icon={<GroupAddIcon />}
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
                        {isEditting && <Grid item>
                          <Chip 
                              label="Cancel changes"
                              aria-owns='mouse-over-popover' 
                              // onDelete={() => {}} 
                              className={classes.cancelChip}
                              color="primary"
                              onClick={handleStopEditingGroup}
                              icon={<BlockIcon />}
                              />
                        </ Grid>}
                        {isSaving && <p>Saving..</p>}
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


export default GroupView


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
  disabledChip:{
    backgroundColor: '#CE6F6F',
    textDecoration: "line-through"
  },
  cancelChip:{
    backgroundColor: '#58B3BF',
  },
  anyChip: {
    // display: "inline-block",
  },
  newOneChip: {
    backgroundColor: '#4caf50'
  },
  saveChip: {
    backgroundColor: '#daaa4b'
  },
  populateChip: {
    backgroundColor: 'green'
  },
  removeAllChip: {
    borderColor: '#f50057',
  },
  avatarIcon: {
    backgroundColor: "beige",
    color: "#5F7D95",
    border: "1px solid #5F7D95"
  },
}));