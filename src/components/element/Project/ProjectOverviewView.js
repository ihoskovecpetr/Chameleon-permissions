import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'; 
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import FaceIcon from '@material-ui/icons/Face';

import { makeStyles } from '@material-ui/core/styles';

import ProjectHeaderView from "./ProjectHeaderView"
import GroupManagerContainer from "../GroupManager/GroupManagerContainer"

export default function ProjectView({
      project_id, project_name, 
      company_name, producer_name, director_name, 
      loadingSpinner, projectGroups, 
      bookingUserResourcesMngs, mapUsrById}) {
  const classes = useStyles();
  const [openRes, setOpenRes] = useState(false)
  
  console.log("ProjectView rendered projectGroups: ", projectGroups)


  return (
    <div className={classes.root}>

      <ProjectHeaderView 
          project_id={project_id} 
          project_name={project_name} 
          company_name={company_name} 
          producer_name={producer_name} 
          director_name={director_name} 
          loadingSpinner={loadingSpinner} />

       <Grid container direction="row">

      <List>
        <ListItem button onClick={() => setOpenRes(!openRes)}>
          <ListItemText primary="Show Booking Resources" />
          {openRes ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openRes} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>

          {bookingUserResourcesMngs && Object.keys(bookingUserResourcesMngs).map(function(key, index) {
            return <ListItem button key={key}>
                  <ListItemIcon>
                    <Chip 
                        label={`${mapUsrById && mapUsrById[key] && mapUsrById[key].ssoId}`}
                        key={key}
                        className={classes.anyChip}
                        color="secondary"
                        disabled={true}
                        icon={<FaceIcon />}
                        />
                  </ListItemIcon>
                  <ListItemText primary="Starred" />
                  <p>Resource : {key} <br/> Type: {bookingUserResourcesMngs[key]} - {mapUsrById && mapUsrById[key] && mapUsrById[key].ssoId}</p>
                </ListItem>
            })}
          </List>
        </Collapse>
      </List>

      </ Grid>

      <Grid container className={classes.gridGroups}>
        {projectGroups && projectGroups.map((group, index) => {
          console.log("Iter project Groups: ", group)
         return <GroupManagerContainer group_name={group.name} groupObj={group} project_name={project_name} key={index} autoFocus={index === 0} />
        }
        )}
        {!projectGroups && <p>No AD data</p> }
        </Grid>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  gridGroups: {
    backgroundColor: "white",
    width: '100%',
  },
  divider: {
    margin: 10
  },
}));