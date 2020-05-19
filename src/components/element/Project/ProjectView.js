import React, {useState, useEffect} from 'react';
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
      
        {projectGroups && projectGroups.map((item, index) => {
         console.log("Project group iterated")
         return <GroupContainer group_name={item} project_name={project_name} key={index} />
        }
        )}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
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
  column: {
    flexBasis: '20%',
    // width: 180,
    overflow: "hidden",
    // whiteSpace: "nowrap",
    // borderRight: '1px solid grey'
  },
  divider: {
    marginLeft: 10,
    marginRight: 10,
  },
}));