import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import AppHeader from './AppHeader';
import MessageBox from './MessageBox';
import Toolbox from './toolbox/DetailToolbox';

import FetchingIndicator from './FetchingIndicator';

import {name, version}  from '../../package.json';

export default function App(props){
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
                {/* <FetchingIndicator open={this.props.appState.fetching}/> */}
                </div>
            </div>
        )

}

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