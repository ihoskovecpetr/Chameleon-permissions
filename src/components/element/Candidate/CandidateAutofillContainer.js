import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormGroup from '@material-ui/core/FormGroup';
import { makeStyles } from '@material-ui/core/styles';

import { connect } from "react-redux";
import { createSelector } from 'reselect'

import { setEditingGroupMembers, addEditGroupMbrs } from "../../modules/GroupModule"
import { setEditingGroupManagers, addEditGroupManagers } from "../../modules/GroupManagerModule"

import FilterCheckView from "../sub_elements/FilterCheckView"

const roleNames = [
  {label: "MA", name: "MA"},
  {label: "SV", name: "SV"},
  {label: "GR", name: "GR"},
  {label: "MP", name: "MP"},
  {label: "3D", name: "3D"},
  {label: "2D", name: "2D"},
]

function CandidateAutofillContainer({managerGroup,
                                  allCandidates, 
                                  thisEdittingGroup, 
                                  autoFocus, 
                                  group_name,
                                  groupObj, 
                                  addEditingMbsDisp, 
                                  addEditingManagers,
                                  dispatch}) {
  const classes = useStyles();
  const [filter, setFilter] = useState({
    'MA': false,
    'SV': false,
    'GR': false,
    'MP': false,
    '3D': false,
    '2D': false,
  });
  const [filteredCand, setFilteredCand] = useState([])


  useEffect(() => {
    if(groupObj && groupObj.uppAdvGroupAttribute){

      let rolesRaster = {
        'MA': false,
        'SV': false,
        'GR': false,
        'MP': false,
        '3D': false,
        '2D': false,
      }

      const availRoles = ["MA","SV","GR","MP","3D","2D"]
      
      const defaultRolesArr = groupObj.uppAdvGroupAttribute.split(':')
      console.log("Separated roles??", defaultRolesArr)
      availRoles.map(role => {
          if(defaultRolesArr.indexOf(role) != -1){
            console.log("Setting Ddefault ROLE")
              rolesRaster[role] = true
            }
          }
        )
        setFilter(rolesRaster) 
      
    }
  },[groupObj])

  useEffect(() => {

    let choosenRolesCandidates = []    
    
    for (var key in filter) {
      if(filter[key] && allCandidates && allCandidates[`booking:${key}`]){
        choosenRolesCandidates.push(...allCandidates[`booking:${key}`])
      }
    }

    if(thisEdittingGroup){
      choosenRolesCandidates = choosenRolesCandidates.filter(candidate => {
        if( thisEdittingGroup.findIndex(i => i.sAMAccountName === candidate.sAMAccountName) != -1){
          return false
        }else{
          return true
        }
        
      })

      // choosenRolesCandidates.findIndex(i => i.sAMAccountName === candidate.sAMAccountName)
    }

    setFilteredCand(choosenRolesCandidates)

  }, [filter, allCandidates, thisEdittingGroup])

  const handleSelectCandidate = (e, personObj) => {
    if(personObj){

    switch(managerGroup) {
      case true:
        dispatch(setEditingGroupManagers(group_name))
        console.log("Autofill: personObj ,group_name: ", [personObj] ,group_name)
        addEditingManagers([personObj] ,group_name)
        break;
      case false:
        dispatch(setEditingGroupMembers(group_name))
        console.log("Autofill: personObj ,group_name: ", [personObj] ,group_name)
        addEditingMbsDisp([personObj] ,group_name)
        break;
      default:
        // code block
    }
    }
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

  const handleAutocompleteOnOpen = () => {
    console.log("handleAutocompleteKeyDown")
    dispatch(setEditingGroupMembers(group_name))
  }

  return (
    <Grid container direction="row" spacing={2}>
      <Grid item>
        <Autocomplete
          id={`combo-box-demo${group_name}`}
          options={filteredCand}
          getOptionLabel={(option) => option.name}
          className={classes.autocompleteInput}
          onChange={handleSelectCandidate}
          onOpen={handleAutocompleteOnOpen}
          renderGroup={(option) => {
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

const makeGetEditGroup = () => createSelector(
  (state, props) => props.group_name,
  (state, props) => {
    if(!props.managerGroup && state.group_state.editingGroupMembers[props.group_name]) {
      return state.group_state.editingGroupMembers[props.group_name]
    }else if(props.managerGroup && state.group_manager_state.editingGroupsManagers[props.group_name]){
      return state.group_manager_state.editingGroupsManagers[props.group_name] 
    }
    return false
  },
  (group_name, group) => {
    console.log("currentlySavingGroups CHeck MEMOIZED: for: ", group_name)
    return group
  }
) 

const StateToProps = () => {
  const getEditGroup = makeGetEditGroup()

    return (state, ownProps) => {
      return {
        thisEdittingGroup: getEditGroup(state, ownProps),
        allCandidates: state.candidate_state.allCandidates.mapCandidByRole,
      } 
  }
}


const mapDispatchToProps = dispatch => {
  return {
      dispatch: (x) => dispatch(x),
      addEditingMbsDisp: (candidateObj, group_name) => dispatch(addEditGroupMbrs(candidateObj, group_name)),
      addEditingManagers: (candidateObj, group_name) => dispatch(addEditGroupManagers(candidateObj, group_name)),

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
    color: "#52499A",
    fontWeight: 600,
    paddingLeft: 10,
    margin: 0
  }
}));