import React from 'react';

import AppHeader from './AppHeader';
import MessageBox from './MessageBox';
import FetchingIndicator from './FetchingIndicator';

import ProjectsList from './views/ProjectsList';
import ProjectEdit from './views/ProjectEdit';
import ProjectDetail from './views/ProjectDetail';

import Box from './views/Box';

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

                        addToBox={this.props.addToBox}
                    />;
                break;
            case ViewTypes.PROJECT_DETAIL:
            case ViewTypes.BOX_PROJECT_DETAIL:
            case ViewTypes.PROJECT_DETAIL_NEXT:
                AppBody =
                    <ProjectDetail
                        projects={this.props.projects}
                        people={this.props.people}
                        companies={this.props.companies}
                        users={this.props.users}
                        user={this.props.user}

                        selectedProject={this.props.appState.view === ViewTypes.PROJECT_DETAIL ? this.props.appState.selectedProject : this.props.appState.view === ViewTypes.PROJECT_DETAIL_NEXT ? this.props.appState.nextDetailId : this.props.appState.view === ViewTypes.BOX_PROJECT_DETAIL ? this.props.appState.selectedBoxItem : null}

                        returnToPreviousView={this.props.returnToPreviousView}

                        selectProjectNext={this.props.selectProjectNext}
                        //TODO person, company

                        editProject={this.props.appState.view === ViewTypes.PROJECT_DETAIL ? this.props.editProject : undefined}
                        removeProject={this.props.appState.view === ViewTypes.PROJECT_DETAIL ? this.props.removeProject : undefined}
                    />;
                break;
            case ViewTypes.PROJECT_EDIT:
                AppBody =
                    <ProjectEdit
                        projects={this.props.projects}
                        people={this.props.people}
                        companies={this.props.companies}
                        users={this.props.users}
                        user={this.props.user}

                        selectedProject={this.props.appState.selectedProject}
                        editedData={this.props.appState.editedData}

                        returnToPreviousView={this.props.returnToPreviousView}
                        editItem={this.props.editItem}

                        updateProject={this.props.updateProject}
                        createProject={this.props.createProject}
                        removeProject={this.props.removeProject}
                    />;
                break;
            case ViewTypes.BOX:
                AppBody =
                    <Box
                        box = {this.props.appState.box}

                        projects={this.props.projects}
                        people={this.props.people}
                        companies={this.props.companies}

                        setView={this.props.setView}
                        selectBoxItem={this.props.selectBoxItem}

                        removeFromBox={this.props.removeFromBox}
                        emptyBox={this.props.emptyBox}

                    />
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
                    box = {this.props.appState.box}
                    switchesEnabled = {(this.props.appState.view !== ViewTypes.PROJECT_EDIT && this.props.appState.view !== ViewTypes.PERSON_EDIT && this.props.appState.view !== ViewTypes.COMPANY_EDIT) || Object.keys(this.props.appState.editedData).length === 0}
                />
                <MessageBox message = {this.props.appState.message} setMessage = {this.props.setMessage}/>
                {AppBody}
                <FetchingIndicator open={this.props.appState.fetching}/>
            </div>
        )
    }

}