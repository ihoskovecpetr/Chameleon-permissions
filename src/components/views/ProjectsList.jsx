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

import {daysToString} from '../../lib/dateHelper';
import * as Icons from '../../constants/Icons';

import memoize from 'memoize-one';

import {ProjectsColumnDef, ActiveBidsColumnDef} from '../../constants/TableColumnsDef';
const statusOptions = Object.keys(ProjectStatus).map(key => {return {value: key, label: ProjectStatus[key].label}});
const serachKeysProjects = ['name', '$name', 'producer', 'manager', 'status'];
const serachKeysBids = serachKeysProjects;

export default class ProjectsList extends React.PureComponent {

    componentDidUpdate(prevProps) { //remove selected project if doesn't exist in filtered set
        const searchKeys = this.props.activeBid ? serachKeysBids : serachKeysProjects;
        if(this.props.selectedProject && (this.props.filter !== prevProps.filter || this.props.search !== prevProps.search ) && this.searchList(this.props.projects, this.filterList(this.props.projects, this.props.filter), this.props.search, searchKeys).indexOf(this.props.selectedProject) < 0) this.props.selectProject(null);
    }

    render() {
        //console.log('RENDER PROJECTS LIST');
        const {selectedProject, projects, activeBid, filter, sort, search} = this.props;

        const searchKeys = this.props.activeBid ? serachKeysBids : serachKeysProjects;

        const filteredProjectIds = this.filterList(projects, filter);
        const searchedProjectIds = this.searchList(projects, filteredProjectIds, search, searchKeys);
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
                            <div onClick={selectedProject ? () => this.showProject() : undefined} className={`tool-box-button${selectedProject ? '' : ' disabled'}`}>{'Show'}</div>
                            <div onClick={selectedProject ? () => this.editProject() : undefined} className={`tool-box-button${selectedProject ? '' : ' disabled'}`}>{'Edit'}</div>
                            <div onClick={selectedProject ? this.addToBox : undefined} className={`tool-box-button blue${selectedProject ? '' : ' disabled'}`}><FontAwesomeIcon icon={Icons.ICON_BOX_ARROW_RIGHT}/><FontAwesomeIcon icon={Icons.ICON_BOX}/></div>
                        </div>
                    </div>
                    <div className={'inner-container flex'}>
                        <div className={'toolbox-group right-auto'}>
                            <div className={'tool-box-search-container'}>
                                <div className={'icon search'}><FontAwesomeIcon icon={Icons.ICON_SEARCH}/></div>
                                <Input value={search} onChange={this.searchInputHandler} className={`input-search`}/>
                                <div className={'icon clear'} onClick={this.clearSearchInputHanler}><FontAwesomeIcon icon={Icons.ICON_CLEAR}/></div>
                            </div>
                        </div>
                        <div className={'toolbox-group'}>
                            <div onClick={this.userFilterHandler} className={`tool-box-button-switch`}><FontAwesomeIcon className={'check'} icon={userFilter ? Icons.ICON_CHECKBOX_FILTER_CHECKED : Icons.ICON_CHECKBOX_FILTER_UNCHECKED}/><span className={`text`}>{'My'}</span></div>

                            {activeBid ? null :
                                <Fragment>
                                    <div className={`tool-box-button-switch${activeFilterReversed ? ' reversed' : ''}`}><FontAwesomeIcon onClick={this.activeFilterHandler} className={'check'} icon={activeFilter ? Icons.ICON_CHECKBOX_FILTER_CHECKED : Icons.ICON_CHECKBOX_FILTER_UNCHECKED}/><span onClick={this.activeFilterReverseHandler} className={`text${activeFilterReversed ? ' reversed' : ''}`}>{'Active'}</span></div>
                                    <div className={`tool-box-button-switch${awardFilterReversed ? ' reversed ' : ''}`}><FontAwesomeIcon onClick={this.awardedFilterHandler} className={'check'} icon={awardedFilter ? Icons.ICON_CHECKBOX_FILTER_CHECKED : Icons.ICON_CHECKBOX_FILTER_UNCHECKED}/><span onClick={this.awardedFilterReverseHandler} className={`text${awardFilterReversed ? ' reversed' : ''}`}>{'Awarded'}</span></div>
                                </Fragment>
                            }
                            <div onClick={this.toggleActiveBidMode} className={'tool-box-button blue active-bid'}>
                                {activeBid ? 'All' : 'Bids'}
                            </div>
                        </div>
                    </div>
                </div>
                <Fragment>
                    {this.getHeader(activeBid ? ActiveBidsColumnDef : ProjectsColumnDef)}
                    <Scrollbars autoHide={true} autoHideTimeout={800} autoHideDuration={200}>
                        {this.getTable(activeBid ? ActiveBidsColumnDef : ProjectsColumnDef, sortedProjectIds)}
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
                            icon={this.props.sort === column.sort ? Icons.ICON_SORT_UP : this.props.sort === `-${column.sort}` ? Icons.ICON_SORT_DOWN : Icons.ICON_SORT}
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
            <Table className={`table-body`}>
                <tbody style={{borderBottom: '1px solid #dee2e6'}}>
                {sortedProjectIds.map(projectId => <tr className={this.props.selectedProject === projectId ? 'selected' : ''} onClick = {event => this.rowClickHandler(event, projectId)} onDoubleClick={event => this.rowDoubleClickHandler(event, projectId)} key={projectId}>
                    {columnDef.map((column, i) =>
                        <td key={i} className={`${column.className}${column.inline ? ' inline' : ''}`}>
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
                        const producer = project.producer ? project.producer === this.props.user.id : false;
                        const manager = project.manager ? project.manager === this.props.user.id : false;
                        const supervisor = project.supervisor ? project.supervisor === this.props.user.id : false;
                        const supervisor2 = project.supervisor2 ? project.supervisor2 === this.props.user.id : false;
                        const lead2D = project.lead2D ? project.lead2D === this.props.user.id : false;
                        const lead3D = project.lead3D ? project.lead3D === this.props.user.id : false;
                        const leadMP = project.leadMP ? project.leadMP === this.props.user.id : false;
                        if(!(producer || manager || supervisor || supervisor2 || lead2D || lead3D || leadMP)) return false;
                        break;
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

    searchList = memoize((projects, ids, search, keys) => {
        //console.log('SEARCH');
        if(search && search.trim()) {
            const data = ids.map(id => keys.reduce((mod, key) => ({...mod, [key]: this.getComputedField(key, projects[id])}) , {_id: id}));
            const fuse = new Fuse(data, {
                verbose: false,
                id: '_id',
                findAllMatches: true,
                keys: keys
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
    toggleActiveBidMode = () => {
        this.props.setActiveBid(!this.props.activeBid)
    };

    rowClickHandler = (event, projectId) => {
        if(typeof event.target.className === 'string' && event.target.className.indexOf('control-select') < 0 && event.target.className.indexOf('table-button') < 0) this.selectProject(projectId);
    };

    rowDoubleClickHandler = (event, projectId) => {
        if(typeof event.target.className === 'string' && event.target.className.indexOf('control-select') < 0 && event.target.className.indexOf('table-button') < 0) event.altKey ? this.editProject(projectId) : this.showProject(projectId);
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

    clearSearchInputHanler = () => {
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
            case 'producer':
                if(!project || !project.producer) return '---';
                if(this.props.users[project.producer]) return this.props.users[project.producer].name;
                else return `id: ${project.producer}`;
            case 'manager':
                if(!project || !project.manager) return '---';
                if(this.props.users[project.manager]) return this.props.users[project.manager].name;
                else return `id: ${project.manager}`;

            case 'status-order':
                return ProjectStatus[project['status']] && ProjectStatus[project['status']].sortOrder ? ProjectStatus[project['status']].sortOrder.toString() : '0';

            case 'status':
                const status = ProjectStatus[project['status']] ? ProjectStatus[project['status']].label : '---';
                return editable ?
                    <Select
                        className={'control-select inline'}
                        options={statusOptions}
                        value={{value: project['status'], label: ProjectStatus[project['status']] ? ProjectStatus[project['status']].label : ''}}
                        onChange={option => this.handleStatusChange(project._id, option.value)}
                        isSearchable={false}
                        classNamePrefix={'control-select'}
                    /> : status;

            case 'client': //find main client in company field [{id, role, note, rating}]
                if(!project || !project.company || project.company.length === 0) return '---';
                let company = project.company.find(c => c.role.indexOf('MAIN') >= 0);
                if(!company) company = project.company[0];
                return this.props.companies[company.id] ? this.props.companies[company.id].name : '---';

            case 'team': //find producer, manager, supervisor in team field [{id, role}], icons + short names /not sortable anyway
                let producer = null;
                let manager = null;
                let supervisor = null;
                if(project && project.producer) producer = this.props.users[project.producer] ? this.props.users[project.producer].name : `id: ${project.producer}`;
                if(project && project.manager) manager = this.props.users[project.manager] ? this.props.users[project.manager].name : `id: ${project.manager}`;
                if(project && project.supervisor) supervisor = this.props.users[project.supervisor] ? this.props.users[project.supervisor].name : `id: ${project.supervisor}`;
                if(producer || manager || supervisor) {
                    return (
                        <div className={'table-team'}>
                            {producer ? <div className={'team-member producer'}><FontAwesomeIcon icon={Icons.ICON_PRODUCER} fixedWidth/>{producer}</div> : null}
                            {manager ? <div className={'team-member manager'}><FontAwesomeIcon icon={Icons.ICON_MANAGER} fixedWidth/>{manager}</div> : null}
                            {supervisor ? <div className={'team-member supervisor'}><FontAwesomeIcon icon={Icons.ICON_SUPERVISOR} fixedWidth/>{supervisor}</div> : null}
                        </div>
                    );
                } else return '---';

            case 'budget': //find current budget in budget field {booking, client, sent, ballpark: {from, to}}, get discount %, normalize currency '10000 USD 10%' or '10000 - 20000 USD' etc
                return '10.000 USD [10%]';

            case 'go-ahead': //find go ahead from timing [{date, text, category}] in days to go ahead /colors?/
                const goAhead = daysToString(-300);//daysToString(project ? project.goAhead : null, null, false); //TODO synthesize goAhead from timing
                return goAhead;

            case 'last-contact': //last contact in days passed this - colors?
                const lastContact = daysToString(project ? project.lastContact : null, null, true);
                return editable ? <div onClick={() => this.handleRestLastContact(project._id)} className={'table-button'}>{lastContact}</div> : lastContact;

            default: return project && project[field] ? project[field] : '---';
        }
    }
}