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
import FolderIcon from '@material-ui/icons/Folder';

import { NavLink, useHistory } from "react-router-dom"
import { connect } from "react-redux";
import { createSelector } from 'reselect'

import { fetchK2Projects , fetchADProjects, setActiveProject, cleanActiveProject } from "../modules/ProjectModule"
import { fetchADGroupsMembers } from "../modules/GroupModule"
import useFilterSearchResults from "../../Hooks/useFilterSearchResults"
import { usePaintMatches } from "../../Hooks/usePaintMatches"

function ProjectsWrap({loadingAD, errorAD, groupsAD, loadingK2, errorK2, projectsK2, activeProject, activateProject, deactivateProject, dispatch}){
    const classes = useStyles();
    const [selected, setSelected] = useState(0);
    let history = useHistory();
    const paintMatch = usePaintMatches();
    let filteredResults = useFilterSearchResults(projectsK2, history.location.search.split('=')[1])


    useEffect(() => {
        console.log("SearchList ", location, history)

    }, [projectsK2])



    let components = []

    if(loadingK2){components.push(<ProjectView name={"Loading..."} loadingSpinner={<CircularProgress color="secondary" />} />)} 
    if(errorK2){components.push("Error")}
    if(activeProject){components.push(<p>Active Project: {activeProject.K2name}:  {activeProject._id}</p>)}
    
    if(filteredResults.length > 0){
        console.log()
        let count = 0
        components.push(
            <li>
                Search Results COUNT: {filteredResults.length} for {location.search.split('=')[1]}
             </li>
             )
            // console.log("Rerendering AppProjectsContainer")
            filteredResults.map((result, index) => {
                console.log("SINGLE RESULT: ", result)
                    result.item && components.push(
                //     <ListItem onDoubleClick={() => {history.push(`/permissions/project/${result.item.K2name}`)}} key={index} className={classes.listItem} >
                    <ListItem onDoubleClick={() => {history.push(`/project/${result.item.K2name}`)}} key={index} className={classes.listItem} >
                        <ListItemAvatar>
                            <Avatar>
                                <FolderIcon />
                            </Avatar>
                        </ListItemAvatar>
                            {paintMatch(result.item.K2name, result.matches)} - {paintMatch(result.item.K2client, result.matches)}
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
        <p>
            searching..
        </p>
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



export default connect(StateToProps, mapDispatchToProps)(ProjectsWrap)

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    listItem: {
    '&:hover': {
        background: "#ffffff",
        },
    }
  }));