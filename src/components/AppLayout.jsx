import React from 'react';

import AppHeader from './AppHeader';
import MessageBox from './MessageBox';
import FetchingIndicator from './FetchingIndicator';

import ProjectsList from './views/ProjectsList';
import ProjectsEdit from './views/ProjectsEdit';

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
            case ViewTypes.PROJECT_LIST:
                AppBody =
                    <ProjectsList
                        projects={this.props.projects}
                        people={this.props.people}
                        companies={this.props.companies}
                        users={this.props.users}


                        selectedProject={this.props.appState.selectedProject}

                        setView={this.props.setView}
                        selectProject={this.props.selectProject}
                    />;
                break;
            case ViewTypes.PROJECT_DETAIL:
            case ViewTypes.PROJECT_EDIT:
                AppBody =
                    <ProjectsEdit
                        projects={this.props.projects}
                        people={this.props.people}
                        companies={this.props.companies}
                        users={this.props.users}

                        selectedProject={this.props.appState.selectedProject}
                        editedProject={this.props.appState.editedProject}

                        setView={this.props.setView}
                        selectProject={this.props.selectProject}
                        editProject={this.props.editProject}

                        updateProject={this.props.updateProject}
                        createProject={this.props.createProject}
                        removeProject={this.props.removeProject}
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