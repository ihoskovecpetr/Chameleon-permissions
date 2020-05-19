import React, {useEffect, useState} from "react"
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import { useHistory } from "react-router-dom"
import { connect } from "react-redux";
import { createSelector } from 'reselect'

import { fetchSinglePerson, fetchAdPersonInfo } from "../../modules/PersonModule"
import PersonView from "./PersonView"

function PersonContainer({activePerson, dispatch}){
    const classes = useStyles();
    const [selected, setSelected] = useState(0);
    let history = useHistory();

    useEffect(() => {
        console.log("Pwerson: location ", location)
          console.log("split person ID: ", location.pathname.split("person/")[1])
          dispatch(fetchSinglePerson(location.pathname.split("person/")[1]))
    }, [location.pathname])


    const handleURLChange = (id) => {
        history.push(`/${id}`)
    }

    const handleCleanURL = () => {
        history.replace(`/`)
    }

    return( <PersonView 
                // {...props}
                activePerson={activePerson}

                adManagedObjects={activePerson.adManagedObjects}
                managedProjects={activePerson.adManagedObjects && Object.keys(activePerson.adManagedObjects)}

                adMemberOf={activePerson.adMemberOf}
                memberOfProjects={activePerson.adMemberOf && Object.keys(activePerson.adMemberOf)}
                
                handleURLChange={handleURLChange}
                handleCleanURL={handleCleanURL}
                k2={true}/>)   
}


const StateToProps = ({person_state}) => {
  console.log("person_state: ", person_state)
  return {
      activePerson: person_state.activePerson
  }
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch: (x) => dispatch(x),
        // activateProject: (_id, name) => dispatch(setActiveProject(_id, name)),
        deactivateProject: () => dispatch(cleanActiveProject()) ,
        getProjectGroupsMembers: (group_name) => dispatch(fetchProjectGroupsMembers(group_name))
    }
  }



export default connect(StateToProps, mapDispatchToProps)(PersonContainer)

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
  }));