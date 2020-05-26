import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Popover from '@material-ui/core/Popover';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import BlockIcon from '@material-ui/icons/Block';
import CircularProgress from '@material-ui/core/CircularProgress';

import Pagination from '@material-ui/lab/Pagination';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { makeStyles } from '@material-ui/core/styles';

function PaginationElement({currentRange, handleChangeSize, handlePagination}) {

  const classes = useStyles();

  return (
    <Grid item>
      <Grid container dirrection="row" alignItems="center" spacing={3}>
          <Grid item>
              <Pagination count={currentRange.pagesCount} page={currentRange.from/currentRange.size +1} color="primary" onChange={handlePagination} />
          </Grid>
          <Grid item>
          <FormControl className={classes.formControl}>
              <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={currentRange.size}
                  onChange={handleChangeSize}
                  >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={30}>30</MenuItem>
              </Select>
          </FormControl>
          </Grid>
      </Grid>
  </Grid>
  );
}


export default PaginationElement


const useStyles = makeStyles((theme) => ({
  groupMainContainer:{
    minHeight: 80,
  },
}));