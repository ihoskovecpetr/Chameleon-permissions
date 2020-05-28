import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import BlockIcon from '@material-ui/icons/Block';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';

import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import * as server from '../../../lib/serverData';

import GroupContainer from "../Group/GroupContainer"

export default function ProjectManageAllView({
  projectObj,
  handleSyncWithBooking,
  syncState,
  deleteAllEditGroupsMbs,
  stopEditingAllGroups,
  handlePopulateFromBooking,
  handleSaveAll,
  handleFillAll,
    }) {
  const classes = useStyles();

  console.log("ProjectManageAllView rendered: ", projectObj && projectObj.K2name)

  const handleDeleteAllEditGroupsMbs = () => {
    deleteAllEditGroupsMbs(projectObj)
  }


  return (
    <div>
      <Grid container justify="center" className={classes.root}>
        <Grid item>
          <FormGroup row>
            <FormControlLabel
              control={<Switch checked={syncState} onChange={handleSyncWithBooking} name="checkedA" />}
              label="Sync with BOOKING"
            />
              <Button variant="contained" color="primary" onClick={handlePopulateFromBooking}> Populate from BOOKING </ Button>
              <Button variant="contained" className={classes.buttonFillAll} onClick={handleFillAll}> Fill All </ Button>
              <Button variant="contained" color="secondary" startIcon={<DeleteIcon />} onClick={handleDeleteAllEditGroupsMbs}> Remove All </ Button>
              <Button variant="contained" startIcon={<BlockIcon />}  className={classes.buttonCancelChanges} onClick={stopEditingAllGroups}>Cancel changes</ Button>
              <Button variant="contained" startIcon={<SaveIcon />} className={classes.buttonSave} onClick={handleSaveAll} > Save All </ Button>
          </ FormGroup>
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
  buttonSave: {
    backgroundColor: "#daaa4b"
  },
  buttonFillAll: {
    backgroundColor: "#4caf50"
  },
  buttonCancelChanges: {
    backgroundColor: '#58B3BF',
    color: "white"
  },
  avatarIcon: {
    backgroundColor: "#5F7D95",
    color: "beige",
    width: 100,
    height: 100,
  },
  folderBigIcon: {
    width: 70,
    height: 70,
  },
  personIcon: {
    height: 50,
    width: 50,
  },
  heading: {
    position: "relative",
    flexBasis: '20%',
    fontSize: theme.typography.pxToRem(15),
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
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