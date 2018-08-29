import React, {Fragment} from 'react';
import { Table } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import * as ProjectStatus from '../../constants/ProjectStatus';
import * as FilterTypes from '../../constants/FilterTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input } from 'reactstrap';
import Fuse from 'fuse.js';
import moment from 'moment';
import Select from 'react-select';

import memoize from 'memoize-one';

const ICON_SORT = 'arrows-alt-v'; //sort
const ICON_SORT_UP = 'long-arrow-alt-up'; //sort-up
const ICON_SORT_DOWN = 'long-arrow-alt-down'; //sort-down

const ICON_CHECKBOX_CHECKED = ['far','check-circle'];
const ICON_CHECKBOX_UNCHECKED = ['far', 'circle'];

const ICON_SEARCH = 'search';
const ICON_CLEAR = 'times';

const ICON_BOX = 'box-open';

import {columnDef, columnDefBids} from '../../constants/TableColumnsDef';
const statusOptions = Object.keys(ProjectStatus).map(key => {return {value: key, label: ProjectStatus[key].label}});

export default class ProjectsList extends React.PureComponent {

    componentDidUpdate(prevProps) { //remove selected project if doesn't exist in filtered set
        if(this.props.selectedProject && (this.props.filter !== prevProps.filter || this.props.search !== prevProps.search ) && this.searchList(this.props.projects, this.filterList(this.props.projects, this.props.filter), this.props.search).indexOf(this.props.selectedProject) < 0) this.props.selectProject(null);
    }

    render() {
        //console.log('RENDER PROJECTS LIST');
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
                    <div className={'inner-container space'}>
                        <div className={'toolbox-group'}>
                            <div onClick={this.addProject} className={'tool-box-button green'}>{'New'}</div>
                            <div onClick={this.props.selectedProject ? () => this.showProject() : undefined} className={`tool-box-button${this.props.selectedProject ? '' : ' disabled'}`}>{'Show'}</div>
                            <div onClick={this.props.selectedProject ? () => this.editProject() : undefined} className={`tool-box-button${this.props.selectedProject ? '' : ' disabled'}`}>{'Edit'}</div>
                            <div onClick={this.props.selectedProject ? this.addToBox : undefined} className={`tool-box-button icon box blue${this.props.selectedProject ? '' : ' disabled'}`}><FontAwesomeIcon icon={ICON_BOX}/></div>
                        </div>
                    </div>
                    <div className={'inner-container flex'}>
                        <div className={'toolbox-group right-auto'}>
                            <div className={'tool-box-search-container'}>
                                <div className={'icon search'}><FontAwesomeIcon icon={ICON_SEARCH}/></div>
                                <Input value={search} onChange={this.searchInputHandler} className={`input-search`}/>
                                <div className={'icon clear'} onClick={this.clearSerachInputHanler}><FontAwesomeIcon icon={ICON_CLEAR}/></div>
                            </div>
                        </div>
                        <div className={'toolbox-group'}>
                            <div onClick={this.userFilterHandler} className={`tool-box-button-switch`}><FontAwesomeIcon className={'check'} icon={userFilter ? ICON_CHECKBOX_CHECKED : ICON_CHECKBOX_UNCHECKED}/><span className={`text`}>{'My'}</span></div>

                            {this.props.activeBid ? null :
                                <Fragment>
                                    <div className={`tool-box-button-switch${activeFilterReversed ? ' reversed' : ''}`}><FontAwesomeIcon onClick={this.activeFilterHandler} className={'check'} icon={activeFilter ? ICON_CHECKBOX_CHECKED : ICON_CHECKBOX_UNCHECKED}/><span onClick={this.activeFilterReverseHandler} className={`text${activeFilterReversed ? ' reversed' : ''}`}>{'Active'}</span></div>
                                    <div className={`tool-box-button-switch${awardFilterReversed ? ' reversed ' : ''}`}><FontAwesomeIcon onClick={this.awardedFilterHandler} className={'check'} icon={awardedFilter ? ICON_CHECKBOX_CHECKED : ICON_CHECKBOX_UNCHECKED}/><span onClick={this.awardedFilterReverseHandler} className={`text${awardFilterReversed ? ' reversed' : ''}`}>{'Awarded'}</span></div>
                                </Fragment>
                            }
                            <div onClick={() => this.props.setActiveBid(!this.props.activeBid)} className={'tool-box-button blue active-bid'}>
                                {this.props.activeBid ? 'All' : 'Bids'}
                            </div>
                        </div>
                    </div>
                </div>
                <Fragment>
                    {this.getHeader(this.props.activeBid ? columnDefBids : columnDef)}
                    <Scrollbars autoHide={true} autoHideTimeout={800} autoHideDuration={200}>
                        {this.getTable(this.props.activeBid ? columnDefBids : columnDef, sortedProjectIds)}
                    </Scrollbars>
                </Fragment>
            </div>
        )
    }
    // ***************************************************
    // TABLE CONTENT
    // ***************************************************
    getHeader = columnDef => {
        return (
            <Table className={'table-header'} borderless={true}>
                <thead>
                <tr>
                {columnDef.map((column, i) =>
                    <th key={i} className={column.className}>
                        {column.sort ? <FontAwesomeIcon
                            icon={this.props.sort === column.sort ? ICON_SORT_UP : this.props.sort === `-${column.sort}` ? ICON_SORT_DOWN : ICON_SORT}
                            onClick={() => this.handleSort(column.sort)}
                            className={`sort-icon${this.props.sort.indexOf(column.sort) < 0 ? ' not-set' : ''}`}
                        /> : null}
                        <span className={column.sort ? 'sortable-column' : ''} onClick={() => column.sort ? this.handleSort(column.sort) : undefined}>{column.label}</span>
                    </th>
                )}
                </tr>
                </thead>
            </Table>
        )
    };

    getTable = (columnDef, sortedProjectIds) => {
        return (
            <Table className={`table-body${this.props.activeBid ? ' active-bid' : ''}`}>
                <tbody style={{borderBottom: '1px solid #dee2e6'}}>
                {sortedProjectIds.map(projectId => <tr className={`${this.props.selectedProject === projectId ? 'selected' : ''}${this.props.activeBid ? '' : ' selectable'}`} onClick = {this.props.activeBid ? undefined : () => this.selectProject(projectId)} onDoubleClick={this.props.activeBid ? undefined : event => event.altKey ? this.editProject(projectId) : this.showProject(projectId)} key={projectId}>
                    {columnDef.map((column, i) =>
                        <td key={i}
                            className={`${column.className}${this.props.activeBid && i === 0 ? ' selectable' : ''}${this.props.selectedProject === projectId ? ' selected' : ''}${this.props.activeBid ? ' active-bid' : ''}`}
                            onClick={this.props.activeBid && i === 0 ? () => this.selectProject(projectId) : undefined}
                            onDoubleClick={!this.props.activeBid || i > 0 ? undefined : event => event.altKey ? this.editProject(projectId) : this.showProject(projectId)}
                        >
                            {this.getComputedField(column.field, this.props.projects[projectId], this.props.activeBid)}
                        </td>
                    )}
                </tr>)}
                </tbody>
            </Table>
        )
    };

    // ***************************************************
    // FILTER AND SORT SOURCE LIST - MEMOIZE
    // ***************************************************
    filterList = memoize((projects, filter) => {
        //console.log('FILTER');
        return Object.keys(projects).map(id => id).filter(id => {
            const project = projects[id];
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

    sortList = memoize((projects, ids, sort) => {
        //console.log('SORT');
        if(!sort) {
            return ids.sort((a, b) => projects[b].created.localeCompare(projects[a].created)); //default sort - latest created first
        } else {
            return ids.sort((a, b) => {
                const down = sort.indexOf('-') === 0;
                let field = down ? sort.substr(1) : sort;
                if (field === 'status') field = 'status-order';
                let dataA = down ? this.getComputedField(field, projects[a]) : this.getComputedField(field, projects[b]);
                let dataB = down ? this.getComputedField(field, projects[b]) : this.getComputedField(field, projects[a]);
                if (typeof dataA === 'undefined' && typeof dataB === 'undefined') return 0;
                if (typeof dataA === 'undefined') return 1;
                if (typeof dataB === 'undefined') return 0;
                if (dataA === null) dataA = '';
                if (dataB === null) dataB = '';
                return dataA.localeCompare(dataB);
            })
        }
    });

    searchList = memoize((projects, ids, search) => {
        //console.log('SEARCH');
        if(search && search.trim()) {
            const data = ids.map(id => {
                return {
                    _id: projects[id]._id,
                    name: projects[id].name,
                    $name: projects[id].$name,
                    team: projects[id].team.map(member => this.props.users[member.id])
                }
            });
            const fuse = new Fuse(data, {
                verbose: false,
                id: '_id',
                findAllMatches: true,
                keys: ['name', '$name', 'team.name']
            });
            return fuse.search(search.trim());
        } else return ids;
    });

    // ***************************************************
    // ROUTING
    // ***************************************************
    selectProject = (id) => {
        this.props.selectProject(id);
    };

    addProject = () => {
        this.props.addProject();
    };

    showProject = (id) => {
        this.props.showProject(id);
    };

    editProject = (id) => {
        this.props.editProject(id);
    };

    addToBox = () => {
        if(this.props.selectedProject) this.props.addToBox(this.props.selectedProject);
    };
    // ***************************************************
    // HANDLERS
    // ***************************************************
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

    handleSort = (sort) => {
        let result = '';
        if(this.props.sort.indexOf(sort) < 0) result = `-${sort}`;
        else if(this.props.sort === `-${sort}`) result = sort;
        this.props.setSort(result);
    };

    handleRestLastContact = id => {
        this.props.updateProject(id, {lastContact: moment()});
    };

    handleStatusChange = (id, status) => {
        if(status !== this.props.projects[id].status) {
            this.props.updateProject(id, {status: status});
        }
    };

    // ***************************************************
    // COMPUTE FIELD
    // ***************************************************
    getComputedField(field, project, editable) {
        switch(field) {
            case 'manager':
                if(!project || !project.team) return '---';
                const manager = project.team.find(person => this.props.users[person.id] && this.props.users[person.id].role.indexOf('manager') <= 0);
                if(manager) return this.props.users[manager.id].name;
                else return '---';

            case 'status-order':
                return ProjectStatus[project['status']] && ProjectStatus[project['status']].sortOrder ? ProjectStatus[project['status']].sortOrder.toString() : '0';

            case 'status':
                const status = ProjectStatus[project['status']] ? ProjectStatus[project['status']].label : '---';
                return editable ?
                    <Select
                        className={'table-select'}
                        options={statusOptions}
                        value={{value: project['status'], label: ProjectStatus[project['status']] ? ProjectStatus[project['status']].label : ''}}
                        onChange={option => this.handleStatusChange(project._id, option.value)}
                        isSearchable={false}
                        classNamePrefix={'table-select'}
                    /> : status;

            case 'lastContact':
                const lastContact = project && project.lastContact ? moment(project.lastContact).format('D.M.Y H:mm:ss') : 'Not Set';
                return editable ? <div onClick={() => this.handleRestLastContact(project._id)} className={'table-button'}>{lastContact}</div> : lastContact;

            default: return project && project[field] ? project[field] : '---';
        }
    }
}