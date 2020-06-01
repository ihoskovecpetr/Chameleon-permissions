import React, {useEffect, useState} from "react"
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import MovieFilterIcon from '@material-ui/icons/MovieFilter';

import { NavLink, useHistory } from "react-router-dom"
import { connect } from "react-redux";
import { createSelector } from 'reselect'

import useFilterSearchResults from "../../../Hooks/useFilterSearchResults"
import { usePaintMatches } from "../../../Hooks/usePaintMatches"
import { usePaginationLogic } from "../../../Hooks/usePaginationLogic"

import { setActiveProject, cleanActiveProject } from "../../modules/ProjectModule"
import ProjectView from "../Project/ProjectView"
import PaginationElement from './PaginationElement'


function SearchListProjectsContainer({loadingAD, errorAD, groupsAD, mapItemsByProjectId, loadingK2, errorK2, projectsK2, activeProject, activateProject, deactivateProject, dispatch}){
    const classes = useStyles();
    let history = useHistory();
    const paintMatch = usePaintMatches();
    const [componentsState, setComponentsState] = useState([]);
    let filteredResults = useFilterSearchResults(projectsK2, history.location.search.split('=')[1])
    let {currentRange, handlePagination, handleChangeSize } = usePaginationLogic(componentsState)


    useEffect(() => {
        console.log("SearchListProjectsContainer: filteredResults ", filteredResults)
    })

    const handleOpenProject = (project) => {
        console.log("")
        activateProject(project)
        history.push(`/permissions/project/${project.K2name}`)
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
                console.log("Podminka pushing COMPDS:L ", project)
                project.item && components.push(
                    <ListItem onClick={() => {handleOpenProject(project)}} key={index} className={classes.listItem} >
                        <ListItemAvatar>
                            <Avatar className={classes.avatarIcon}>
                                <MovieFilterIcon />
                            </Avatar>
                        </ListItemAvatar>
                        {paintMatch(project.item.K2name, project.matches)} - {paintMatch(project.item.K2client, project.matches)}
                    </ListItem>
                )     
            })
    }

    if(filteredResults.length === 0){
            {projectsK2.map((project, index) => {
                    if(project){ components.push(
                    <ListItem onClick={() => {handleOpenProject(project)}} key={index} className={classes.listItem} >
                        <ListItemAvatar>
                            <Avatar className={classes.avatarIcon}>
                                <MovieFilterIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={`${project.K2name} - ${project.K2client}`} /> 
                        {mapItemsByProjectId && mapItemsByProjectId[project.K2projectId] ? "AD connected" : ""}   
                    </ListItem>
                    )}
                })
            } 
    }

    useEffect(() => {
        setComponentsState(components)
    }, [filteredResults])

    if(components.length != 0){
        console.log("Printing Components: ", components)
        return (
            <Container maxWidth="lg" className={classes.mainContainer}>
                <Grid Container>
                    <Grid item>
                        <List>
                           <p>Search Results <b>PROJECTS</b> count: <b>{filteredResults.length}</b> for phrase: <b>{location.search.split('=')[1]}</b></p>
                           <p>Current Range: <b>{currentRange.from} - {currentRange.from + currentRange.size}</b></p>
                        </List>
                    </Grid>
                    <Grid item>
                        <PaginationElement  
                            currentRange={currentRange} 
                            handleChangeSize={handleChangeSize} 
                            handlePagination={handlePagination}/>
                    </Grid>
                    <Grid item>
                        <List dense={false}>
                            {componentsState.slice(currentRange.from, (currentRange.from + currentRange.size)).map((component, index) => {
                                return component
                            })}    
                        </List>                        
                    </Grid>

                    <Grid item>
                        <PaginationElement  
                            currentRange={currentRange} 
                            handleChangeSize={handleChangeSize} 
                            handlePagination={handlePagination}/>
                    </Grid>
              
                </Grid>
            </Container>
        )}

}
 

const StateToProps = ({project_state}) => {
    // const getIsProjectActive = isProjectActive()
        return {
            groupsAD: project_state.ADGroups.items,
            mapItemsByProjectId: project_state.ADGroups.mapItemsByProjectId,
            loadingAD: project_state.ADGroups.loading,
            errorAD: project_state.ADGroups.error,
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
    mainContainer: {
        marginTop: 10, 
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