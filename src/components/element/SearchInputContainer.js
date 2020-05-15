import React, {useEffect, useState} from "react"
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';

import { useHistory, Redirect } from "react-router-dom"
import { connect } from "react-redux";
import { createSelector } from 'reselect'

import { setActiveProject, cleanActiveProject, setSearchText } from "../modules/ProjectModule"
import { fetchADGroupsMembers } from "../modules/GroupModule"
import ProjectView from "./ProjectView"

function SearchInputContainer({k2Projects, activateProject, setSearchtextDisp}){
    const classes = useStyles();
    const [selected, setSelected] = useState(0);
    let history = useHistory();

    useEffect(() => {
        console.log("Search Container: ", k2Projects)
    })

    const handleSelectProject = (_, projectObj) => {
      activateProject(projectObj)
      // history.push(`/permissions/project/${projectObj.K2name}`)
      history.push(`/project/${projectObj.K2name}`)
    }

    const handleSearchList = (event) => {
      console.log("onKeyDown: ", event)
      if (event.keyCode === 13) {
        setSearchtextDisp(event.target.value)
        // history.replace(`/permissions/searchlist?q=${event.target.value}`)
        history.replace(`/searchlist?q=${event.target.value}`)
    }
    }

    return (
      <Autocomplete
        id="combo-box-demo"
        options={k2Projects ? k2Projects : []}
        getOptionLabel={(option) => option.K2name}
        className={classes.autocompleteInput}
        onChange={handleSelectProject}
        onKeyDown={handleSearchList}
        renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
      />
    );
}




const StateToProps = ({project_state}) => { 
        return {
            k2Projects: project_state.k2Projects.projects, 
        }
  }

const mapDispatchToProps = dispatch => {
    return {
        dispatch: (x) => dispatch(x),
        activateProject: (projectObj) => dispatch(setActiveProject(projectObj)),
        deactivateProject: () => dispatch(cleanActiveProject()) ,
        // getGroupsMembers: (Arr) => dispatch(fetchADGroupsMembers(Arr))
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