import React, {useEffect, useState} from "react"
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import { useHistory } from "react-router-dom"
import { connect } from "react-redux";
import { createSelector } from 'reselect'

import { setActiveProject, cleanActiveProject } from "../../modules/ProjectModule"
import { fetchProjectGroupsMembers, fetchBookingEvents } from "../../modules/GroupModule"
import ProjectView from "./ProjectView"

function ProjectContainer(props){
    const classes = useStyles();
    const [selected, setSelected] = useState(0);
    let history = useHistory();

    console.log("ProjectContainer: bookingUserResources ", props.bookingUserResources)

    useEffect(() => {
    console.log("Project CONTTT", props.activeProjectId)
//       if(props.activeProjectId){
//         console.log("GET BOOK EVENT fr this event ", props.activeProjectId)
//         props.getBookingEvents(props.activeProjectId)
//       }
      props.getBookingEvents(props.activeProjectId)
  }, [props.activeProjectId])

    useEffect(() => {

        if(!props.loadingSpinner){
          console.log("p[rojectGroup: ", props.projectGroups )
          props.getProjectGroupsMembers("test_project_adv")
        }
    }, [props.loadingSpinner, props.projectGroups])


    const handleURLChange = (id) => {
        // history.push(`/${id}`)
        history.push(`/permissions/${id}`)
    }

    const handleCleanURL = () => {
        history.replace(`/`)
    }

    return( <ProjectView 
                {...props}
                handleURLChange={handleURLChange}
                handleCleanURL={handleCleanURL}
                k2={true}/>)   
}


const isProjectActive = () => createSelector(
    (state, props) => state.project_state.activeProject._id === props.project_id,
    (activeBool) => {
      return activeBool
    }
  ) 

const StateToProps = () => {
    const getIsProjectActive = isProjectActive()
      return (state, ownProps) => {
        return {
            activeProject: getIsProjectActive(state, ownProps),
            activeProjectId: state.project_state.activeProject._id,
            mapUsrResource: state.person_state.allPersons.mapUsrResource,
            bookingUserResources: state.group_state.bookingEventsUsers.resources
        }
  
  
  }
  }

const mapDispatchToProps = dispatch => {
    return {
        dispatch: (x) => dispatch(x),
        // activateProject: (_id, name) => dispatch(setActiveProject(_id, name)),
        deactivateProject: () => dispatch(cleanActiveProject()) ,
        getProjectGroupsMembers: (group_name) => dispatch(fetchProjectGroupsMembers(group_name)),
        getBookingEvents: (project_id) => dispatch(fetchBookingEvents(project_id))
    }
  }



export default connect(StateToProps, mapDispatchToProps)(ProjectContainer)

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
  }));