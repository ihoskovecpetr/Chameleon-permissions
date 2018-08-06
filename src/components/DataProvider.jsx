import React from 'react';
import moment from 'moment';
import {name, version}  from '../../package.json';
import * as logger from 'loglevel';

import {getProjects, createProject, updateProject} from '../lib/serverData';

import AppLayout from './AppLayout';

const DEFAULT_MESSAGE_TIMEOUT_MS = 0;
const SHOW_MESSAGE_ON_SUCCESS = false;

export default class DataProvider extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataTimestamp: null,
            isFetching: false,
            message: null,

            projects: []
        };

        this.refresh = this.refresh.bind(this);
        this.logout = this.logout.bind(this);
        this.home = this.home.bind(this);

        this.updateProject = this.updateProject.bind(this);
        this.createProject = this.createProject.bind(this);

        this.fetchData = this.fetchData.bind(this);
        this.setMessage = this.setMessage.bind(this);

        this.appName = name.toUpperCase();//`${name.charAt(0).toUpperCase()}${name.substr(1)}`;
        this.messageTimer = null;
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        return (
            <AppLayout
                appName = {this.appName}
                appVersion = {version}
                user = {this.props.user}
                isFetching = {this.state.isFetching}
                message = {this.state.message}

                projects = {this.state.projects}
                dataTimestamp = {this.state.dataTimestamp}

                refresh = {this.refresh}
                logout = {this.logout}
                home = {this.home}
                setMessage = {this.setMessage}

                updateProject = {this.updateProject}
                createProject = {this.createProject}
            />
        )
    }

    //******************************************************************************************************************
    // SERVER DATA
    //******************************************************************************************************************
    refresh() {
        logger.debug('Refreshing data');
        this.fetchData();
    }

    async fetchData() {
        this.setMessage(null);
        this.setState({isFetching: true});
        logger.debug('Fetching data');
        try {
            const projects = await getProjects();
            logger.debug(projects);
            this.setState({dataTimestamp: moment(), projects: projects});
            if (SHOW_MESSAGE_ON_SUCCESS) this.setMessage({
                type: 'info',
                text: 'Fetching done successfully!'
            }, DEFAULT_MESSAGE_TIMEOUT_MS)
        } catch (e) {
            logger.error(e);
            this.setMessage({type: 'error', text: `Error occurred during fetching data from the server: ${e instanceof Error ? e.message : JSON.stringify(e)}`})
        }
        this.setState({isFetching: false});
    }

    //******************************************************************************************************************
    // PROJECT MANIPULATION
    //******************************************************************************************************************
    async createProject(projectData) {
        this.setMessage(null);
        this.setState({isFetching: true});
        logger.debug('Create project: ' + JSON.stringify(projectData));
        try {
            const project = await createProject(projectData);
            this.setState({projects: [...this.state.projects, project]});
        } catch (e) {
            logger.error(e);
            this.setMessage({type: 'error', text: `Create Project Error: ${e instanceof Error ? e.message : JSON.stringify(e)}`})
        }
        this.setState({isFetching: false});
    }

    async updateProject(projectData) {
        this.setMessage(null);
        this.setState({isFetching: true});
        logger.debug('Update project: ' + JSON.stringify(projectData));
        try {
            const project = await updateProject(projectData);
            const newProjects = [...this.props.projects];
            const index = this.props.projects.findIndex(project => projectData._id == project._id);
            if(index >= 0) newProjects[index] = project;
            else newProjects.push(project);
            this.setState({projects: newProjects});
        } catch (e) {
            logger.error(e);
            this.setMessage({type: 'error', text: `Update Project Error: ${e instanceof Error ? e.message : JSON.stringify(e)}`})
        }
        this.setState({isFetching: false});
    }

    //******************************************************************************************************************
    // APP NAVIGATION
    //******************************************************************************************************************
    logout() {
        //TODO delete JWT and redirect to home/login
        logger.debug(`LOGOUT ${this.props.user.name}`);
        this.setState({projects: []});
    }

    home() {
        //TODO redirect to home/
        logger.debug('HOME');
        this.setState({projects: []});
    }

    //******************************************************************************************************************
    // HELPERS
    //******************************************************************************************************************
    setMessage(message, timeout) {
        if(this.messageTimer) clearTimeout(this.messageTimer);
        this.messageTimer = null;
        this.setState({message: message});
        if(timeout && message && message.type === 'info') this.messageTimer = setTimeout(() => {this.setState({message: null})}, timeout);
    }
}