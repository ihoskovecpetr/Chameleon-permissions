import React, {useState, useEffect} from 'react';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import * as server from '../../../lib/serverData';
import PersonHeaderView from "./PersonHeaderView"


export default function ProjectView({activePerson, adManagedObjects, managedProjects, adMemberOf, memberOfProjects}) {
  const classes = useStyles();

  console.log("ProjectView managedProjects, memberOfProjects ", managedProjects, memberOfProjects)

  useEffect(() => {

  }, [managedProjects, memberOfProjects])

  return (
    <Container maxWidth="lg" className={classes.root}>

      <PersonHeaderView 
          person_id={activePerson._id} 
          person_name={activePerson.name} 
          // company_name={company_name} 
          // producer_name={producer_name} 
          // director_name={director_name} 
          // loadingSpinner={loadingSpinner} 
          />

        <Divider className={classes.divider} />
      
      <p>Managing those Projects</p>
        {managedProjects && managedProjects.map(project =>
          <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>{project}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <p>
                  managing those GROUPS of this project
                </p>
                <Typography>
                {adManagedObjects[project].map(item => <span>{item} <br/></span>)}
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
        )}
      <p>Involved in Projects</p>
            {memberOfProjects && memberOfProjects.map(project =>
          <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>{project}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <p>
                  member of those GROUPS of this project
                </p>
                <Typography>
                {adMemberOf[project].map(item => <span>{item} <br/></span>)}
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
        )}



    </Container>
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