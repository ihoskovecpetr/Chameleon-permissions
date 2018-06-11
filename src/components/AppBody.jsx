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
    }

    render() {
        return (
            <div className={'app-body'}>
                <AppToolbox
                    isOpen = {true}
                    addProject = {this.props.addProject}
                />
                <DataHeader/>
                <DataBody
                    projects = {this.props.projects}
                    edit = {this.edit}
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
        if(project) this.props.updateProject(project)
    }
}