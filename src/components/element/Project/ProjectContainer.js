import React, {useEffect, useState} from "react"
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import { useHistory } from "react-router-dom"
import { connect } from "react-redux";
import { createSelector } from 'reselect'

import { setActiveProject, cleanActiveProject } from "../../modules/ProjectModule"
import { fetchADGroupsMembers, fetchProjectGroupsMembers } from "../../modules/GroupModule"
import ProjectView from "./ProjectView"

function ProjectContainer(props){
    const classes = useStyles();
    const [selected, setSelected] = useState(0);
    let history = useHistory();

    useEffect(() => {

        if(!props.loadingSpinner){
          console.log("p[rojectGroup: ", props.projectGroups )
          // props.getGroupsMembers({namesArr: props.projectGroups})
          props.getProjectGroupsMembers("test_project_adv")
        }
    }, [props.loadingSpinner, props.projectGroups])


    const handleURLChange = (id) => {
        history.push(`/${id}`)
    }

    const handleCleanURL = () => {
        history.replace(`/`)
    }

    return( <ProjectView 
                getGroupsMembers={(w) => props.getGroupsMembers(w)}
                {...props}
                handleURLChange={handleURLChange}
                handleCleanURL={handleCleanURL}
                k2={true}/>)   
}


const isProjectActive = () => createSelector(
    (state, props) => state.project_state.activeProjectId === props.project_id,
    (activeBool) => {
      return activeBool
    }
  ) 

const StateToProps = () => {
    const getIsProjectActive = isProjectActive()
      return (state, ownProps) => {
        return {
            activeProject: getIsProjectActive(state, ownProps)
        }
  
  
  }
  }

const mapDispatchToProps = dispatch => {
    return {
        dispatch: (x) => dispatch(x),
        // activateProject: (_id, name) => dispatch(setActiveProject(_id, name)),
        deactivateProject: () => dispatch(cleanActiveProject()) ,
        getGroupsMembers: (Arr) => dispatch(fetchADGroupsMembers(Arr)),
        getProjectGroupsMembers: (group_name) => dispatch(fetchProjectGroupsMembers(group_name))
    }
  }



export default connect(StateToProps, mapDispatchToProps)(ProjectContainer)

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
  }));