import React, {useEffect, useState} from "react"
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import { NavLink, useHistory, useRouteMatch } from "react-router-dom";
import { connect } from "react-redux";
import { createSelector } from 'reselect'

import { setActiveProject, cleanActiveProject } from "../../modules/ProjectModule"
import ProjectView from "./ProjectView"
import ProjectContainer from "./ProjectContainer"
import ProjectOverviewContainer from "./ProjectOverviewContainer"

function AllProjectsContainer({ projectGroups, activeProject, activateProject, dispatch}){
  let history = useHistory();
  let match = useRouteMatch()

  console.log("AllProjectsContainer: projectGroups: ", projectGroups)
  console.log("AllProjectsContainer: history: ", history)
  console.log("AllProjectsContainer: match: ", match)

  useEffect(() => {
      console.log("AllProjectsCont: ", activeProject)
      if(activeProject && !activeProject._id){
        console.log("Get data for active project:")
        activateProject({K2name: "Random", _id: 100546546}) 
        //TODO: find data about project from url param info.       
      }
    }, [activeProject])

    let components = []

    components.push(
      <div>
      {/* <Grid container justify="flex-start">
        <Grid item>
          <Grid container justify="center">
            <Grid item>
            <div onClick={() => {history.push(`/permissions/project/${activeProject.K2name}`)}}> Groups </div>
            <Grid>
          </Grid>
          <Grid container justify="center">
            <Grid item>
            <NavLink to={`${history.location.pathname}/overview`}><p>overview</p></NavLink>
            <Grid>
          </Grid>
        <Grid>
      </Grid> */}

      <ButtonGroup size="large" aria-label="outlined contained button group">
        <Button variant="contained" 
                color={projectGroups ? "primary" : ""} 
                onClick={() => {history.push(`/permissions/project/${activeProject.K2name}`)}}>
                  Groups
        </Button>
        <Button variant="contained" 
                color={projectGroups ? "" : "primary"} 
                onClick={() => {history.push(`/permissions/project/${activeProject.K2name}/overview`)}}>
                  MANAGERS
        </Button>
      </ButtonGroup>
    </div>
    )

    if(activeProject && projectGroups){
           components.push(
             <div>
                <p>Project - Group</p>
                <ProjectContainer 
                        // project_id={activeProject.K2rid}
                        // projectK2Id={activeProject.K2projectId}
                        // project_name={activeProject.K2name} 
                        // company_name={activeProject.K2client ? activeProject.K2client : "company_name"}
                        // producer_name={activeProject.person && activeProject.person[0] && activeProject.person[0].id ? activeProject.person[0].id.name : "No producer"}
                        // director_name={activeProject.person && activeProject.person[1] && activeProject.person[1].id ? activeProject.person[1].id.name : "No director"}
        
                        // key={activeProject.K2rid} 
                        // // projectGroups={groupsAD && groupsAD['test_project']} //activeProject.name
                        // projectGroups={mapItemsByProjectId && mapItemsByProjectId[activeProject.K2projectId]} //activeProject.name
                        /> 
              </div>
           ) 
    }

      if(activeProject && !projectGroups){
        components.push(
          <div>
            <p>Project - Overview</p>
            <ProjectOverviewContainer 
                    // project_id={activeProject.K2rid}
                    // projectK2Id={activeProject.K2projectId}
                    // project_name={activeProject.K2name} 
                    // company_name={activeProject.K2client ? activeProject.K2client : "company_name"}
                    // producer_name={activeProject.person && activeProject.person[0] && activeProject.person[0].id ? activeProject.person[0].id.name : "No producer"}
                    // director_name={activeProject.person && activeProject.person[1] && activeProject.person[1].id ? activeProject.person[1].id.name : "No director"}
    
                    // key={activeProject.K2rid} 
                    // // projectGroups={groupsAD && groupsAD['test_project']} //activeProject.name
                    // projectGroups={mapItemsByProjectId && mapItemsByProjectId[activeProject.K2projectId]} //activeProject.name
                    /> 
          </div>
        ) 
  }

    if(components.length != 0){
        return  <Container maxWidth="lg" style={{marginTop: 10}}>
                  <Grid container>
                    <Grid item xs={3}>
                    <Grid container style={{padding: 5, height: '100%'}}>
                    <Grid item xs={12} style={{backgroundColor: 'white'}}>
                      
                      Projects list
                    </Grid>
                    </Grid>
                    </Grid>
                    <Grid item xs={9}>
                      {components.map((component, index) => {
                                  return component
                                  })}
                    </Grid>
        
                </Grid>
            </ Container>

    }

    return(
        <p>
            rendering..
        </p>
    )
}
 

const StateToProps = ({}) => {
    // const getIsProjectActive = isProjectActive()
      return (state, ownProps) => {
        return {
            activeProject: state.project_state.activeProject
        }
    }
  }

const mapDispatchToProps = dispatch => {
    return {
        dispatch: (x) => dispatch(x),
        activateProject: (_id, name) => dispatch(setActiveProject(_id, name)),
        deactivateProject: () => dispatch(cleanActiveProject()) ,
    }
  }


export default connect(StateToProps, mapDispatchToProps)(AllProjectsContainer)

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
  }));