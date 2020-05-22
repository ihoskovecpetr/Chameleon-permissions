import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import PersonIcon from '@material-ui/icons/Person';

import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import * as server from '../../../lib/serverData';

import GroupContainer from "../Group/GroupContainer"

export default function ProjectHeaderView({project_id, project_name, company_name, producer_name, director_name, 
      activeProject, getGroupsMembers, 
      handleURLChange, handleCleanURL, 
      loadingSpinner, projectGroups, 
      activateProject, deactivateProject}) {
  const classes = useStyles();

  console.log("ProjectView rendered activeProject: ", activeProject)

  useEffect(() => {

  }, [projectGroups])

  return (
    <div>
    <Grid container className={classes.root}>
      <Grid item xs={3}>
        <Grid container justify="center" alignContent="center" className={classes.iconContainer}>
          <Grid item>
            <Avatar className={classes.avatarIcon}>
                <FolderSharedIcon className={classes.folderBigIcon}/>
            </Avatar>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={3}>
        <Grid container justify="center" alignContent="center">

        <Grid item xs={12} className={classes.greySubtitle}>
            PROJECT
          </Grid>   
          <Grid item xs={12}>
            {project_name}
          </Grid> 

          <Grid item xs={12} className={classes.greySubtitle}>
            Client
          </Grid>   
          <Grid item xs={12}>
            {company_name}
          </Grid> 
        </Grid> 
      </Grid>

      <Grid item xs={3}>
        <Grid container justify="center" alignContent="center">

          <Grid item xs={12} className={classes.greySubtitle}>
            Producer
          </Grid>   
          <Grid item xs={12}>
            {producer_name}
          </Grid> 

        </Grid> 
      </Grid>
    </Grid>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: "white"
  },
  iconContainer: {
    height: '100%'
  },
  avatarIcon: {
    backgroundColor: "#5F7D95",
    color: "beige",
    width: 100,
    height: 100,
  },
  folderBigIcon: {
    width: 70,
    height: 70,
  },
  personIcon: {
    height: 50,
    width: 50,
  },
  heading: {
    position: "relative",
    flexBasis: '20%',
    fontSize: theme.typography.pxToRem(15),
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  greySubtitle: {
    fontWeight: 500,
    color: "lightGrey"
  },
  divider: {
    marginLeft: 10,
    marginRight: 10,
  },
}));