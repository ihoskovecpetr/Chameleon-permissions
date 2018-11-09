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
import * as StringFormatter from '../../lib/stringFormatHelper';

import * as ProjectClientTiming from '../../constants/ProjectClientTiming';
import * as VipTags from '../../constants/VipTag';

import {TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT, TABLE_SCROLLBARS_AUTO_HIDE_DURATION} from '../../constants/Constatnts';

import {daysToString} from '../../lib/dateHelper';
import * as Icons from '../../constants/Icons';
import * as CompanyFlag from '../../constants/CompanyFlag';

import memoize from 'memoize-one';

const TOOLTIP_SHOW_DELAY = 0.2;

import {ProjectsColumnDef, ActiveBidsColumnDef} from '../../constants/TableColumnsDef';

import Tooltip  from 'rc-tooltip';

const statusOptions = Object.keys(ProjectStatus).filter(key => ProjectStatus[key].bids).map(key => {return {value: ProjectStatus[key].id, label: ProjectStatus[key].label}});
const searchKeysProjects = ['name', '$name', 'alias', 'client', 'team', 'status'];
const searchKeysBids = searchKeysProjects;

const CURRENCY_RATIO = {eur: 25.5, usd: 21.5};

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
                {/* ------------------ TOOLBOX ------------------ */}
                <div className={'app-toolbox'}>
                    <div className={'inner-container space'}>
                        {/* ------------------ BUTTONS ------------------ */}
                        <div className={'toolbox-group'}>
                            <div onClick={this.add} className={'tool-box-button green'}>{'New'}</div>
                            <div onClick={selected ? () => this.show(selected) : undefined} className={`tool-box-button${selected ? '' : ' disabled'}`}>{'Show'}</div>
                            <div onClick={selected ? () => this.edit(selected) : undefined} className={`tool-box-button orange${selected ? '' : ' disabled'}`}>{'Edit'}</div>
                            <div onClick={selected ? this.addToBox : undefined} className={`tool-box-button blue${selected ? '' : ' disabled'}`}><FontAwesomeIcon icon={Icons.ICON_BOX_ARROW}/><FontAwesomeIcon icon={Icons.ICON_BOX}/></div>
                        </div>
                    </div>
                    <div className={'inner-container flex'}>
                        {/* ------------------ SEARCH ------------------ */}
                        <div className={'toolbox-group right-auto'}>
                            <div className={'tool-box-search-container'}>
                                <div className={'icon search'}><FontAwesomeIcon icon={Icons.ICON_SEARCH}/></div>
                                <Input value={search} onChange={this.searchInputHandler} className={`input-search`}/>
                                <div className={'icon clear'} onClick={this.clearSearchInputHandler}><FontAwesomeIcon icon={Icons.ICON_SEARCH_CLEAR}/></div>
                            </div>
                        </div>
                        {/* ------------------ FILTER SWITCHES ------------------ */}
                        <div className={'toolbox-group'}>
                            <div onClick={this.userFilterHandler} className={`tool-box-button-switch${userFilter ? ' checked' : ''}`}><FontAwesomeIcon className={'check'} icon={userFilter ? Icons.ICON_CHECKBOX_FILTER_CHECKED : Icons.ICON_CHECKBOX_FILTER_UNCHECKED}/><span className={`text`}>{'My'}</span></div>

                            {activeBid ? null :
                                <Fragment>
                                    <div onClick={event => this.activeFilterHandler(event, false)} className={`tool-box-button-switch${activeFilter ?  activeFilterReversed ? ' reversed' : ' checked' : ''}`}><FontAwesomeIcon onClick={event => this.activeFilterHandler(event, true)} className={'check'} icon={activeFilter ? Icons.ICON_CHECKBOX_FILTER_CHECKED : Icons.ICON_CHECKBOX_FILTER_UNCHECKED}/><span className={`text${activeFilterReversed ? ' reversed' : ''}`}>{'Active'}</span></div>
                                    <div onClick={event => this.awardedFilterHandler(event, false)} className={`tool-box-button-switch${awardedFilter ? awardFilterReversed ? ' reversed ' : ' checked' : ''}`}><FontAwesomeIcon onClick={event => this.awardedFilterHandler(event, true)} className={'check'} icon={awardedFilter ? Icons.ICON_CHECKBOX_FILTER_CHECKED : Icons.ICON_CHECKBOX_FILTER_UNCHECKED}/><span className={`text${awardFilterReversed ? ' reversed' : ''}`}>{'Awarded'}</span></div>
                                </Fragment>
                            }
                            {/* BID SWITCH */}
                            <div onClick={this.toggleActiveBidMode} className={`tool-box-button-switch${activeBid ? ' checked' : ''}`}><FontAwesomeIcon className={'check'} icon={activeBid ? Icons.ICON_CHECKBOX_FILTER_CHECKED : Icons.ICON_CHECKBOX_FILTER_UNCHECKED}/><span className={`text`}>{'Bids'}</span></div>
                        </div>
                        {/* ------------------------------------ */}
                    </div>
                </div>
                {/* ------------------ TABLE LIST ------------------ */}
                <Fragment>
                    {this.getHeader(activeBid ? ActiveBidsColumnDef : ProjectsColumnDef)}
                    <Scrollbars className={'body-scroll-content projects'} autoHide={true} autoHideTimeout={TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT} autoHideDuration={TABLE_SCROLLBARS_AUTO_HIDE_DURATION}>
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
            //return ids.sort((a, b) => projects[b].created.localeCompare(projects[a].created)); //default sort - inquired
            return ids.sort((a, b) => { //default sort - inquired
                let aTime = projects[a] && projects[a].inquired ? +new Date(projects[a].inquired) : 0;
                let bTime = projects[b] && projects[b].inquired ? +new Date(projects[b].inquired) : 0;
                if(aTime === bTime) {
                    aTime = projects[a] && projects[a].created ? +new Date(projects[a].created) : 0;
                    bTime = projects[b] && projects[b].created ? +new Date(projects[b].created) : 0;
                }
                return bTime - aTime;
            });
        } else {
            return ids.sort((a, b) => {
                let down = sort.indexOf('-') === 0;
                let field = down ? sort.substr(1) : sort;
                if(['last-contact', 'budget'].indexOf(field) >= 0) down = !down;
                if(['name', 'status', 'go-ahead', 'last-contact', 'budget', 'vipTag'].indexOf(field) >= 0) field = `${field}-order`;
                let dataA = down ? this.getComputedField(field, projects[a]) : this.getComputedField(field, projects[b]);
                let dataB = down ? this.getComputedField(field, projects[b]) : this.getComputedField(field, projects[a]);
                if (typeof dataA === 'undefined' && typeof dataB === 'undefined') return 0;
                if (typeof dataA === 'undefined') return 1;
                if (typeof dataB === 'undefined') return 0;
                if (dataA === null) dataA = '';
                if (dataB === null) dataB = '';
                if(typeof dataA === 'string') {
                    return dataA.localeCompare(dataB);
                } else if(typeof dataA === 'number') {
                    return dataA - dataB;
                } else return 0;
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
                    if(key === 'name') {
                        keysModified.push('$name');
                        keysModified.push('alias');
                    }
                }
            }
            let searchModified = search.trim().replace(/[^a-zA-Z ]/g, '').replace(/ +/g, '_');
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

    activeFilterHandler = (event, check) => {
        if(check) event.stopPropagation();
        if (this.props.filter.indexOf(FilterTypes.ACTIVE_PROJECTS_FILTER) >= 0) {
            this.props.setFilter(FilterTypes.ACTIVE_PROJECTS_FILTER, false);
            if(!check) this.props.setFilter(FilterTypes.NON_ACTIVE_PROJECTS_FILTER, true);
        }
        else if (this.props.filter.indexOf(FilterTypes.NON_ACTIVE_PROJECTS_FILTER) >= 0) this.props.setFilter(FilterTypes.NON_ACTIVE_PROJECTS_FILTER, false);
        else this.props.setFilter(FilterTypes.ACTIVE_PROJECTS_FILTER, true);
    };

    awardedFilterHandler = (event, check) => {
        if(check) event.stopPropagation();
        if (this.props.filter.indexOf(FilterTypes.AWARDED_PROJECTS_FILTER) >= 0) {
            this.props.setFilter(FilterTypes.AWARDED_PROJECTS_FILTER, false);
            if(!check) this.props.setFilter(FilterTypes.NOT_AWARDED_PROJECTS_FILTER, true);
        }
        else if (this.props.filter.indexOf(FilterTypes.NOT_AWARDED_PROJECTS_FILTER) >= 0) this.props.setFilter(FilterTypes.NOT_AWARDED_PROJECTS_FILTER, false);
        else this.props.setFilter(FilterTypes.AWARDED_PROJECTS_FILTER, true);
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
            case 'name':
                if(searchable) return project && project.name ? project.name : '';
                if(!project || !project.name) return '---';
                if(!project.story) return project.name;
                return (
                    <Tooltip
                        placement={"topLeft"}
                        mouseEnterDelay={TOOLTIP_SHOW_DELAY}
                        mouseLeaveDelay={0}
                        align={{offset: [-7, -1]}}
                        overlay={<span className={'mw60'}>{project.story}</span>}
                    >
                        <span>{project.name}</span>
                    </Tooltip>);

            case 'name-order':
                return project && project.name ? project.name : '';
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
                return ProjectStatus[project['status']] && ProjectStatus[project['status']].sort ? ProjectStatus[project['status']].sort : 0;

            case 'status':
                let status = ProjectStatus[project['status']] ? ProjectStatus[project['status']].label : '---';
                status = editable ?
                    <Select
                        className={`control-select inline${project['status'] && ProjectStatus[project['status']] && ProjectStatus[project['status']].colorClass ? ` ${ProjectStatus[project['status']].colorClass}` : ''}`}
                        options={statusOptions}
                        value={{value: project['status'], label: ProjectStatus[project['status']] ? ProjectStatus[project['status']].label : ''}}
                        onChange={option => this.handleStatusChange(project._id, option.value)}
                        isSearchable={false}
                        classNamePrefix={'control-select'}
                        blurInputOnSelect={true}
                        tabIndex={-1}
                    /> : status;
                const statusNote = project.statusNote ? project.statusNote : '';
                return statusNote ?
                    <Tooltip
                        trigger={['hover', 'focus']}
                        placement={"topLeft"}
                        mouseEnterDelay={TOOLTIP_SHOW_DELAY}
                        mouseLeaveDelay={0}
                        align={{offset: editable ? [0, -3] : [-7, -1]}}
                        overlay={<span className={'mw20'}>{statusNote}</span>}
                    >
                        <span>{status}</span>
                    </Tooltip> : status;

            case 'client': //find main client in company field [{id, role, note, rating}]
                if(!project || !project.company || project.company.length === 0) return '---';
                let company = project.company.find(company => company.flag.indexOf(CompanyFlag.UPP_CLIENT) >= 0);
                if(!company) return '---';
                const persons = project.person ? project.person
                    .filter(person => person.company === company.id && (person.flag.indexOf('CREATIVITY') >= 0 || person.flag.indexOf('BUSINESS') >= 0))
                        .map(person => this.props.persons[person.id] ? this.props.persons[person.id].name : `id: ${person.id}`)
                    : null;
                if(persons && persons.length > 0) return (
                    <Tooltip
                        placement={"topLeft"}
                        mouseEnterDelay={TOOLTIP_SHOW_DELAY}
                        mouseLeaveDelay={0}
                        align={{offset: [-7, -1]}}
                        overlay={<span>{persons.join('\n')}</span>}
                    >
                        <span>{this.props.companies[company.id] ? this.props.companies[company.id].name : '---'}</span>
                    </Tooltip>);
                else return this.props.companies[company.id] ? this.props.companies[company.id].name : '---';

            case 'team': //find producer, manager, supervisor in team field [{id, role}], icons + short names /not sortable anyway
                if(searchable) {
                    if (project && project.team && project.team.length > 0) {
                        return project.team.map(member => this.props.users[member.id] ? this.props.users[member.id].name : '');
                    } else return '';
                } else {
                    if (project && project.team && project.team.length > 0) {
                        const team = project.team
                            .filter(member => member.role.indexOf(TeamRole.PRODUCER.id) >= 0 || member.role.indexOf(TeamRole.MANAGER.id) >= 0 || member.role.indexOf(TeamRole.SUPERVISOR.id) >= 0 )
                            .sort((a, b) => {
                                const aSort = Math.min(...a.role.map(role => TeamRole[role].sort));
                                const bSort = Math.min(...b.role.map(role => TeamRole[role].sort));
                                return aSort - bSort;
                            }); //remove duplicity of supervisor etc ??? or supervisor - second

                        const teamOver = project.team
                            .sort((a, b) => {
                                const aSort = Math.min(...a.role.map(role => TeamRole[role].sort));
                                const bSort = Math.min(...b.role.map(role => TeamRole[role].sort));
                                return aSort - bSort;
                            }).map(member => this.props.users[member.id] ? this.props.users[member.id].name : `id: ${member.id}`);
                        return (
                            <Tooltip
                                placement={"topLeft"}
                                mouseEnterDelay={TOOLTIP_SHOW_DELAY}
                                mouseLeaveDelay={0}
                                align={{offset: [-7, -4]}}
                                overlay={<span>{teamOver.join('\n')}</span>}
                            >
                                <div className={'table-team'}>
                                    {team.map((member, index) => {
                                        const name = this.props.users[member.id] ? this.props.users[member.id].name : `id: ${member.id}`;
                                        const icons = member.role.map((role, index) => <FontAwesomeIcon key={index} icon={TeamRole[role].icon} fixedWidth/>);
                                        return <div key={index} className={'team-member'}>{icons}<span>{StringFormatter.getSurrname(name)}</span></div>

                                    })}
                                </div>
                            </Tooltip>
                        )
                    } else return '---';
                }

            case 'budget':
                let ballparkCurrency = project && project.budget && project.budget.ballpark && project.budget.ballpark.currency ? project.budget.ballpark.currency : 'eur';
                let ballparkFrom = project && project.budget && project.budget.ballpark && project.budget.ballpark.from ? project.budget.ballpark.from : null;
                let ballparkTo = project && project.budget && project.budget.ballpark && project.budget.ballpark.to ? project.budget.ballpark.to : null;

                if(ballparkFrom || ballparkTo) {
                    const userFilter = this.props.filter.indexOf(FilterTypes.USER_FILTER) >= 0;
                    if(!userFilter && ballparkCurrency !== 'eur') {
                        const ration = ballparkCurrency === 'czk' ? 1 / CURRENCY_RATIO.eur : CURRENCY_RATIO.usd / CURRENCY_RATIO.eur;
                        if(ballparkFrom) ballparkFrom = Math.round(ballparkFrom * ration);
                        if(ballparkTo) ballparkTo = Math.round(ballparkTo * ration);
                        ballparkCurrency = 'eur';
                    }
                    return `${StringFormatter.currencyFormat(ballparkFrom, ballparkTo ? '' : ballparkCurrency.toUpperCase())}${ballparkTo ? ` - ${StringFormatter.currencyFormat(ballparkTo, ballparkCurrency.toUpperCase())}` : ''}`;
                } else return '---';

            case 'budget-order':
                const ballparkCurrencySort = project && project.budget && project.budget.ballpark && project.budget.ballpark.currency ? project.budget.ballpark.currency : 'eur';
                let ballparkFromSort = project && project.budget && project.budget.ballpark && project.budget.ballpark.from ? project.budget.ballpark.from : null;
                let ballparkToSort = project && project.budget && project.budget.ballpark && project.budget.ballpark.to ? project.budget.ballpark.to : null;
                if(ballparkFromSort || ballparkToSort) {
                    if(ballparkCurrencySort !== 'eur') {
                        const ration = ballparkCurrencySort === 'czk' ? 1 / CURRENCY_RATIO.eur : CURRENCY_RATIO.usd / CURRENCY_RATIO.eur;
                        if(ballparkFromSort) ballparkFromSort = Math.round(ballparkFromSort * ration);
                        if(ballparkToSort) ballparkToSort = Math.round(ballparkToSort * ration);
                    }
                    if(!ballparkToSort) return ballparkFromSort;
                    else return Math.round((ballparkFromSort + ballparkToSort) / 2);
                } else return 0; //Number.MAX_SAFE_INTEGER;

            case 'go-ahead': //find go ahead from timing [{date, text, category}] in days to go ahead /colors?/
                let goAheadDate = project && project.timing ? project.timing.find(line => line.label === ProjectClientTiming.GO_AHEAD.id) : null;
                goAheadDate = goAheadDate && goAheadDate.date ? goAheadDate.date : null;
                return daysToString(goAheadDate, null, false);

            case 'go-ahead-order':
                let goAheadDateOrder = project && project.timing ? project.timing.find(line => line.label === ProjectClientTiming.GO_AHEAD.id) : null;
                goAheadDateOrder = goAheadDateOrder && goAheadDateOrder.date ? +new Date(goAheadDateOrder.date) : +new Date(2100,0,1,0,0,0,0);
                return goAheadDateOrder;


            case 'last-contact':
                let lastContact = daysToString(project ? project.lastContact : null, null, true);
                lastContact = editable ? <div onClick={() => this.handleResetLastContact(project._id)} className={'table-button'}>{lastContact}</div> : <span>lastContact</span>;
                if(project.inquired) {
                    lastContact = <Tooltip
                        placement={"topRight"}
                        mouseEnterDelay={TOOLTIP_SHOW_DELAY}
                        mouseLeaveDelay={0}
                        align={{offset: [0, -3]}}
                        overlay={<span>{`Inquired: ${moment(project.inquired).format('D.M.YYYY')}${project.lastContact ? `\nContact: ${moment(project.lastContact).format('D.M.YYYY')}` : ''}`}</span>}
                    >
                        {lastContact}
                    </Tooltip>
                }
                return lastContact;

            case 'last-contact-order':
                return project && project.lastContact ? +new Date(project.lastContact) :  +new Date(0);

            case 'vipTag':
                if(!project || !project.vipTag || !project.vipTag.length > 0) return '';
                return (
                    <Tooltip
                        placement={"topLeft"}
                        mouseEnterDelay={TOOLTIP_SHOW_DELAY}
                        mouseLeaveDelay={0}
                        align={{offset: [-7, -4]}}
                        overlay={<span>{`${project.vipTag.map(tag => VipTags[tag] ? VipTags[tag].label : tag).join(', ')}\n${project.vipTagNote}`}</span>}
                    >
                        <FontAwesomeIcon style={{fontSize: '0.8em', color: '#636363'}} icon={'tag'}/>
                    </Tooltip>);

            case 'vipTag-order':
                return project && project.vipTag && project.vipTag.length > 0 ? 1 : 2;

            default: return project && project[field] ? project[field] : '---';
        }
    }
}