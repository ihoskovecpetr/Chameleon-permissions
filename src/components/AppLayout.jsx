import React from 'react';

import AppHeader from './AppHeader';
import MessageBox from './MessageBox';
import FetchingIndicator from './FetchingIndicator';

import ProjectList from './projects/ProjectList';
import ProjectDetail from './projects/ProjectDetail';

import * as ViewTypes from '../constants/ViewTypes';

import {name, version}  from '../../package.json';


export default class AppLayout extends React.PureComponent {
    constructor(props) {
        super(props);
        this.closeMessage = this.closeMessage.bind(this);
    }

    render() {
        let AppBody = null;
        switch(this.props.appState.view) {
            case ViewTypes.PROJECTS:
                AppBody =
                    <ProjectList
                        projects={this.props.projects}
                        users={this.props.users}
                        edit={this.props.editProject}
                        create={this.props.createProject}
                    />;
                break;
            case ViewTypes.PROJECT_DETAIL:
                AppBody =
                    <ProjectDetail
                        selectedProject={this.props.appState.selectedProject}
                        projects={this.props.projects}
                        users={this.props.users}
                        setView={this.props.setView}
                        updateProject={this.props.updateProject}
                        addProject={this.props.addProject}
                        //removeProject={this.props.removeProject}
                    />;
                break;
        }
        return (
            <div className={'app-layout'}>
                <AppHeader
                    appName = {name}
                    appVersion = {version}
                    user = {this.props.user}
                    refresh = {this.props.getData}
                    //logout = {this.props.logout}
                    //home = {this.props.home}
                    view = {this.props.appState.view}
                    setView = {this.props.setView}
                />
                <MessageBox message = {this.props.appState.message} close = {this.closeMessage}/>
                {AppBody}
                <FetchingIndicator open={this.props.appState.fetching}/>
            </div>
        )
    }

    closeMessage() {
        this.props.setMessage(null);
    }

}