import React, {Fragment} from 'react';
import { Table } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import * as ProjectStatus from '../../constants/ProjectStatus';
import * as TeamRole from '../../constants/TeamRole';
import * as FilterTypes from '../../constants/FilterTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input } from 'reactstrap';
import Fuse from 'fuse.js';
import moment from 'moment';
import Select from 'react-select';

import * as ProjectClientTiming from '../../constants/ProjectClientTiming';

import {TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT, TABLE_SCROLLBARS_AUTO_HIDE_DURATION} from '../../constants/Constatnts';

import {daysToString} from '../../lib/dateHelper';
import * as Icons from '../../constants/Icons';
import * as CompanyFlag from '../../constants/CompanyFlag';

import memoize from 'memoize-one';

import {ProjectsColumnDef, ActiveBidsColumnDef} from '../../constants/TableColumnsDef';
const statusOptions = Object.keys(ProjectStatus).filter(key => ProjectStatus[key].bids).map(key => {return {value: ProjectStatus[key].id, label: ProjectStatus[key].label}});
const searchKeysProjects = ['name', '$name', 'client', 'team', 'status'];
const searchKeysBids = searchKeysProjects;

export default class ProjectList extends React.PureComponent {

    componentDidUpdate(prevProps) { //remove selected project if doesn't exist in filtered set
        const searchKeys = this.props.activeBid ? searchKeysBids : searchKeysProjects;
        if(this.props.selected && (this.props.filter !== prevProps.filter || this.props.search !== prevProps.search ) && this.searchList(this.props.projects, this.filterList(this.props.projects, this.props.filter), this.props.search, searchKeys).indexOf(this.props.selected) < 0) this.props.select(null);
    }

    render() {
        //console.log('RENDER PROJECTS LIST');
        const {selected, projects, activeBid, filter, sort, search} = this.props;

        const searchKeys = this.props.activeBid ? searchKeysBids : searchKeysProjects;

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
                            <div onClick={this.add} className={'tool-box-button green'}>{'New'}</div>
                            <div onClick={selected ? () => this.show(selected) : undefined} className={`tool-box-button${selected ? '' : ' disabled'}`}>{'Show'}</div>
                            <div onClick={selected ? () => this.edit(selected) : undefined} className={`tool-box-button orange${selected ? '' : ' disabled'}`}>{'Edit'}</div>
                            <div onClick={selected ? this.addToBox : undefined} className={`tool-box-button blue${selected ? '' : ' disabled'}`}><FontAwesomeIcon icon={Icons.ICON_BOX_ARROW}/><FontAwesomeIcon icon={Icons.ICON_BOX}/></div>
                        </div>
                    </div>
                    <div className={'inner-container flex'}>
                        <div className={'toolbox-group right-auto'}>
                            <div className={'tool-box-search-container'}>
                                <div className={'icon search'}><FontAwesomeIcon icon={Icons.ICON_SEARCH}/></div>
                                <Input value={search} onChange={this.searchInputHandler} className={`input-search`}/>
                                <div className={'icon clear'} onClick={this.clearSearchInputHandler}><FontAwesomeIcon icon={Icons.ICON_SEARCH_CLEAR}/></div>
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
                    <Scrollbars autoHide={true} autoHideTimeout={TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT} autoHideDuration={TABLE_SCROLLBARS_AUTO_HIDE_DURATION}>
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
                            icon={this.props.sort === column.sort ? Icons.ICON_TABLE_SORT_UP : this.props.sort === `-${column.sort}` ? Icons.ICON_TABLE_SORT_DOWN : Icons.ICON_TABLE_SORT}
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
                {sortedProjectIds.map(projectId => <tr className={this.props.selected === projectId ? 'selected' : ''} onClick = {event => this.rowClickHandler(event, projectId)} onDoubleClick={event => this.rowDoubleClickHandler(event, projectId)} key={projectId}>
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
                        if(!(project.team && project.team.some(member => member.id === this.props.user.id))) return false;
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
                //if (field === 'status') field = 'status-order';
                //if (field === 'go-ahead') field = 'go-ahead-order';
                if(['status', 'go-ahead', 'last-contact'].indexOf(field) >= 0) field = `${field}-order`;
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
            let keysModified = keys;
            let tokenize = false;
            if(search.indexOf(':') > 1) {
                const index = search.trim().indexOf(':');
                const key = search.substring(0, index).trim();
                if(keys.indexOf(key) >= 0) {
                    search = search.substring(index + 1);
                    keysModified = [key];
                    if(key === 'name') keysModified.push('$name');
                }
            }
            let searchModified = search.trim().replace(/[^a-zA-Z ]/g, '').replace(/ +/g, '_');
            //console.log(keysModified);
            //console.log(searchModified);
            const data = ids.map(id => keysModified.reduce((mod, key) => ({...mod, [key]: this.getComputedField(key, projects[id], false, true)}) , {_id: id}));
            const fuse = new Fuse(data, {
                verbose: false,
                id: '_id',
                findAllMatches: true,
                keys: keysModified,
                tokenize: tokenize,
                matchAllTokens: true,
                threshold: 0.4,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 2
            });
            return fuse.search(searchModified.trim());
        } else return ids;
    });

    // ***************************************************
    // ROUTING
    // ***************************************************
    select = (id) => {
        this.props.select(id);
    };

    add = () => {
        this.props.add();
    };

    show = (id, set) => {
        this.props.show(id, set);
    };

    edit = (id, set) => {
        this.props.edit(id, set);
    };

    addToBox = () => {
        if(this.props.selected) this.props.addToBox(this.props.selected);
    };

    // ***************************************************
    // HANDLERS
    // ***************************************************
    toggleActiveBidMode = () => {
        this.props.setActiveBid(!this.props.activeBid)
    };

    rowClickHandler = (event, projectId) => {
        if(typeof event.target.className === 'string' && event.target.className.indexOf('control-select') < 0 && event.target.className.indexOf('table-button') < 0) this.select(projectId);
    };

    rowDoubleClickHandler = (event, projectId) => {
        if(typeof event.target.className === 'string' && event.target.className.indexOf('control-select') < 0 && event.target.className.indexOf('table-button') < 0) event.altKey ? this.edit(projectId, true) : this.show(projectId, true);
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

    clearSearchInputHandler = () => {
       this.props.setSearch('');
    };

    handleSort = (sort) => {
        let result = '';
        if(this.props.sort.indexOf(sort) < 0) result = `-${sort}`;
        else if(this.props.sort === `-${sort}`) result = sort;
        this.props.setSort(result);
    };

    handleResetLastContact = id => {
        this.props.update(id, {lastContact: moment().startOf('day')});
    };

    handleStatusChange = (id, status) => {
        if(status !== this.props.projects[id].status) {
            this.props.update(id, {status: status});
        }
    };

    // ***************************************************
    // COMPUTE FIELD
    // ***************************************************
    getComputedField(field, project, editable, searchable) {
        switch(field) {
            case 'producer':
                if(!project || !project.team || project.team.length === 0) return '---';
                const producer = project.team.find(member => member.role.indexOf(TeamRole.PRODUCER.id) >= 0);
                if(!producer) return '---';
                if(this.props.users[producer.id]) return this.props.users[producer.id].name;
                else return `id: ${producer.id}`;

            case 'manager':
                if(!project || !project.team || project.team.length === 0) return '---';
                const manager = project.team.find(member => member.role.indexOf(TeamRole.MANAGER.id) >= 0);
                if(!manager) return '---';
                if(this.props.users[manager.id]) return this.props.users[manager.id].name;
                else return `id: ${manager.id}`;

            case 'supervisor':
                if(!project || !project.team || project.team.length === 0) return '---';
                const supervisor = project.team.find(member => member.role.indexOf(TeamRole.SUPERVISOR.id) >= 0);
                if(!supervisor) return '---';
                if(this.props.users[supervisor.id]) return this.props.users[supervisor.id].name;
                else return `id: ${supervisor.id}`;

            case 'status-order':
                return ProjectStatus[project['status']] && ProjectStatus[project['status']].sort ? ProjectStatus[project['status']].sort.toString() : '0';

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
                let company = project.company.find(company => company.flag.indexOf(CompanyFlag.UPP_CLIENT) >= 0);
                if(!company) return '---';
                return this.props.companies[company.id] ? this.props.companies[company.id].name : '---';

            case 'team': //find producer, manager, supervisor in team field [{id, role}], icons + short names /not sortable anyway
                if(searchable) {
                    if (project && project.team && project.team.length > 0) {
                        return project.team.map(member => this.props.users[member.id] ? this.props.users[member.id].name : '');
                    } else return '';
                } else {
                    let teamProducer = undefined;
                    let teamManager = undefined;
                    let teamSupervisor = undefined;
                    if (project && project.team && project.team.length > 0) {
                        teamProducer = project.team.find(member => member.role.indexOf(TeamRole.PRODUCER.id) >= 0);
                        teamManager = project.team.find(member => member.role.indexOf(TeamRole.MANAGER.id) >= 0);
                        teamSupervisor = project.team.find(member => member.role.indexOf(TeamRole.SUPERVISOR.id) >= 0);
                    }
                    if (teamProducer) teamProducer = this.props.users[teamProducer.id] ? this.props.users[teamProducer.id].name : `id: ${teamProducer.id}`;
                    if (teamManager) teamManager = this.props.users[teamManager.id] ? this.props.users[teamManager.id].name : `id: ${teamManager.id}`;
                    if (teamSupervisor) teamSupervisor = this.props.users[teamSupervisor.id] ? this.props.users[teamSupervisor.id].name : `id: ${teamSupervisor.id}`;

                    if (teamProducer || teamManager || teamSupervisor) {
                        return (
                            <div className={'table-team'}>
                                {teamProducer ? <div className={'team-member producer'}><FontAwesomeIcon icon={Icons.ICON_ROLE_PRODUCER} fixedWidth/>{teamProducer}</div> : null}
                                {teamManager ? <div className={'team-member manager'}><FontAwesomeIcon icon={Icons.ICON_ROLE_MANAGER} fixedWidth/>{teamManager}</div> : null}
                                {teamSupervisor ? <div className={'team-member supervisor'}><FontAwesomeIcon icon={Icons.ICON_ROLE_SUPERVISOR} fixedWidth/>{teamSupervisor}</div> : null}
                            </div>
                        );
                    } else return '---';
                }

            case 'budget': //find current budget in budget field {booking, client, sent, ballpark: {from, to}}, get discount %, normalize currency '10000 USD 10%' or '10000 - 20000 USD' etc
                return '10.000 USD [10%]';

            case 'go-ahead': //find go ahead from timing [{date, text, category}] in days to go ahead /colors?/
                let goAheadDate = project && project.timing ? project.timing.find(line => line.label === ProjectClientTiming.GO_AHEAD.id) : null;
                goAheadDate = goAheadDate && goAheadDate.date ? goAheadDate.date : null;
                return daysToString(goAheadDate, null, false);

            case 'go-ahead-order':
                //return ProjectStatus[project['status']] && ProjectStatus[project['status']].sortOrder ? ProjectStatus[project['status']].sortOrder.toString() : '0';
                let goAheadDateOrder = project && project.timing ? project.timing.find(line => line.label === ProjectClientTiming.GO_AHEAD.id) : null;
                goAheadDateOrder = goAheadDateOrder && goAheadDateOrder.date ? +new Date(goAheadDateOrder.date) : +new Date(2100,0,1,0,0,0,0);
                return `${goAheadDateOrder}`;


            case 'last-contact': //last contact in days passed this - colors?
                const lastContact = daysToString(project ? project.lastContact : null, null, true);
                return editable ? <div onClick={() => this.handleResetLastContact(project._id)} className={'table-button'}>{lastContact}</div> : lastContact;

            case 'last-contact-order':
                const  lastContactOrder = project && project.lastContact ? +new Date(project.lastContact) :  +new Date(0);
                return `${lastContactOrder}`;

            default: return project && project[field] ? project[field] : '---';
        }
    }
}