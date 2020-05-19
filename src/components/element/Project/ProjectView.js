import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import * as server from '../../../lib/serverData';

import ProjectHeaderView from "./ProjectHeaderView"
import GroupContainer from "../GroupContainer"

export default function ProjectView({project_id, project_name, company_name, producer_name, director_name, 
      activeProject, getGroupsMembers, 
      handleURLChange, handleCleanURL, 
      loadingSpinner, projectGroups, 
      activateProject, deactivateProject}) {
  const classes = useStyles();

  console.log("ProjectView rendered activeProject: ", activeProject)

  useEffect(() => {

  }, [projectGroups])

  return (
    <div className={classes.root}>

      <ProjectHeaderView 
          project_id={project_id} 
          project_name={project_name} 
          company_name={company_name} 
          producer_name={producer_name} 
          director_name={director_name} 
          loadingSpinner={loadingSpinner} />

        <Divider className={classes.divider} />
      
      <Grid container className={classes.gridGroups}>
        {projectGroups && projectGroups.map((item, index) => {
         console.log("Project group iterated")
         return <GroupContainer group_name={item} project_name={project_name} key={index} />
        }
        )}
        </Grid>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  gridGroups: {
    backgroundColor: "white",
    width: '100%',
  },
  divider: {
    marginLeft: 10,
    marginRight: 10,
  },
}));