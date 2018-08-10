import React from 'react';

import DataHeader from '../DataHeader';
import DataBody from '../DataBody';
import AppToolbox from '../AppToolbox';
import ProjectEditModal from '../ProjectEditModal';

export default class ProjectsLayout extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            editedProject: sessionStorage.project ? JSON.parse(sessionStorage.project) : null
        };

        this.edit = this.edit.bind(this);
        this.close = this.close.bind(this);
        this.save = this.save.bind(this);
        this.create = this.create.bind(this);
        this.remove = this.remove.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.isNameUnique = this.isNameUnique.bind(this);
    }

    render() {
        return (
            <div className={'app-body'}>
                <AppToolbox
                    createProject = {this.create}
                    isOpen={true}
                />
                <DataHeader
                    layout={'all'}
                />
                <DataBody
                    projects = {this.props.projects}
                    edit = {this.edit}
                    layout = {'all'}
                    updateStatus = {this.updateStatus}
                />
                <ProjectEditModal
                    key = {this.state.editedProject && this.state.editedProject._id ? this.state.editedProject._id : +new Date()}
                    project = {null}
                    close = {this.close}
                    save = {this.save}
                    remove = {this.remove}
                    isNameUnique = {this.isNameUnique}
                />
            </div>
        )
    }

    create() {
        this.setState({editedProject: {}});
        sessionStorage.project = JSON.stringify({});
        sessionStorage.removeItem('projectEdit');
    }

    edit(project) {
        this.setState({editedProject: project});
        sessionStorage.project = JSON.stringify(project);
        sessionStorage.removeItem('projectEdit');
    }

    close() {
        this.setState({editedProject: null});
        sessionStorage.removeItem('project');
        sessionStorage.removeItem('projectEdit');
    }

    save(project) {
        this.close();
        if(project) {
            if(project._id) {
                this.props.updateProject(project._id, project);
            } else {
                delete project._id; //remove null
                this.props.createProject(project);
            }
        }
    }

    updateStatus(id, status) {
        const project = this.props.projects.find(project => project._id === id);
        if(project) {
            const newStatus = project.status === 'CREATED' ? 'CHANGED' : 'CREATED';
            this.props.updateProject(id, {status: newStatus});
        }
    }

    remove(id) {
        this.close();
        if(id) {
            console.log(`Remove project id: ${id}`);
            this.props.removeProject(id);
        }
    }

    isNameUnique(id, name) {
        if(typeof name === 'string') {
            const project = this.props.projects.find(project => project.name.trim() === name.trim());
            return !project || project._id === id;
        }
        return false;
    }
}