import React from 'react';

import * as LayoutTypes from '../../constants/LayoutTypes';

import ProjectDetailToolbox from './ProjectDetailToolbox';
import ProjectDetailData from './ProjectDetailData';

export default class ProjectDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            saveDisabled: true,
            project: null,
            validation: {}
        };

        this.close = this.close.bind(this);
        this.save = this.save.bind(this);
        this.remove = this.remove.bind(this);

        this.currentProject = this.currentProject.bind(this);
        this.setSaveDisabled = this.setSaveDisabled.bind(this);
        this.isCurrentProjectValid = this.isCurrentProjectValid.bind(this);
    }

    render() {
        return (
            <div className={'app-body'}>
                <ProjectDetailToolbox
                    close = {this.close}
                    save = {this.save}
                    remove = {this.state.remove}
                    saveDisabled = {this.state.saveDisabled}
                    create = {!this.props.project}
                    id = {this.props.project && this.props.projects[this.props.project] ? this.props.projects[this.props.project].projectId : null}
                    validation = {this.state.validation}
                />
                <ProjectDetailData
                    project = {this.props.project}
                    projects = {this.props.projects}
                    setSaveDisabled = {this.setSaveDisabled}
                    currentProject = {this.currentProject}
                    validation = {this.state.validation}
                />
            </div>
        )
    }

    close() {
        this.props.setLayout(LayoutTypes.PROJECTS)
    }

    save() {
        console.log('SAVE PROJECT')
        console.log(this.state.project)
        this.props.setLayout(LayoutTypes.PROJECTS)
    }

    remove(id) {

    }

    currentProject(project) {
        this.setState({project: project}, this.setSaveDisabled);
    }

    setSaveDisabled() {
        const disabled = this.state.project === null || Object.keys(this.state.project).length === 0 || !this.isCurrentProjectValid();
        if(this.state.saveDisabled !== disabled) this.setState({saveDisabled: disabled});
    }

    isCurrentProjectValid() { //TODO check name is unique, report notValidStatus
        const project = Object.assign({}, this.props.projects && this.props.projects[this.props.project] ? this.props.projects[this.props.project] : {}, this.state.project);
        const validation = {};
        if(!project.name || !project.name.trim()) validation['name'] = {field: 'Project name', status: 'Is empty'};
        if(!project.status) validation['name'] = {field: 'Project status', status: 'Is not set'};
        this.setState({validation: validation});
        return Object.keys(validation).length === 0;
    }
}