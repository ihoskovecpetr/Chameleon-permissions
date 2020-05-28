import React, {useEffect, useState} from "react"
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';

import { NavLink, useHistory } from "react-router-dom"
import { connect } from "react-redux";
import { createSelector } from 'reselect'

import useFilterSearchPeople from "../../../Hooks/useFilterSearchPeople"
import { usePaintMatches } from "../../../Hooks/usePaintMatches"
import { usePaginationLogic } from "../../../Hooks/usePaginationLogic"
import PaginationElement from './PaginationElement'

import { setActiveProject, cleanActiveProject } from "../../modules/ProjectModule"


function SearchListPersonContainer({allPersons, activeProject, activateProject, deactivateProject, dispatch}){
    const classes = useStyles();
    let history = useHistory();
    const [componentsState, setComponentsState] = useState([]);
    const paintMatch = usePaintMatches();
    let filteredResults = useFilterSearchPeople(allPersons, history.location.search.split('=')[1])
    let {currentRange, handlePagination, handleChangeSize } = usePaginationLogic(filteredResults)

    let components = []

    // if(loadingK2){components.push(<ProjectView name={"Loading..."} loadingSpinner={<CircularProgress color="secondary" />} />)} 
    // if(errorK2){components.push("Error")}
    if(activeProject){components.push(<p>Active Person: {activeProject.K2name}:  {activeProject._id}</p>)}
    
    if(filteredResults.length > 0){
            filteredResults.map((result, index) => {
                    result.item && components.push(
                        // <ListItem onDoubleClick={() => {history.push(`/person/${result.item._id}`)}} key={index} className={classes.listItem} >
                    <ListItem onClick={() => {history.push(`/permissions/person/${result.item._id}`)}} key={index} className={classes.listItem} >
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

    if(filteredResults.length === 0){
            components.push(<h1> No Results for {history.location.search.split('=')[1]}</h1>)
                allPersons.map((result, index) => {
                        result && components.push(
                        // <ListItem onDoubleClick={() => {history.push(`/person/${result.item.K2name}`)}} key={index} className={classes.listItem} >
                        <ListItem onClick={() => {history.push(`/permissions/person/${result._id}`)}} key={index} className={classes.listItem} >
                            <ListItemAvatar>
                                <Avatar className={classes.avatarIcon}>
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            {result.displayName}
                                {/* {paintMatch(result.item.K2name, result.matches)} - {paintMatch(result.item.K2client, result.matches)} */}
                        </ListItem>
                    )     
                })
    }

    useEffect(() => {
        setComponentsState(components)
    }, [filteredResults])

        return (
            <Container maxWidth="lg" classname={classes.mainContainer}>
                <Grid Container>
                    <Grid item>
                        <List>
                           <p>Search Results <b>PEOPLE</b> count: <b>{filteredResults.length}</b> for phrase: <b>{location.search.split('=')[1]}</b></p>
                           <p>Current Range: <b>{currentRange.from} - {currentRange.from + currentRange.size}</b></p>
                        </List>
                    </Grid>

                    <PaginationElement  
                        currentRange={currentRange} 
                        handleChangeSize={handleChangeSize} 
                        handlePagination={handlePagination}/>

                    <Grid item xs={12}>
                        <List dense={false}>
                            {componentsState.slice(currentRange.from, (currentRange.from + currentRange.size)).map((component, index) => {
                                return component
                            })}
                        </List>
                    </Grid>

                    <PaginationElement  
                        currentRange={currentRange} 
                        handleChangeSize={handleChangeSize} 
                        handlePagination={handlePagination}/>
                    
                </Grid>
            </Container>
        )
}
 

const StateToProps = ({project_state, person_state}) => {
    // const getIsProjectActive = isProjectActive()
        return {
            allPersons: person_state.allPersons.persons,
            // loadingAD: project_state.ADGroups.loading,
            // errorAD: project_state.ADGroups.error,
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