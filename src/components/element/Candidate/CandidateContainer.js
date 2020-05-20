import React, {useState, useEffect} from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';

import { connect } from "react-redux";

import { addEditGroupMbrs } from "../../modules/GroupModule"
import { fetchCandidates } from "../../modules/CandidateModule"
import * as server from '../../../lib/serverData';
import CandidateView from "./CandidateView"


function CandidateContainer({group_name, fetchDataGroup, togglePopover, loading, error, members, startEditingGroup, addEditingMbs, dispatch}) {
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


  useEffect(() => {

    for (var key in filter) {
      switch(key) {
        case "Director":
          if (filter[key]) {
            rolesArr.push("Director")
          }else{
            rolesArr.filter(item => item != "Director")
          }
          break;
        case "threeD":
          if (filter[key]) {
            rolesArr.push("3D")
          }else{
            rolesArr.filter(item => item != "3D")
          }
          break;
        case "twoD":
          if (filter[key]) {
            rolesArr.push("2D")
          }else{
            rolesArr.filter(item => item != "2D")
          }
          break;
        default:
      }
    }

    console.log("RolesArr: ", rolesArr)

    dispatch(fetchCandidates(rolesArr))

  }, [filter])


  const handleAddMembers = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("choosenCand + group_name ", choosenCand ,group_name)
    dispatch(addEditingMbs(choosenCand ,group_name))
    togglePopover()
  }

  const handleChangeFilter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("handleChangeFilter: ", e.target.name)
    if(filter[e.target.name]){
      setFilter(prev => { return ({...prev, [e.target.name]: false}) 
    })
  }else{
    setFilter(prev => { return ({...prev, [e.target.name]: true}) 
  })
  }
}

  return (
    <CandidateView loading={loading} 
                  error={error} 
                  members={members} 
                  addingState={addingState} 
                  filter={filter} 
                  handleChangeFilter={handleChangeFilter} 
                  handleAddMembers={handleAddMembers}
                  choosenCand={choosenCand}
                  setChoosenCand={setChoosenCand}
                  groupName={group_name} 
                  />
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

const mapDispatchToProps = dispatch => {
  return {
      dispatch: (x) => dispatch(x),
      addEditingMbs: (candidateObj, group_name) => dispatch(addEditGroupMbrs(candidateObj, group_name)),
  }
}

const StateToProps = (state) => {

  return{
      members: state.candidate_state.candidates,
      loading: state.candidate_state.loading,
      error: state.candidate_state.error,
  }
}


export default connect(StateToProps, mapDispatchToProps)(CandidateContainer)