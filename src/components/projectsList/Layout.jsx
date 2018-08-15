import React from 'react';
import * as ViewTypes from '../../constants/ViewTypes';
import Toolbox from './Toolbox';
import Data from './Data';

export default class Layout extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };

        this.detail = this.detail.bind(this);
        this.create = this.create.bind(this);
        this.select = this.select.bind(this);
        this.edit = this.edit.bind(this);
    }

    render() {
        return (
            <div className={'app-body'}>
                <Toolbox
                    create = {this.create}
                    detail = {this.detail}
                    edit = {this.edit}
                    selectedProject={this.props.selectedProject}
                />
                <Data
                    projects={this.props.projects}
                    people={this.props.people}
                    companies={this.props.companies}
                    users={this.props.users}

                    selectedProject={this.props.selectedProject}

                    detail = {this.detail}
                    edit = {this.edit}
                    select = {this.select}
                />
            </div>
        )
    }

    select(project) {
        //if(this.props.selectedProject === project) this.props.selectProject(null);
        //else this.props.selectProject(project);
        this.props.selectProject(project);
    }

    create() {
        this.props.selectProject(null);
        this.props.setView(ViewTypes.PROJECT_DETAIL); //TODO EDIT_PROJECT
    }

    detail(project) {
        if(project) {
            this.props.selectProject(project);
            this.props.setView(ViewTypes.PROJECT_DETAIL); //TODO EDIT_PROJECT
        } else if(this.props.selectedProject) {
            this.props.setView(ViewTypes.PROJECT_DETAIL); //TODO DETAIL_PROJECT
        }
    }

    edit(project) {
        if(project) {
            this.props.selectProject(project);
            this.props.setView(ViewTypes.PROJECT_DETAIL); //TODO EDIT_PROJECT
        } else if(this.props.selectedProject) {
            this.props.setView(ViewTypes.PROJECT_DETAIL); //TODO DETAIL_PROJECT
        }
    }
}