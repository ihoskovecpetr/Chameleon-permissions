import React, {useEffect, useState} from "react"
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import FolderSharedIcon from '@material-ui/icons/FolderShared';

import { NavLink, useHistory } from "react-router-dom"
import { connect } from "react-redux";
import { createSelector } from 'reselect'

import useFilterSearchResults from "../../Hooks/useFilterSearchResults"
import { usePaintMatches } from "../../Hooks/usePaintMatches"

import { fetchK2Projects , fetchADProjects, setActiveProject, cleanActiveProject } from "../modules/ProjectModule"
import { fetchADGroupsMembers } from "../modules/GroupModule"
import ProjectView from "./Project/ProjectView"


function SearchListProjectsContainer({loadingAD, errorAD, groupsAD, loadingK2, errorK2, projectsK2, activeProject, activateProject, deactivateProject, dispatch}){
    const classes = useStyles();
    const [selected, setSelected] = useState(0);
    let history = useHistory();
    const paintMatch = usePaintMatches();
    let filteredResults = useFilterSearchResults(projectsK2, history.location.search.split('=')[1])


    useEffect(() => {

    }, [projectsK2])

    const handleDoubleClickProject = (project) => {
        activateProject(project)
        history.push(`/project/${project.K2name}`)
    }

    let components = []

    if(loadingK2){components.push(<ProjectView name={"Loading..."} loadingSpinner={<CircularProgress color="secondary" />} />)} 
    if(errorK2){components.push("Error")}
    if(activeProject){components.push(<p>Active Project: {activeProject.K2name}:  {activeProject._id}</p>)}
    
    if(filteredResults.length > 0){
        console.log()
        let count = 0
        components.push(
            <li>
                Search Results PROJECTS count: {filteredResults.length} for " {location.search.split('=')[1]} "
             </li>
             )
            filteredResults.map((project, index) => {
                console.log("SINGLE RESULT: ", project)
                project.item && components.push(
                //     <ListItem onDoubleClick={() => {history.push(`/permissions/project/${project.item.K2name}`)}} key={index} className={classes.listItem} >
                    <ListItem onDoubleClick={() => {handleDoubleClickProject(project)}} key={index} className={classes.listItem} >
                        <ListItemAvatar>
                            <Avatar className={classes.avatarIcon}>
                                <FolderSharedIcon />
                            </Avatar>
                        </ListItemAvatar>
                            {paintMatch(project.item.K2name, project.matches)} - {paintMatch(project.item.K2client, project.matches)}
                    </ListItem>
                )     
            })
    }

    if(components.length != 0){
        return (
            <Container maxWidth="lg" style={{marginTop: 10, height: '100vh', overflow: 'scroll'}}>
                <List dense={false}>
                    {components.map((component, index) => {
                        return component
                    })}    
                </List>
            </Container>
        )}

    return(
        <Container maxWidth="lg" style={{marginTop: 10, height: '100vh', overflow: 'scroll'}}>
        <List dense={false}>
            {projectsK2 && projectsK2.map((project, index) => {
                    if(project && index <= 20){ return(
                //     <ListItem onDoubleClick={() => {history.push(`/permissions/project/${project.item.K2name}`)}} key={index} className={classes.listItem} >
                    <ListItem onDoubleClick={() => {handleDoubleClickProject(project)}} key={index} className={classes.listItem} >
                        <ListItemAvatar>
                            <Avatar className={classes.avatarIcon}>
                                <FolderSharedIcon />
                            </Avatar>
                        </ListItemAvatar>
                            {project.K2name} - {project.K2client}
                    </ListItem>
                )}     
            })}  
        </List>
    </Container>
    )
}
 

const StateToProps = ({project_state}) => {
    // const getIsProjectActive = isProjectActive()
        return {
            groupsAD: project_state.ADProjects.items,
            loadingAD: project_state.ADProjects.loading,
            errorAD: project_state.ADProjects.error,
            projectsK2: project_state.k2Projects.projects,
            loadingK2: project_state.k2Projects.loading,
            errorK2: project_state.k2Projects.error,
            activeProject: project_state.activeProject,
            searchText: project_state.searchText // this is here just to force rerender on URL query change
        }
  }

const mapDispatchToProps = dispatch => {
    return {
        dispatch: (x) => dispatch(x),
        activateProject: (_id, name) => dispatch(setActiveProject(_id, name)),
        deactivateProject: () => dispatch(cleanActiveProject()) ,
    }
  }



export default connect(StateToProps, mapDispatchToProps)(SearchListProjectsContainer)

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    avatarIcon: {
        backgroundColor: "#5F7D95",
        color: "beige"
    },
    listItem: {
        backgroundColor: "white",
        marginBottom: 2,
    '&:hover': {
        background: "lightBlue",
        },
    }
  }));