import React, {useEffect, useState} from "react"
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';

import { useHistory } from "react-router-dom"
import { connect } from "react-redux";
import { createSelector } from 'reselect'

import { setActiveProject, cleanActiveProject, setSearchText } from "../modules/ProjectModule"

function SearchInputContainer({k2Projects, allPersons, activateProject, setSearchtextDisp}){
    const classes = useStyles();
    let history = useHistory();
    const [scoop, setScoop] = useState('projects')
    const [buttonCont, setButtonCont] = useState(<span><b>projects</b> people </span>)
    var stopEnter = false

    useEffect(() => {
        console.log("Search Container history: ", history)
    }, [scoop])

    const toggleScoop = () => {
      if(scoop === "projects") {
        setScoop("people")
        setButtonCont(<span> projects <b>people</b></span>)
      }
      if(scoop === "people") {
        setScoop("projects")
        setButtonCont(<span><b>projects</b> people </span>)
      }
    }
    const handleSelectProject = (_, projectObj) => {
      stopEnter = true
      console.log("Handle ACTIVATE THIS: ", projectObj)
      if(projectObj){
        activateProject(projectObj)
        history.push(`/permissions/project/${projectObj.K2name}`)
        //history.push(`/project/${projectObj.K2name}`)
      }
    }

    const handleSelectPerson = (_, personObj) => {
      stopEnter = true
      // activateProject(projectObj)
      history.push(`/permissions/person/${personObj._id}`)
      // history.push(`/person/${personObj._id}`)
    }

    const handleSearchList = (event) => {
        
        if (event.keyCode === 13 && !stopEnter) {
          console.log("Key DOWN in ENTER: ")
          setSearchtextDisp(event.target.value)
          // history.replace(`/permissions/search_projects?q=${event.target.value}`)
          console.log("history.location.pathname: ", history.location.pathname)
          if(scoop === "projects") {
            history.push(`/permissions/?q=${event.target.value}`)
            // history.push(`/?q=${event.target.value}`)
          }
          if(scoop === "people") {
            // history.push(`/search_people?q=${event.target.value}`)
            history.push(`/permissions/search_people?q=${event.target.value}`)
      }
      stopEnter = false // >> every time to false, true only when folows handleSelectProject 
      }
    }

    const AutComponent = {
      projects: <Autocomplete
      id="combo-box-demo"
      options={k2Projects ? k2Projects : []}
      getOptionLabel={(option) => option.K2name}
      className={classes.autocompleteInput}
      onChange={handleSelectProject}
      onKeyDown={handleSearchList}
      clearOnBlur={false}
      blurOnSelect={true}
      renderInput={(params) => <TextField {...params} label="Find projects" variant="outlined" autoFocus/>}
    />,
    people: <Autocomplete
    id="combo-box-demo"
    options={allPersons ? allPersons : []}
    getOptionLabel={(option) => option.name}
    className={classes.autocompleteInput}
    onChange={handleSelectPerson}
    onKeyDown={handleSearchList}
    placeholder="Place"
    clearOnBlur={false}
    blurOnSelect={true}
    renderInput={(params) => <TextField {...params} label="Find people" variant="outlined" autoFocus/>}
  />,
    }

    return (
      <Grid container alignItems="center">
        <Grid item xs={4}>
            <Button color="primary" variant="outlined" onClick={toggleScoop}>{buttonCont} >> </Button>
        </Grid>
        <Grid item xs={8}>
          {scoop === "projects" && AutComponent.projects}
          {scoop === "people" && AutComponent.people}
        {/* <Autocomplete
          id="combo-box-demo"
          options={k2Projects ? k2Projects : []}
          getOptionLabel={(option) => option.K2name}
          className={classes.autocompleteInput}
          onChange={handleSelectProject}
          onKeyDown={handleSearchList}
          clearOnBlur={false}
          blurOnSelect={true}
          renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
        /> */}
        </Grid>
      </Grid>
    );
}



const StateToProps = ({project_state, person_state}) => { 
        return {
            k2Projects: project_state.k2Projects.projects, 
            allPersons: person_state.allPersons.persons,
        }
  }

const mapDispatchToProps = dispatch => {
    return {
        dispatch: (x) => dispatch(x),
        activateProject: (projectObj) => dispatch(setActiveProject(projectObj)),
        deactivateProject: () => dispatch(cleanActiveProject()) ,
        setSearchtextDisp: (searchtext) => dispatch(setSearchText(searchtext))
    }
  }


export default connect(StateToProps, mapDispatchToProps)(SearchInputContainer)

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    autocompleteInput: {
      width: 300, 
      color: "white", 
      backgroundColor: "white"
    },
  }));