import React, {useEffect, useState} from "react"
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import { useHistory } from "react-router-dom"
import { connect } from "react-redux";
import { createSelector } from 'reselect'

import { fetchK2Projects , fetchADProjects, setActiveProject, cleanActiveProject } from "../../modules/ProjectModule"
import ProjectView from "./ProjectView"
import ProjectContainer from "./ProjectContainer"

function AllProjectsContainer({loadingAD, errorAD, groupsAD, loadingK2, errorK2, projectsK2, activeProject, activateProject, deactivateProject, dispatch}){
    const classes = useStyles();
    const [selected, setSelected] = useState(0);
    let history = useHistory();

    
    useEffect(() => {
        console.log("Got data K2: ", projectsK2)

    }, [projectsK2])

    useEffect(() => {
      console.log("AllProjectsCont: ", activeProject)
      if(activeProject && !activeProject._id){
        console.log("Get data for active project:")
        activateProject({K2name: "Random", _id: 100546546}) 
        //TODO: find data about project from url param info.       
      }
      }, [activeProject])

    // useEffect(() => {
    //     formatedProjects = useFormateK2Object(projectsK2.slice(0, 10))
    // }, [projectsK2])


    let components = []

    if(loadingK2){components.push(<ProjectView name={"Loading..."} key="2" loadingSpinner={<CircularProgress color="secondary" />} />)} 
    if(errorK2){components.push("Error")}
    if(activeProject){components.push(<p key={activeProject.K2name}>Active Project: {activeProject.K2name}:  {activeProject._id}</p>)}
    
    if(activeProject){
        console.log()
        let count = 0
            // console.log("Rerendering AppProjectsContainer")
           components.push(
                <ProjectContainer 
                        project_id={activeProject.K2rid}
                        project_name={activeProject.K2name} 
                        company_name={activeProject.K2client ? activeProject.K2client : "company_name"}
                        producer_name={activeProject.person ? activeProject.person[0].id.name : "No producer"}
                        director_name={activeProject.person ? activeProject.person[1].id.name : "No director"}
                        idx={count} 
                        key={activeProject.K2rid} 
                        projectGroups={groupsAD && groupsAD['test_project']} //activeProject.name
                        activateProject={activateProject}
                        deactivateProject={deactivateProject}
                        k2={true}/> 
           ) 
 

    }

    if(components.length != 0){
        return  <Container maxWidth="lg" style={{marginTop: 10, height: '100vh', overflow: 'scroll'}}>
                {components.map((component, index) => {
                    return component
                    })}
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
            groupsAD: state.project_state.ADProjects.items,
            loadingAD: state.project_state.ADProjects.loading,
            errorAD: state.project_state.ADProjects.error,
            projectsK2: state.project_state.k2Projects.projects,
            loadingK2: state.project_state.k2Projects.loading,
            errorK2: state.project_state.k2Projects.error,
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