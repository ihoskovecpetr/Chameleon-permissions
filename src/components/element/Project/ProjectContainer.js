import React, {useEffect, useState} from "react"
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import { useHistory } from "react-router-dom"
import { connect } from "react-redux";
import { createSelector } from 'reselect'

import { setActiveProject, cleanActiveProject } from "../../modules/ProjectModule"
import { fetchProjectGroupsMembers, fetchBookingEvents } from "../../modules/GroupModule"
import { fetchProjectManagerGroup } from "../../modules/GroupManagerModule"
import ProjectView from "./ProjectView"
import * as CandidateActions from "../../modules/CandidateModule"

function ProjectContainer(props){
    const classes = useStyles();
    let history = useHistory();
    const {activeProject, mapItemsByProjectId} = props

    console.log("ProjectContainer ", props)


    useEffect(() => {
      props.getAllCandidates(["3D", "2D","MP","GR","manager","lead2D","lead3D","hr-manager","supervisor","producer","tech-lead2D","tech-leadMP"])
      console.log("Proj Cont push loc: ", history.location.pathname)
      // history.push(`${123}/overview`)
    }, [])

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
          props.getProjectGroupsMembers(activeProject.K2projectId)
          props.getProjectManagerGroup(activeProject.K2projectId)
        }
    }, [props.loadingSpinner, activeProject.K2projectId])


    // const handleURLChange = (id) => {
    //     // history.push(`/${id}`)
    //     history.push(`/permissions/${id}`)
    // }

    // const handleCleanURL = () => {
    //     history.replace(`/`)
    // }

    // return(<p>ProjectView</p>)

    return( <ProjectView 
                {...props}
                project_id={activeProject.K2rid}
                K2projectId={activeProject.K2projectId}
                project_name={activeProject.K2name} 
                company_name={activeProject.K2client ? activeProject.K2client : "company_name"}
                producer_name={activeProject.person && activeProject.person[0] && activeProject.person[0].id ? activeProject.person[0].id.name : "No producer"}
                director_name={activeProject.person && activeProject.person[1] && activeProject.person[1].id ? activeProject.person[1].id.name : "No director"}

                key={activeProject.K2rid} 
                // projectGroups={groupsAD && groupsAD['test_project']} //activeProject.name
                projectGroups={mapItemsByProjectId && mapItemsByProjectId[activeProject.K2projectId]} //activeProject.name
                />)   
}


// const isProjectActive = () => createSelector(
//     (state, props) => state.project_state.activeProject._id === props.project_id,
//     (activeBool) => {
//       return activeBool
//     }
//   ) 

const StateToProps = () => {
    // const getIsProjectActive = isProjectActive()
      return (state, ownProps) => {
        return {
            // activeProject: getIsProjectActive(state, ownProps),
            activeProject: state.project_state.activeProject,
            activeProjectId: state.project_state.activeProject._id,
            mapUsrResource: state.person_state.allPersons.mapUsrResource,
            mapItemsByProjectId: state.project_state.ADGroups.mapItemsByProjectId,
            bookingUserResources: state.group_state.bookingEventsUsers.resources,
            projectManagers: state.group_manager_state.mapConfGroupsByProjectId
        }
  
  
  }
  }

const mapDispatchToProps = dispatch => {
    return {
        dispatch: (x) => dispatch(x),
        // activateProject: (_id, name) => dispatch(setActiveProject(_id, name)),
        deactivateProject: () => dispatch(cleanActiveProject()) ,
        getProjectGroupsMembers: (k2ProjectId) => dispatch(fetchProjectGroupsMembers(k2ProjectId)),
        getProjectManagerGroup: (k2ProjectId) => dispatch(fetchProjectManagerGroup(k2ProjectId)),
        getBookingEvents: (project_id) => dispatch(fetchBookingEvents(project_id)),
        getAllCandidates: (roles_arr) => dispatch(CandidateActions.fetchAllCandidates(roles_arr))
    }
  }



export default connect(StateToProps, mapDispatchToProps)(ProjectContainer)

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
  }));