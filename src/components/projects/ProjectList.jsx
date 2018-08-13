import React from 'react';

import ProjectListToolbox from './ProjectListToolbox';
import ProjectListData from './ProjectListData';

export default class ProjectList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };

        this.edit = this.edit.bind(this);
        this.create = this.create.bind(this);
    }

    render() {
        return (
            <div className={'app-body'}>
                <ProjectListToolbox
                    create = {this.create}
                />
                <ProjectListData
                    projects = {this.props.projects}
                    edit = {this.edit}
                />
            </div>
        )
    }

    edit(project) {
        this.props.edit(project);
    }

    create() {
        this.props.create();
    }
}