import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';

import FilterCheckView from "../sub_elements/FilterCheckView"


export default function PopoverBody({ loading, error, members, filter, handleChangeFilter, handleAddMembers, choosenCand, setChoosenCand, dispatch}) {
  const classes = useStyles();


  const handleCheckCand = (e, value) => {
    if(e.target.checked) setChoosenCand(prev => {return([...prev, value])})
    if(!e.target.checked) setChoosenCand(prev => {return(prev.filter(item => item.ssoId != value.ssoId))})
  }

const roleNames = [
  {label: "Director", name: "Director"},
  {label: "3D", name: "threeD"},
  {label: "2D", name: "twoD"},
]

  return (
    <div className={classes.root}>
      <div className={classes.topFilterSett}>
        <FormGroup row >
          {roleNames.map(role => <FilterCheckView label={role.label} name={role.name} handleChangeFilter={handleChangeFilter} filter={filter} />)}
        </FormGroup>
      </div>
      {loading && <div className={classes.popover_wrap}>Load This shhhh</div>}
      {error && <div className={classes.popover_wrap}>Errror</div>}
      {members &&
      <div className={classes.popover_wrap}>
        {members.map((value) => {
        const labelId = `transfer-list-item-${value.name}-label`;
          return <ListItem key={value.name} 
                          role="listitem"
                          button 
                          onClick={(e) => {e.stopPropagation()}}
                          >
              <ListItemIcon>
              <Checkbox
                  // checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                  onChange={(e) => {handleCheckCand(e, value)}}
              />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.name}`} />
          </ListItem>
      })}
      </div>
      }
      <Grid container justify="center">
          <Grid item xs={6}>
          <Grid container justify="center">
            <Button size="small" variant="contained" onClick={handleAddMembers} className={classes.addButton}>
              Add
            </Button>
          </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container justify="center">
            <Button size="small" color="primary">
              Close
            </Button>
            </Grid>
          </Grid>
      </Grid>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: 'beige',
  },
  topFilterSett: {
    boxShadow: "0px 0px 8px 0px rgba(0,0,0,0.35)",
    position: "relative",
    zIndex: 10
  },
  popover_wrap: {
    height: 400,
    backgroundColor: 'white',
    overflow: 'scroll'
  },
  addButton: {
    backgroundColor: '#4caf50',
    width: '100%'
  },
}));