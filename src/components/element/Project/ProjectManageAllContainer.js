import React, {useEffect, useState} from "react"
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import { useHistory } from "react-router-dom"
import { connect } from "react-redux";
import { createSelector } from 'reselect'

import { setActiveProject, cleanActiveProject } from "../../modules/ProjectModule"
import { deleteAllEditGroupsMbs, stopEditingAllGroups, addEditGroupMbrs, saveMultipleGroupsMembers } from "../../modules/GroupModule"

import ProjectManageAllView from "./ProjectManageAllView"

function ProjectManageAllContainer({
    projectObj, 
    mapUsrResource,
    bookingUserResources,
    edittingGroups,
    mapItemsByProjectId,
    deleteAllEditGroupsMbs,
    addEditGroupMbrs,
    stopEditingAllGroups, 
    saveMultipleGroupsMembers}){

    const classes = useStyles();
    const [syncState, setSyncState] = useState(0);
    let history = useHistory();

    console.log("ProjectManageAllContainer ")

    const handleSyncWithBooking = (id) => {
      setSyncState(!syncState)
    }

    const handleSaveAll = () => {
      console.log("handleSaveAll: ", edittingGroups)
      saveMultipleGroupsMembers(edittingGroups)
    }

    const handleFillAll = () => {
      
    }

    const handlePopulateFromBooking = () => {
      console.log("bookingUserResources: I was here ", bookingUserResources)
      const projectGroups = mapItemsByProjectId[projectObj.K2projectId]
      console.log("bookingUserResources: groups", projectGroups)

      projectGroups.map(group => {

             let candidatesObjArr = []
        bookingUserResources && Object.keys(bookingUserResources).map(function(key, index) {
          console.log("candidatesObjArr ", candidatesObjArr)
          console.log("mapUsrResource[key]: ", mapUsrResource[key])
          if(group.roles.indexOf(bookingUserResources[key][0]) != -1){
            console.log("Tady je toto: ", group.roles, bookingUserResources[key][0])
            candidatesObjArr.push(mapUsrResource[key])
          }
          
        })

        console.log("Just Candidates from Booking to be Pushed: ", candidatesObjArr)

        //MOCK
        addEditGroupMbrs(candidatesObjArr, group.name)
      })
 
    }


    return( <ProjectManageAllView 
                // {...props}
                projectObj={projectObj}
                handleSyncWithBooking={handleSyncWithBooking}
                syncState={syncState}
                deleteAllEditGroupsMbs={deleteAllEditGroupsMbs}
                stopEditingAllGroups={stopEditingAllGroups}
                handlePopulateFromBooking={handlePopulateFromBooking}
                handleSaveAll={handleSaveAll}
                handleFillAll={handleFillAll}
                // handleCleanURL={handleCleanURL}
                k2={true}/>)   
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
        console.log("Manage state: ", state)
        return {
            // activeProject: getIsProjectActive(state, ownProps),
            // activeProjectId: state.project_state.activeProject._id,
            mapUsrResource: state.person_state.allPersons.mapUsrResource,
            bookingUserResources: state.group_state.bookingEventsUsers.resources,
            mapItemsByProjectId: state.project_state.ADGroups.mapItemsByProjectId,
            projectObj: state.project_state.activeProject,
            edittingGroups: state.group_state.editingGroupMembers
        }
  
  
  }
  }

const mapDispatchToProps = dispatch => {
    return {
        dispatch: (x) => dispatch(x),
        // activateProject: (_id, name) => dispatch(setActiveProject(_id, name)),
        deactivateProject: () => dispatch(cleanActiveProject()) ,
        fillAllProjectGroups: (project_name) => dispatch(fillAllProjectGroups(project_name)),
        deleteAllEditGroupsMbs: (project_name) => dispatch(deleteAllEditGroupsMbs(project_name)),
        stopEditingAllGroups: () => dispatch(stopEditingAllGroups()),
        addEditGroupMbrs: (candidateObjArr, group_name) => dispatch(addEditGroupMbrs(candidateObjArr, group_name)),
        saveMultipleGroupsMembers: (groupsObjArr) => dispatch(saveMultipleGroupsMembers(groupsObjArr))
    }
  }

export default connect(StateToProps, mapDispatchToProps)(ProjectManageAllContainer)

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
  }));