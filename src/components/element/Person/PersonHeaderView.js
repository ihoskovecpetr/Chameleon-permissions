import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';

import { makeStyles } from '@material-ui/core/styles';

export default function PersonHeaderView({person_id, person_name}) {
  const classes = useStyles();


  return (
    <div>
      <Typography >Person Header</Typography>
    <Grid container className={classes.root}>

      <Grid item xs={3}>
        <Grid container justify="center" alignContent="center">
          <Grid item>
            <PersonIcon fontSize="large" className={classes.personIcon}/>
          </Grid>   
        </Grid>   
      </Grid>  

      <Grid item xs={3}>
        <Grid container justify="center" alignContent="center">
          <Grid item xs={12} className={classes.greySubtitle}>
            Name
          </Grid>   
          <Grid item xs={12}>
          {person_name}
          </Grid> 
          <Grid item xs={12} className={classes.greySubtitle}>
            _id
          </Grid>   
          <Grid item xs={12}>
          {person_id}
          </Grid> 
        </Grid> 
      </Grid>
    <Grid item xs={3}>
  

          {/* <p className={classes.heading}>
              {project_name}
            </p>
          <div className={classes.column}>
            <p className={classes.heading}>
              {director_name}
            </p>
          </div>
          {loadingSpinner ? 
            loadingSpinner : <p className={classes.secondaryHeading}>{"K2 Project"}</p>
            } */}
        </Grid>
    </Grid>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: "white"
  },
  heading: {
    position: "relative",
    flexBasis: '20%',
    fontSize: theme.typography.pxToRem(15),
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  personIcon: {
    height: 100,
    width: 100,
  },
  greySubtitle: {
    fontWeight: 500,
    color: "lightGrey"
  },
  divider: {
    marginLeft: 10,
    marginRight: 10,
  },
}));