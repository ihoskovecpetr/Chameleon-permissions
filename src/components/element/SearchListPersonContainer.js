import React, {useEffect, useState} from "react"
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';

import { NavLink, useHistory } from "react-router-dom"
import { connect } from "react-redux";
import { createSelector } from 'reselect'

import useFilterSearchPeople from "../../Hooks/useFilterSearchPeople"
import { usePaintMatches } from "../../Hooks/usePaintMatches"

import { fetchK2Projects , fetchADProjects, setActiveProject, cleanActiveProject } from "../modules/ProjectModule"
import ProjectView from "./Project/ProjectView"


function SearchListPersonContainer({allPersons, activeProject, activateProject, deactivateProject, dispatch}){
    const classes = useStyles();
    const [selected, setSelected] = useState(0);
    let history = useHistory();
    const paintMatch = usePaintMatches();
    let filteredResults = useFilterSearchPeople(allPersons, history.location.search.split('=')[1])


    useEffect(() => {
        console.log("SearchList ", location, history)
    }, [allPersons])



    let components = []

    // if(loadingK2){components.push(<ProjectView name={"Loading..."} loadingSpinner={<CircularProgress color="secondary" />} />)} 
    // if(errorK2){components.push("Error")}
    if(activeProject){components.push(<p>Active Project: {activeProject.K2name}:  {activeProject._id}</p>)}
    
    if(filteredResults.length > 0){
        console.log()
        let count = 0
        components.push(
            <li>
                Search Results PEOPLE count: {filteredResults.length} for {location.search.split('=')[1]}
             </li>
             )
            filteredResults.map((result, index) => {
                    result.item && components.push(
                //     <ListItem onDoubleClick={() => {history.push(`/permissions/person/${result.item.K2name}`)}} key={index} className={classes.listItem} >
                    <ListItem onDoubleClick={() => {history.push(`/person/${result.item._id}`)}} key={index} className={classes.listItem} >
                        <ListItemAvatar>
                            <Avatar className={classes.avatarIcon}>
                                <PersonIcon />
                            </Avatar>
                        </ListItemAvatar>
                            {paintMatch(result.item.name, result.matches)} - {paintMatch(result.item.name, result.matches)}
                    </ListItem>
                )     
            })
    }

    if(components.length != 0){
        return (
            <Container maxWidth="lg" style={{marginTop: 10, height: '100vh', overflow: 'scroll'}}>
                SEARCH LIST PERSON
                <List dense={false}>
                    {components.map((component, index) => {
                        return component
                    })}    
                </List>
            </Container>
        )}

    return(
        <Container maxWidth="lg" style={{marginTop: 10, height: '100vh', overflow: 'scroll'}}>
            SEARCH LIST PERSON
        <List dense={false}>
            {filteredResults.map((result, index) => {
                    result && components.push(
                //     <ListItem onDoubleClick={() => {history.push(`/permissions/person/${result.item.K2name}`)}} key={index} className={classes.listItem} >
                    <ListItem onDoubleClick={() => {history.push(`/person/${result.item.K2name}`)}} key={index} className={classes.listItem} >
                        <ListItemAvatar>
                            <Avatar className={classes.avatarIcon}>
                                <PersonIcon />
                            </Avatar>
                        </ListItemAvatar>
                            {/* {paintMatch(result.item.K2name, result.matches)} - {paintMatch(result.item.K2client, result.matches)} */}
                    </ListItem>
                )     
            })}  
        </List>
    </Container>
    )
}
 

const StateToProps = ({project_state, person_state}) => {
    // const getIsProjectActive = isProjectActive()
        return {
            allPersons: person_state.allPersons.users,
            // loadingAD: project_state.ADProjects.loading,
            // errorAD: project_state.ADProjects.error,

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



export default connect(StateToProps, mapDispatchToProps)(SearchListPersonContainer)

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