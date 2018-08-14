import React from 'react';

import AppHeader from './AppHeader';
import MessageBox from './MessageBox';
import FetchingIndicator from './FetchingIndicator';

import ProjectList from './projects/ProjectList';
import ProjectDetail from './projects/ProjectDetail';

import * as LayoutTypes from '../constants/LayoutTypes';

import {name, version}  from '../../package.json';


export default class AppLayout extends React.PureComponent {
    constructor(props) {
        super(props);
        this.closeMessage = this.closeMessage.bind(this);
    }

    render() {
        let AppBody = null;
        switch(this.props.appState.layout) {
            case LayoutTypes.PROJECTS:
                AppBody =
                    <ProjectList
                        projects={this.props.projects}
                        users={this.props.users}
                        edit={this.props.editProject}
                        create={this.props.createProject}
                    />;
                break;
            case LayoutTypes.PROJECT_DETAIL:
                AppBody =
                    <ProjectDetail
                        project={this.props.appState.project}
                        projects={this.props.projects}
                        users={this.props.users}
                        setLayout={this.props.setLayout}
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
                    layout = {this.props.appState.layout}
                    setLayout = {this.props.setLayout}
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