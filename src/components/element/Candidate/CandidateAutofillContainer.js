import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormGroup from '@material-ui/core/FormGroup';
import { makeStyles } from '@material-ui/core/styles';

import { connect } from "react-redux";

import { setEditingGroupMembers, addEditGroupMbrs } from "../../modules/GroupModule"

import FilterCheckView from "../sub_elements/FilterCheckView"

function CandidateAutofillContainer({allCandidates, autoFocus, group_name, roleName, fetchDataGroup, togglePopover, loading, error, members, startEditingGroup, addEditingMbs, dispatch}) {
  const classes = useStyles();
  const [choosenCand, setChoosenCand] = useState([])
  const [filter, setFilter] = useState({
    GR: false,
    MP: false,
    '3D': true,
    '2D': true,
  });
  const [filteredCand, setFilteredCand] = useState([])

  const rolesArr = []

  const handleSelectCandidate = (e, personObj) => {
    if(personObj){
      dispatch(setEditingGroupMembers(group_name))
      console.log("Autofill: personObj ,group_name: ", [personObj] ,group_name)
      dispatch(addEditingMbs([personObj] ,group_name))
    }
  }

  useEffect(() => {

    let choosenRolesCandidates = []    
    
    for (var key in filter) {
      if(filter[key] && allCandidates && allCandidates[`booking:${key}`]){
        choosenRolesCandidates.push(...allCandidates[`booking:${key}`])
      }
    }
    setFilteredCand(choosenRolesCandidates)
    // dispatch(fetchCandidates(rolesArr))

  }, [filter, allCandidates])

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

  const roleNames = [
    {label: "GR", name: "GR"},
    {label: "MP", name: "MP"},
    {label: "3D", name: "3D"},
    {label: "2D", name: "2D"},
  ]

  return (
    <Grid container direction="row">
      <Grid item>
        <Autocomplete
          id={`combo-box-demo${group_name}`}
          options={filteredCand}
          getOptionLabel={(option) => option.name}
          className={classes.autocompleteInput}
          onChange={handleSelectCandidate}
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
      </Grid>
      <Grid item>
        <FormGroup row >
          {roleNames.map(role => <FilterCheckView label={role.label} key={role.name} name={role.name} handleChangeFilter={handleChangeFilter} filter={filter} />)}
        </FormGroup>
      </Grid>
    </Grid>
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
      allCandidates: state.candidate_state.allCandidates.mapCandidByRole,
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