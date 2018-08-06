import React from 'react';

import DataHeader from './DataHeader';
import DataBody from './DataBody';
import AppToolbox from './AppToolbox';
import ProjectEditModal from './ProjectEditModal';

export default class AppBody extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            editedProject: null
        };

        this.edit = this.edit.bind(this);
        this.close = this.close.bind(this);
        this.save = this.save.bind(this);
        this.create = this.create.bind(this);
    }

    render() {
        return (
            <div className={'app-body'}>
                <AppToolbox
                    isOpen = {true}
                    createProject = {this.create}
                />
                <DataHeader
                    layout={'full'}
                />
                <DataBody
                    projects = {this.props.projects}
                    edit = {this.edit}
                    layout={'full'}
                />
                <ProjectEditModal
                    project = {this.state.editedProject}
                    isOpen = {!!this.state.editedProject}
                    close = {this.close}
                    save = {this.save}
                />
            </div>
        )
    }

    edit(id) {
        const project = this.props.projects.find(project => project.id === id);
        if(project) {
            this.setState({editedProject: {...project}});
        }
    }

    close() {
        this.setState({editedProject: null});
    }

    save(project) {
        this.close();
        if(project) {
            if(project.projectId) {
                this.props.updateProject(project);
            } else {
                this.props.createProject(project);
            }
        }
    }

    create() {
        this.setState({editedProject: {}})
    }
}