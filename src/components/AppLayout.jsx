import React, {useEffect} from 'react';

import AppHeader from './AppHeader';
import MessageBox from './MessageBox';
import Toolbox from './toolbox/DetailToolbox';

import FetchingIndicator from './FetchingIndicator';

import {name, version}  from '../../package.json';

export default function App(props){

        return (
            <div className={'app-layout'}>
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
                {props.children}
                {/* <FetchingIndicator open={this.props.appState.fetching}/> */}
            </div>
        )

}