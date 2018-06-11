import React from 'react';
import moment from 'moment';
import {name, version}  from '../../package.json';
import * as logger from 'loglevel';

import AppLayout from './AppLayout';

const DEFAULT_MESSAGE_TIMEOUT_MS = 0;
const SHOW_MESSAGE_ON_SUCCESS = true;

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
        this.addProject = this.addProject.bind(this);

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
                addProject = {this.addProject}
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

    fetchData() {
        this.setMessage(null);
        this.setState({isFetching: true});
        logger.debug('Fetching data');
        getMockData()
            .then(projects => {
                logger.debug(projects);
                this.setState({dataTimestamp: moment(), projects: projects});
                if(SHOW_MESSAGE_ON_SUCCESS) this.setMessage({type: 'info', text: 'Fetching done successfully!'}, DEFAULT_MESSAGE_TIMEOUT_MS)
            })
            .catch(reason => {
                logger.error(reason);
                this.setMessage({type: 'error', text: `Error occurred during fetching data from server: ${reason instanceof Error ? reason.message : JSON.stringify(reason)}`})
            })
            .then(() => this.setState({isFetching: false}))
    }

    //******************************************************************************************************************
    // PROJECT MANIPULATION
    //******************************************************************************************************************
    addProject(project) {
        logger.debug('ADD PROJECT: ' + JSON.stringify(project));
        this.setState({projects: [{id: this.state.projects.length, value: project.value}, ...this.state.projects]});
    }

    updateProject(project) {
        logger.debug('UPDATE PROJECT: ' + JSON.stringify(project));
        this.setState({projects: this.state.projects.map(item => item.id === project.id ? project : item)})
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


//**********************************************************************************************************************
// MOCK DATA
//**********************************************************************************************************************
function getMockData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            //reject(new Error('Fake fetching error.'));
            //return;
            const projects = new Array(Math.round(Math.random() * 1500)).fill(0);
            resolve(projects.map((item, index) => {
                return {
                    id: index,
                    value: Math.round(Math.random() * 1000)
                }
            }))
        }, 300)
    })
}