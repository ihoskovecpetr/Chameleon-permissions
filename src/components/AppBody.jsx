import React from 'react';

import * as ViewTypes from '../constants/ViewTypes';


import ProjectList from './projects/ProjectsLView';

export default class AppBody extends React.PureComponent {
    render() {
        switch(this.props.view) {
            case ViewTypes.PROJECTS:
                return <ProjectList

                />;
            case ViewTypes.ACTIVE_BID:
                return (
                    <div className={'app-body'}>
                        {'ACTIVE BIDS'}
                    </div>
                );
            case ViewTypes.PEOPLE:
                return (
                    <div className={'app-body'}>
                        {'PEOPLE'}
                    </div>
                );
            case ViewTypes.COMPANY:
                return (
                    <div className={'app-body'}>
                        {'COMPANIES'}
                    </div>
                );
            default: return null;
        }
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