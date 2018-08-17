import React, {Fragment} from 'react';
import { Table } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import * as ViewTypes from '../../constants/ViewTypes';
import * as ProjectStatus from '../../constants/ProjectStatus';
import * as FilterTypes from '../../constants/FilterTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input } from 'reactstrap';

import memoize from 'memoize-one';

const ICON_SORT = 'arrows-alt-v'; //sort
const ICON_SORT_UP = 'long-arrow-alt-up'; //sort-up
const ICON_SORT_DOWN = 'long-arrow-alt-down'; //sort-down

const ICON_CHECKBOX_CHECKED = ['far','check-circle'];
const ICON_CHECKBOX_UNCHECKED = ['far', 'circle'];

const ICON_SEARCH = 'search';
const ICON_CLEAR = 'times';

export default class ProjectsList extends React.PureComponent {

    componentDidUpdate(prevProps) { //remove selected project if doesn't exist in filtered set
        if(this.props.selectedProject && (this.props.filter !== prevProps.filter || this.props.search !== prevProps.search ) && this.searchList(this.props.projects, this.filterList(this.props.projects, this.props.filter), this.props.search).indexOf(this.props.selectedProject) < 0) this.props.selectProject(null);
    }

    render() {
        console.log('RENDER PROJECTS LIST');
        const {selectedProject, projects, users, filter, sort, search} = this.props;

        const filteredProjectIds = this.filterList(projects, filter);
        const searchedProjectIds = this.searchList(projects, filteredProjectIds, search);
        const sortedProjectIds = this.sortList(projects, searchedProjectIds, sort);

        const userFilter = filter.indexOf(FilterTypes.USER_FILTER) >= 0;
        const activeFilter = filter.indexOf(FilterTypes.ACTIVE_PROJECTS_FILTER) >= 0 || filter.indexOf(FilterTypes.NON_ACTIVE_PROJECTS_FILTER) >= 0;
        const activeFilterReversed = filter.indexOf(FilterTypes.NON_ACTIVE_PROJECTS_FILTER) >= 0;
        const awardedFilter = filter.indexOf(FilterTypes.AWARDED_PROJECTS_FILTER) >= 0 || filter.indexOf(FilterTypes.NOT_AWARDED_PROJECTS_FILTER) >= 0;
        const awardFilterReversed = filter.indexOf(FilterTypes.NOT_AWARDED_PROJECTS_FILTER) >= 0;

        return (
            <div className={'app-body'}>
                <div className={'app-toolbox'}>
                    <div className={'inner-container'}>
                        <div className={'toolbox-group'}>
                            <div onClick={this.create} className={'tool-box-button green'}>{'New'}</div>
                            <div onClick={this.props.selectedProject ? this.detail : undefined} className={`tool-box-button${this.props.selectedProject ? '' : ' disabled'}`}>{'Show'}</div>
                            <div onClick={this.props.selectedProject ? this.edit : undefined} className={`tool-box-button${this.props.selectedProject ? '' : ' disabled'}`}>{'Edit'}</div>
                            <div onClick={this.props.selectedProject ? this.remove : undefined} className={`tool-box-button red${this.props.selectedProject ? '' : ' disabled'}`}>{'Remove'}</div>
                        </div>
                    </div>
                    <div className={'inner-container'}>
                        <div className={'toolbox-group'}>
                            <div className={'tool-box-search-container'}>
                                <div className={'icon search'}><FontAwesomeIcon icon={ICON_SEARCH}/></div>
                                <Input value={search} onChange={this.searchInputHandler} className={`input-search`}/>
                                <div className={'icon clear'} onClick={this.clearSerachInputHanler}><FontAwesomeIcon icon={ICON_CLEAR}/></div>
                            </div>
                        </div>
                        <div className={'toolbox-group'}>
                            <div onClick={this.userFilterHandler} className={`tool-box-button-switch`}><FontAwesomeIcon className={'check'} icon={userFilter ? ICON_CHECKBOX_CHECKED : ICON_CHECKBOX_UNCHECKED}/><span className={`text`}>{'My'}</span></div>
                            <div className={`tool-box-button-switch${activeFilterReversed ? ' reversed' : ''}`}><FontAwesomeIcon onClick={this.activeFilterHandler} className={'check'} icon={activeFilter ? ICON_CHECKBOX_CHECKED : ICON_CHECKBOX_UNCHECKED}/><span onClick={this.activeFilterReverseHandler} className={`text${activeFilterReversed ? ' reversed' : ''}`}>{'Active'}</span></div>
                            <div className={`tool-box-button-switch${awardFilterReversed ? ' reversed ' : ''}`}><FontAwesomeIcon onClick={this.awardedFilterHandler} className={'check'} icon={awardedFilter ? ICON_CHECKBOX_CHECKED : ICON_CHECKBOX_UNCHECKED}/><span onClick={this.awardedFilterReverseHandler} className={`text${awardFilterReversed ? ' reversed' : ''}`}>{'Awarded'}</span></div>
                        </div>
                    </div>
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
                            {sortedProjectIds.map(projectId => <tr className={selectedProject === projectId ? 'selected' : ''} onClick = {() => this.select(projectId)} onDoubleClick={event => event.altKey ? this.edit(projectId) : this.detail(projectId)} key={projectId}>
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
    filterList = memoize((object, filter) => {
        console.log('FILTER')
        return Object.keys(object).map(id => id).filter(id => {
            const project = object[id];
            //filter
            for(const f of filter) {
                switch (f) {
                    case FilterTypes.AWARDED_PROJECTS_FILTER:
                        if(!ProjectStatus[project.status] || !ProjectStatus[project.status].awarded) return false;
                        break;

                    case FilterTypes.NOT_AWARDED_PROJECTS_FILTER:
                        if(ProjectStatus[project.status] && ProjectStatus[project.status].awarded) return false;
                        break;

                    case FilterTypes.ACTIVE_PROJECTS_FILTER:
                        if(!ProjectStatus[project.status] || !ProjectStatus[project.status].active) return false;
                        break;

                    case FilterTypes.NON_ACTIVE_PROJECTS_FILTER:
                        if(ProjectStatus[project.status] && ProjectStatus[project.status].active) return false;
                        break;

                    case FilterTypes.USER_FILTER:
                        if(project.team && Array.isArray(project.team) && project.team.length > 0) {
                            for(const teamMember of project.team) {
                                if(teamMember.id === this.props.user.id) return true;
                            }
                        }
                        return false;

                }
            }
            return true;
        });
    });

    sortList = memoize((object, ids, sort) => {
        console.log('SORT')
        if(!sort) {
            return ids.sort((a, b) => object[b].created.localeCompare(object[a].created)); //default sort - latest created first
        } else {
            return ids.sort((a, b) => {
                const down = sort.indexOf('-') === 0;
                let field = down ? sort.substr(1) : sort;
                if (field === 'status') field = 'status-order';
                let dataA = down ? this.getComputedField(field, object[a]) : this.getComputedField(field, object[b]);
                let dataB = down ? this.getComputedField(field, object[b]) : this.getComputedField(field, object[a]);
                if (typeof dataA === 'undefined' && typeof dataB === 'undefined') return 0;
                if (typeof dataA === 'undefined') return 1;
                if (typeof dataB === 'undefined') return 0;
                if (dataA === null) dataA = '';
                if (dataB === null) dataB = '';
                return dataA.localeCompare(dataB);
            })
        }
    });

    searchList = memoize((object, ids, search) => {
        console.log('SEARCH')
        if(search === '2') {
            const a = [...ids];
            a.splice(2,1); return a;}
        else return ids
    });

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

    activeFilterHandler = () => {
        if(this.props.filter.indexOf(FilterTypes.ACTIVE_PROJECTS_FILTER) >= 0) this.props.setFilter(FilterTypes.ACTIVE_PROJECTS_FILTER, false);
        else if(this.props.filter.indexOf(FilterTypes.NON_ACTIVE_PROJECTS_FILTER) >= 0) this.props.setFilter(FilterTypes.NON_ACTIVE_PROJECTS_FILTER, false);
        else this.props.setFilter(FilterTypes.ACTIVE_PROJECTS_FILTER, true);
    };

    activeFilterReverseHandler = () => {
        if(this.props.filter.indexOf(FilterTypes.ACTIVE_PROJECTS_FILTER) >= 0) {
            this.props.setFilter(FilterTypes.ACTIVE_PROJECTS_FILTER, false);
            this.props.setFilter(FilterTypes.NON_ACTIVE_PROJECTS_FILTER, true);
        }
        else if(this.props.filter.indexOf(FilterTypes.NON_ACTIVE_PROJECTS_FILTER) >= 0) {
            this.props.setFilter(FilterTypes.NON_ACTIVE_PROJECTS_FILTER, false);
            this.props.setFilter(FilterTypes.ACTIVE_PROJECTS_FILTER, true);
        }
        else this.props.setFilter(FilterTypes.NON_ACTIVE_PROJECTS_FILTER, true);
    };

    awardedFilterHandler = () => {
        if(this.props.filter.indexOf(FilterTypes.AWARDED_PROJECTS_FILTER) >= 0) this.props.setFilter(FilterTypes.AWARDED_PROJECTS_FILTER, false);
        else if(this.props.filter.indexOf(FilterTypes.NOT_AWARDED_PROJECTS_FILTER) >= 0) this.props.setFilter(FilterTypes.NOT_AWARDED_PROJECTS_FILTER, false);
        else this.props.setFilter(FilterTypes.AWARDED_PROJECTS_FILTER, true);
    };

    awardedFilterReverseHandler = () => {
        if(this.props.filter.indexOf(FilterTypes.AWARDED_PROJECTS_FILTER) >= 0) {
            this.props.setFilter(FilterTypes.AWARDED_PROJECTS_FILTER, false);
            this.props.setFilter(FilterTypes.NOT_AWARDED_PROJECTS_FILTER, true);
        }
        else if(this.props.filter.indexOf(FilterTypes.NOT_AWARDED_PROJECTS_FILTER) >= 0) {
            this.props.setFilter(FilterTypes.NOT_AWARDED_PROJECTS_FILTER, false);
            this.props.setFilter(FilterTypes.AWARDED_PROJECTS_FILTER, true);
        }
        else this.props.setFilter(FilterTypes.NOT_AWARDED_PROJECTS_FILTER, true);
    };

    userFilterHandler = () => {
        if(this.props.filter.indexOf(FilterTypes.USER_FILTER) >= 0) this.props.setFilter(FilterTypes.USER_FILTER, false);
        else this.props.setFilter(FilterTypes.USER_FILTER, true);
    };

    searchInputHandler = (event) => {
       this.props.setSearch(event.target.value);
    };

    clearSerachInputHanler = () => {
       this.props.setSearch('');
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
                return ProjectStatus[project['status']] ? ProjectStatus[project['status']].label : '---';

            default: return project && project[field] ? project[field] : '---';
        }
    }
}