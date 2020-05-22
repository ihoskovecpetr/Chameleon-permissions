import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';

import { connect } from "react-redux";

import { setEditingGroupMembers, addEditGroupMbrs } from "../../modules/GroupModule"

import { fetchCandidates } from "../../modules/CandidateModule"
import * as server from '../../../lib/serverData';
import CandidateView from "./CandidateView"


function CandidateAutofillContainer({AllCandidates, autoFocus, group_name, roleName, fetchDataGroup, togglePopover, loading, error, members, startEditingGroup, addEditingMbs, dispatch}) {
  const classes = useStyles();
  const [choosenCand, setChoosenCand] = useState([])
  const [filter, setFilter] = useState({
    Director: false,
    threeD: true,
    twoD: true,
  });
  const [addingState, setAddingState] = useState({
    loading: false,
    error: false,
    success: false
  });

  const rolesArr = []

  const handleSelectCandidate = (e, personObj) => {
    if(personObj){
      dispatch(setEditingGroupMembers(group_name))
      console.log("Autofill: personObj ,group_name: ", [personObj] ,group_name)
      dispatch(addEditingMbs([personObj] ,group_name))
    }
  }



  const handleKeyDown = (event) => {

      console.log("CandAutofill KeyDown")

    //   if (true) {
    //     dispatch(setEditingGroupMembers(group_name))
    // }

  }

  // const handleAddMembers = (e) => {
  //   e.preventDefault()
  //   e.stopPropagation()

  // }

//   const handleChangeFilter = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//     console.log("handleChangeFilter: ", e.target.name)
//     if(filter[e.target.name]){
//       setFilter(prev => { return ({...prev, [e.target.name]: false}) 
//     })
//   }else{
//     setFilter(prev => { return ({...prev, [e.target.name]: true}) 
//   })
//   }
// }

  console.log("CAndid Options: ", AllCandidates)

  useEffect(() => {
    const newCandidates = AllCandidates.reduce((acumul, currentValue) => {
      currentValue.sorter = currentValue.role[0]
      acumul.push(currentValue)
      return acumul
    }, [])

    console.log("New Curr Value: ", newCandidates)
  }, [AllCandidates])


  return (
    <Autocomplete
      id={`combo-box-demo${group_name}`}
      options={AllCandidates ? AllCandidates : []}
      getOptionLabel={(option) => option.name}
      className={classes.autocompleteInput}
      onChange={handleSelectCandidate}
      onKeyDown={handleKeyDown}
      renderGroup={(option) => {
        console.log("renderGroup: ", option)
      return <span>
                <p className={classes.greyGroup}>{option.group.split(":")[1]}</p>
                {option.children}
              </span>
      }}
      groupBy={(option) => option.sorter}
      clearOnBlur={false}
      blurOnSelect={false}
      // multiple={true}
      disableCloseOnSelect={true}
      renderInput={(params) => <TextField {...params} label="Find projects" variant="standard" autoFocus={autoFocus}/>}
    />
    // <CandidateView loading={loading} 
    //               error={error} 
    //               members={members} 
    //               addingState={addingState} 
    //               filter={filter} 
    //               handleChangeFilter={handleChangeFilter} 
    //               handleAddMembers={handleAddMembers}
    //               choosenCand={choosenCand}
    //               setChoosenCand={setChoosenCand}
    //               groupName={roleName} 
    //               />
  );
}

const mapDispatchToProps = dispatch => {
  return {
      dispatch: (x) => dispatch(x),
      addEditingMbs: (candidateObj, group_name) => dispatch(addEditGroupMbrs(candidateObj, group_name)),
  }
}

const StateToProps = (state) => {

  return{
      AllCandidates: state.candidate_state.allCandidates.candidates,
      // loading: state.candidate_state.loading,
      // error: state.candidate_state.error,
  }
}


export default connect(StateToProps, mapDispatchToProps)(CandidateAutofillContainer)

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  autocompleteInput: {
    width: 200
  },
  greyGroup:{
    color: "lightGrey",
    fontWeight: 600,
    paddingLeft: 10,
    margin: 0
  }
}));