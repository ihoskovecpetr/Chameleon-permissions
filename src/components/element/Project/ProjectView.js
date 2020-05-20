import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import * as server from '../../../lib/serverData';

import ProjectHeaderView from "./ProjectHeaderView"
import GroupContainer from "../Group/GroupContainer"

export default function ProjectView({project_id, project_name, company_name, producer_name, director_name, 
      activeProject, 
      handleURLChange, handleCleanURL, 
      loadingSpinner, projectGroups, 
      activateProject, deactivateProject, bookingUserResources, mapUsrResource}) {
  const classes = useStyles();

  console.log("ProjectView rendered activeProject: ", bookingUserResources, mapUsrResource)

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
        {bookingUserResources && Object.keys(bookingUserResources).map(function(key, index) {
          console.log("DERER: ", key, mapUsrResource[key])
        return <p>{bookingUserResources[key]} - {key} - {mapUsrResource && mapUsrResource[key] && mapUsrResource[key].ssoId}</p>
        })}
      
      <Grid container className={classes.gridGroups}>
        {projectGroups && projectGroups.map((item, index) => {
         return <GroupContainer group_name={item} project_name={project_name} key={index} autoFocus={index === 0} />
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
    margin: 10
  },
}));