import React from 'react';
import moment from 'moment';

import ProjectEditModal from './ProjectEditModal';

export default class AppBody extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            edited: null
        };

        this.edit = this.edit.bind(this);
        this.close = this.close.bind(this);
        this.save = this.save.bind(this);
    }

    render() {
        return (
            <div className={'app-body'}>
                {this.props.projects.map(project => <div onClick = {() => this.edit(project.id)} key={project.id}>{project.value}</div>)}
                <ProjectEditModal
                    project = {this.state.edited}
                    isOpen = {!!this.state.edited}
                    close = {this.close}
                    save = {this.save}
                />
            </div>
        )
    }

    edit(id) {
        const project = this.props.projects.find(project => project.id === id);
        if(project) {
            this.setState({edited: {...project}});
        }
    }

    close() {
        this.setState({edited: null});
    }

    save(project) {
        this.close();
        if(project) this.props.updateProject(project)
    }

    //() => this.props.updateProject({id: project.id, value: project.value + 1})
}