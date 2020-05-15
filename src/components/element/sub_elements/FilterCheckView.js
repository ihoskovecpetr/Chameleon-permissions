import React, {useState, useEffect} from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

export default function FilterCheckView({ label, name, handleChangeFilter, filter}) {
  const classes = useStyles();


  return (
    <FormControlLabel 
    label={label}
    onClick={(e) => {e.preventDefault(); e.stopPropagation()}}
    control={<Checkbox 
      name={name}
      checked={filter[name]}
      onClick={handleChangeFilter} />} />
  );
}