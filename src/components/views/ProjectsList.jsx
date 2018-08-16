import React, {Fragment} from 'react';
import { Table } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import * as ViewTypes from '../../constants/ViewTypes';
import * as ProjectStatus from '../../constants/ProjectStatus';
import * as FilterTypes from '../../constants/FilterTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import memoize from 'memoize-one';

const ICON_SORT = 'arrows-alt-v'; //sort
const ICON_SORT_UP = 'long-arrow-alt-up'; //sort-up
const ICON_SORT_DOWN = 'long-arrow-alt-down'; //sort-down

export default class ProjectsList extends React.PureComponent {

    componentDidUpdate(prevProps) { //remove selected project if doesn't exist in filtered set
        if(this.props.selectedProject && (this.props.filter !== prevProps.filter || this.props.search !== prevProps.search ) && this.filterList(this.props.projects, this.props.filter, this.props.sort, this.props.search).indexOf(this.props.selectedProject) < 0) this.props.selectProject(null);
    }

    render() {
        console.log('RENDER PROJECTS LIST');
        const {selectedProject, projects, users, filter, sort, search} = this.props;

        const filteredProjectIds = this.filterList(projects, filter, sort, search);
        const projectIds = sort ? this.sortList(projects, filteredProjectIds, sort) : filteredProjectIds;

        return (
            <div className={'app-body'}>
                <div className={'app-toolbox'}>
                    <div className={'toolbox-group'}>
                        <FontAwesomeIcon onClick={this.create} className={'tool-box-icon'} icon={'plus-circle'}/>
                        {this.props.selectedProject ? <Fragment>
                            <div onClick={this.detail} style={{marginLeft: '1rem', cursor: 'pointer'}}>{'Detail'}</div>
                            <div onClick={this.edit} style={{marginLeft: '1rem', cursor: 'pointer'}}>{'Edit'}</div>
                        </Fragment> : null}
                        <div onClick={this.activeOnly} style={{marginLeft: '1rem', cursor: 'pointer'}}>{'Active Only'}</div>
                    </div>
                    <div className={'toolbox-group clear'}/>
                </div>
                <Fragment>
                    <Table className={'table-header'} borderless={true}>
                        <thead>
                        <tr>
                            <th className={'projects-name'}><FontAwesomeIcon onClick={() => this.handleSort('name')} className={`sort-icon${sort.indexOf('name') < 0 ? ' not-set' : ''}`} icon={sort === 'name' ? ICON_SORT_UP : sort === '-name' ? ICON_SORT_DOWN : ICON_SORT}/><span className={'sortable-column'} onClick={() => this.handleSort('name')}>{'Project Name'}</span></th>
                            <th className={'projects-manager'}><FontAwesomeIcon onClick={() => this.handleSort('manager')} className={`sort-icon${sort.indexOf('manager') < 0 ? ' not-set' : ''}`} icon={sort === 'manager' ? ICON_SORT_UP : sort === '-manager' ? ICON_SORT_DOWN : ICON_SORT}/><span className={'sortable-column'} onClick={() => this.handleSort('manager')}>{'Project Manager'}</span></th>
                            <th className={'projects-status'}><FontAwesomeIcon onClick={() => this.handleSort('status')} className={`sort-icon${sort.indexOf('status') < 0 ? ' not-set' : ''}`} icon={sort === 'status' ? ICON_SORT_UP : sort === '-status' ? ICON_SORT_DOWN : ICON_SORT}/><span className={'sortable-column'} onClick={() => this.handleSort('status')}>{'Status'}</span></th>
                        </tr>
                        </thead>
                    </Table>
                    <Scrollbars autoHide={true} autoHideTimeout={800} autoHideDuration={200}>
                        <Table className={'table-body'}>
                            <tbody style={{borderBottom: '1px solid #dee2e6'}}>
                            {projectIds.map(projectId => <tr className={selectedProject === projectId ? 'selected' : ''} onClick = {() => this.select(projectId)} onDoubleClick={event => event.altKey ? this.edit(projectId) : this.detail(projectId)} key={projectId}>
                                <td className={'projects-name'}>{this.getComputedField('name', projects[projectId], users)}</td>
                                <td className={'projects-manager'}>{this.getComputedField('manager', projects[projectId], users)}</td>
                                <td className={'projects-status'}>{this.getComputedField('status', projects[projectId], users)}</td>
                            </tr>)}
                            </tbody>
                        </Table>
                    </Scrollbars>
                </Fragment>
            </div>
        )
    }
    // ***************************************************
    // FILTER AND SORT SOURCE LIST - MEMOIZE
    // ***************************************************
    filterList = memoize((object, filter, sort, search) => {
        const ids = Object.keys(object).map(id => id).filter(id => {
            const project = object[id];
            //filter
            for(const f of filter) {
                switch (f) {
                    case FilterTypes.ACTIVE_PROJECTS_FILTER:
                        if(!ProjectStatus[project.status] || !ProjectStatus[project.status].active) return false;
                        break;

                }
            }
            //search

            return true;
        });

        if(!sort) ids.sort((a, b) => object[b].created.localeCompare(object[a].created)); //default sort - latest created first
        return ids;
    });

    sortList = memoize((object, ids, sort) => ids.sort((a, b) => {
        const down = sort.indexOf('-') === 0;
        let field = down ? sort.substr(1) : sort;
        if(field === 'status') field = 'status-order';
        let dataA = down ? this.getComputedField(field, object[a]) : this.getComputedField(field, object[b]);
        let dataB = down ? this.getComputedField(field, object[b]) : this.getComputedField(field, object[a]);
        if(typeof dataA === 'undefined' && typeof dataB === 'undefined') return 0;
        if(typeof dataA === 'undefined') return 1;
        if(typeof dataB === 'undefined') return 0;
        if(dataA === null) dataA = '';
        if(dataB === null) dataB = '';
        return dataA.localeCompare(dataB);
    }));

    // ***************************************************
    // ROUTING
    // ***************************************************
    select = (id) => {
        this.props.selectProject(id);
    };

    create = () => {
        this.props.selectProject(null);
        this.props.setView(ViewTypes.PROJECT_EDIT);
    };

    detail = (id) => {
        if(id) {
            this.props.selectProject(id);
            this.props.setView(ViewTypes.PROJECT_DETAIL);
        } else if(this.props.selectedProject) {
            this.props.setView(ViewTypes.PROJECT_DETAIL);
        }
    };

    edit = (id) => {
        if(id) {
            this.props.selectProject(id);
            this.props.setView(ViewTypes.PROJECT_EDIT);
        } else if(this.props.selectedProject) {
            this.props.setView(ViewTypes.PROJECT_EDIT);
        }
    };

    activeOnly = () => {
        if(this.props.filter.indexOf(FilterTypes.ACTIVE_PROJECTS_FILTER) >= 0) this.props.setFilter(FilterTypes.ACTIVE_PROJECTS_FILTER, true);
        else this.props.setFilter(FilterTypes.ACTIVE_PROJECTS_FILTER, false);
    };

    // ***************************************************
    // SORT HANDLER
    // ***************************************************
    handleSort = (sort) => {
        let result = '';
        if(this.props.sort.indexOf(sort) < 0) result = `-${sort}`;
        else if(this.props.sort === `-${sort}`) result = sort;
        this.props.setSort(result);
    };

    // ***************************************************
    // COMPUTE FIELD
    // ***************************************************
    getComputedField(field, project) {
        switch(field) {
            case 'manager':
                if(!project || !project.team) return '---';
                const manager = project.team.find(person => this.props.users[person.id] && this.props.users[person.id].role.indexOf('manager') <= 0);
                if(manager) return this.props.users[manager.id].name;
                else return '---';

            case 'status-order':
                return ProjectStatus[project['status']] && ProjectStatus[project['status']].sortOrder ? ProjectStatus[project['status']].sortOrder.toString() : '0';

            case 'status':
                return ProjectStatus[project['status']].label;

            default: return project && project[field] ? project[field] : '---';
        }
    }
}