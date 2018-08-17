import React from 'react';

import AppHeader from './AppHeader';
import MessageBox from './MessageBox';
import FetchingIndicator from './FetchingIndicator';

import ProjectsList from './views/ProjectsList';
import ProjectEdit from './views/ProjectEdit';
import ProjectDetail from './views/ProjectDetail';

import * as ViewTypes from '../constants/ViewTypes';

import {name, version}  from '../../package.json';


export default class AppLayout extends React.PureComponent {

    render() {
        let AppBody = null;
        switch(this.props.appState.view) {
            case ViewTypes.PROJECTS_LIST:
                AppBody =
                    <ProjectsList
                        projects={this.props.projects}
                        people={this.props.people}
                        companies={this.props.companies}
                        users={this.props.users}
                        user={this.props.user}

                        selectedProject={this.props.appState.selectedProject}
                        filter = {this.props.appState.projectsFilter}
                        search = {this.props.appState.projectsSearch}
                        sort = {this.props.appState.projectsSort}

                        setView={this.props.setView}
                        selectProject={this.props.selectProject}
                        setFilter={this.props.setProjectsFilter}
                        setSearch={this.props.setProjectsSerach}
                        setSort={this.props.setProjectsSort}
                    />;
                break;
            case ViewTypes.PROJECT_DETAIL:
                AppBody =
                    <ProjectDetail
                        projects={this.props.projects}
                        people={this.props.people}
                        companies={this.props.companies}
                        users={this.props.users}

                        selectedProject={this.props.appState.selectedProject}
                        editedProject={this.props.appState.editedProject}

                        setView={this.props.setView}
                        selectProject={this.props.selectProject}
                        editProject={this.props.editProject}
                        removeProject={this.props.removeProject}
                    />;
                break;
            case ViewTypes.PROJECT_EDIT:
                AppBody =
                    <ProjectEdit
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
                <MessageBox message = {this.props.appState.message} setMessage = {this.props.setMessage}/>
                {AppBody}
                <FetchingIndicator open={this.props.appState.fetching}/>
            </div>
        )
    }

}