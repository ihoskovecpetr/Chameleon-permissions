import React from 'react';
import moment from 'moment';
import {name, version}  from '../../package.json';

import AppLayout from './AppLayout';

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

        this.appName = `${name.charAt(0).toUpperCase()}${name.substr(1)}`;
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

    refresh() {
        console.log('REFRESH DATA');
        this.fetchData();
    }

    fetchData() {
        this.setState({isFetching: true, error: null});
        console.log('FETCH DATA');
        getMockData()
            .then(projects => {
                this.setState({dataTimestamp: moment(), projects: projects});
            })
            .catch(reason => this.setMessage({type: 'info', text: 'Fetching error occurred!'}))
            .then(() => this.setState({isFetching: false}))
    }

    logout() {
        //TODO delete JWT and redirect to home/login
        console.log(`LOGOUT ${this.props.user.name}`);
        this.setState({projects: []});
    }

    home() {
        //TODO redirect to home/
        console.log('HOME');
        this.setState({projects: []});
    }

    addProject(project) {
        console.log('ADD PROJECT: ' + JSON.stringify(project));
        this.setState({projects: [{id: this.state.projects.length, value: project.value}, ...this.state.projects]});
    }

    updateProject(project) {
        console.log('UPDATE PROJECT: ' + JSON.stringify(project));
        this.setState({projects: this.state.projects.map(item => item.id === project.id ? project : item)})
    }

    setMessage(message) {
        this.setState({message: message});
    }
}

function getMockData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject();
            return
            const projects = new Array(Math.round(Math.random() * 1000)).fill(0);
            resolve(projects.map((item, index) => {
                return {
                    id: index,
                    value: Math.round(Math.random() * 1000)
                }
            }))
        }, 100)
    })
}