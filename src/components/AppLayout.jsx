import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { connect } from "react-redux";

import AppHeader from './AppHeader';
import MessageBox from './MessageBox';
import Toolbox from './toolbox/DetailToolbox';
import FetchingIndicator from './FetchingIndicator';
import {name, version}  from '../../package.json';

function App(props){
    const classes = useStyles();

        return (
            <div className={classes.appLayout}>
                <AppHeader
                    appName = {name}
                    appVersion = {version}
                    user = {props.user}
                    refresh = {props.getData}
                    view = {props.appState.view.type}
                    activeBid = {props.appState.activeBid}
                    setView = {props.setView}

                    projectNoEditData = {Object.keys(props.appState.projectEditedData).length === 0}
                    companyNoEditData = {Object.keys(props.appState.companyEditedData).length === 0}
                    personNoEditData = {Object.keys(props.appState.personEditedData).length === 0}

                    box = {props.appState.box}
                />
                <Toolbox />
                <MessageBox message = {props.appState.message} setMessage = {props.setMessage}/>
                <div className={classes.bodyWrap}>
                {props.children}
                </div>
                <FetchingIndicator open={(props.loadingAD || props.loadingADManagers || props.loadingK2 || props.loadingPerson)}/>
            </div>
        )

}

const StateToProps = () => {
    return (state, ownProps) => {
      return {
          loadingAD: state.project_state.ADGroups &&  state.project_state.ADGroups.loading,
          loadingADManagers: state.project_state.ADManagerGroups &&  state.project_state.ADManagerGroups.loading,
          loadingK2: state.project_state.k2Projects && state.project_state.k2Projects.loading,
          loadingPerson: state.person_state.allPersons && state.person_state.allPersons.loading,
      }
  }
}

const mapDispatchToProps = dispatch => {
  return {
      dispatch: (x) => dispatch(x),
  }
}

export default connect(StateToProps, mapDispatchToProps)(App)

const useStyles = makeStyles((theme) => ({
    appLayout: {
        height: '100%',
        position: 'absolute',
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#dcdcdc',
    },
    bodyWrap: {
        overflow: 'scroll',
    },
    details: {
      alignItems: 'center',
    },
    column: {
      flexBasis: '50%',
    },
    helper: {
      borderLeft: `2px solid lightGrey`,
      padding: theme.spacing(1, 2),
    },
    divider: {
      marginLeft: 10,
      marginRight: 10,
    },
    newOneChip: {
      backgroundColor: '#4caf50'
    },
    saveChip: {
      backgroundColor: '#daaa4b'
    }
  }));