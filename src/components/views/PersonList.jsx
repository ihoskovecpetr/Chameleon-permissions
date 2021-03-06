import React, {Fragment} from 'react';
import { Table } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Fuse from 'fuse.js';

import Toolbox from '../toolbox/ListToolbox';

import * as Icons from '../../constants/Icons';

import * as ContactType from '../../constants/ContactType';
import * as PersonProfession from '../../constants/PersonProfession';

import {TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT, TABLE_SCROLLBARS_AUTO_HIDE_DURATION, TABLE_PAGE_SIZE_PERSON} from '../../constants/Constatnts';

import memoize from 'memoize-one';

import {PersonsColumnDef} from '../../constants/TableColumnsDef';

//const searchKeys = ['name', '$name', 'contact', 'profession', 'company', 'project'];
const searchKeys = ['name', '$name', 'company', 'profession'];
const searchKeysShort = {
    name: {key: ['name', '$name'], description: `person names`},
    company: {key: 'company', description: `person companies`},
    profession: {key: 'profession', description: `person professions`},
    contact: {key: 'contact', description: `person contacts (*)`},
    project: {key: 'project', description: `projects participated by person on (*)`}
};

export default class PersonList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            page: 0
        };
    }

    componentDidUpdate(prevProps) { //remove selected person if doesn't exist in filtered set
        if(this.props.selected && (this.props.filter !== prevProps.filter || this.props.search !== prevProps.search ) && this.getList(this.props.persons, this.props.search, this.props.sort).indexOf(this.props.selected) < 0) this.props.select(null);
    }

    render() {
        //console.log('RENDER PERSONS LIST');
        const {selected, persons, sort, search} = this.props;

        const finalListIds = this.getList(persons, search, sort);

        const searchTips = Object.keys(searchKeysShort).map(key => `${key}: for search in ${searchKeysShort[key].description}`).join('\n');

        const numOfPages = Math.ceil(finalListIds.length / TABLE_PAGE_SIZE_PERSON);

        return (
            <div className={'app-body'}>
                <Toolbox
                    add = {this.add}
                    show = {this.show}
                    edit = {this.edit}
                    addToBox = {this.addToBox}
                    searchTips = {searchTips}
                    search = {search}
                    selected = {selected}
                    setSearch = {this.props.setSearch}
                    setSort = {this.props.setSort}
                    page = {this.state.page + 1}
                    numOfPages = {numOfPages ? numOfPages : 0}
                    numOfRows = {finalListIds.length}
                    changePage = {this.changePage}
                />
                <Fragment>
                    {this.getHeader(PersonsColumnDef)}
                    <Scrollbars  className={'body-scroll-content people'} autoHide={true} autoHideTimeout={TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT} autoHideDuration={TABLE_SCROLLBARS_AUTO_HIDE_DURATION}>
                        {this.getTable(PersonsColumnDef, finalListIds, TABLE_PAGE_SIZE_PERSON, this.state.page)}
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

    getTable = (columnDef, sortedPersonIds, pageSize, page) => {
        return (
            <Table className={`table-body`}>
                <tbody style={{borderBottom: '1px solid #dee2e6'}}>
                {sortedPersonIds.filter((personId, i) => (i >= pageSize * page) && (i < pageSize * (page + 1))).map(personId => <tr className={this.props.selected === personId ? 'selected' : ''} onClick = {event => this.rowClickHandler(event, personId)} onDoubleClick={event => this.rowDoubleClickHandler(event, personId)} key={personId}>
                    {columnDef.map((column, key) =>
                        <td key={key} className={`${column.className}`}>
                            {this.getComputedField(column.field, this.props.persons[personId])}
                        </td>
                    )}
                </tr>)}
                </tbody>
            </Table>
        )
    };

    // ***************************************************
    // SEARCH AND SORT SOURCE LIST - MEMOIZE
    // ***************************************************
    getList = memoize((persons, search, sort) => {
        if(persons && Object.keys(persons).length) {
            //console.log(`GET LIST [${Object.keys(persons).length}] [${search}] [${sort}]`);
            const personIds = this.getIds(persons);
            const searchedPersonIds = this.searchList(persons, personIds, search, sort === 'search');
            return this.sortList(persons, searchedPersonIds, sort);
        } else return [];
    });

    getIds = memoize(persons => {
        //console.log('GET IDs');
        return Object.keys(persons);
    });

    searchList = memoize((persons, ids, search) => {
        //console.log(`SEARCH [${search}]`);
        if(search && search.trim()) {
            let keysModified = [...searchKeys];
            let tokenize = false;
            if(search.indexOf(':') > 1) {
                const index = search.trim().indexOf(':');
                const key = search.substring(0, index).trim();
                if(searchKeysShort[key]) {
                    keysModified = searchKeysShort[key].key;
                    if(!Array.isArray(keysModified)) keysModified = [keysModified];
                    search = search.substring(index + 1);
                }
            }
            let searchModified = search.trim().replace(/[^a-zA-Z ]/g, '');//.replace(/ +/g, '_');
            const data = ids.map(id => keysModified.reduce((mod, key) => ({...mod, [key]: this.getComputedField(key, persons[id], false, true)}) , {_id: id}));
            const fuse = new Fuse(data, {
                shouldSort: true,
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
        } else {
            return ids;
        }
    });

    sortList = memoize((persons, ids, sort) => {
        //console.log(`SORT [${sort}]`);
        if(!sort) {
            return ids.sort((a, b) => persons[b].created.localeCompare(persons[a].created)); //default sort - latest created first
        } else if(sort === 'search') {
            return ids; //keep order from search engine
        } else {
            return ids.sort((a, b) => {
                const down = sort.indexOf('-') === 0;
                let field = down ? sort.substr(1) : sort;
                if(['company'].indexOf(field) >= 0) field = `${field}-order`;
                let dataA = down ? this.getComputedField(field, persons[a], false, true) : this.getComputedField(field, persons[b], false, true);
                let dataB = down ? this.getComputedField(field, persons[b], false, true) : this.getComputedField(field, persons[a], false, true);
                if (typeof dataA === 'undefined' && typeof dataB === 'undefined') return 0;
                if (typeof dataA === 'undefined') return 1;
                if (typeof dataB === 'undefined') return 0;
                if (dataA === null) dataA = '';
                if (dataB === null) dataB = '';
                return dataA.localeCompare(dataB);
            })
        }
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
    rowClickHandler = (event, personId) => {
        if(typeof event.target.className === 'string' && event.target.className.indexOf('table-select') < 0 && event.target.className.indexOf('table-button') < 0) this.select(personId);
    };

    rowDoubleClickHandler = (event, personId) => {
        if(typeof event.target.className === 'string' && event.target.className.indexOf('table-select') < 0 && event.target.className.indexOf('table-button') < 0) event.altKey ? this.edit(personId, true) : this.show(personId, true);
    };

    handleSort = (sort) => {
        let result = this.props.search && this.props.search.trim() ? 'search' : '';
        if(this.props.sort.indexOf(sort) < 0) result = `-${sort}`;
        else if(this.props.sort === `-${sort}`) result = sort;
        this.props.setSort(result);
    };

    changePage = (page, absolute) => {
      if(absolute) this.setState({page: page});
      else this.setState({page: this.state.page + page});
    };

    // ***************************************************
    // COMPUTE FIELD
    // ***************************************************
    getComputedField(field, person, editable, searchable) {
        switch(field) {
            case 'contact':
                const contactsToTable = ['EMAIL', 'PHONE', 'MOBILE'];
                if(searchable) {
                    if (person && person.contact && person.contact.length > 0) {
                        return person.contact.map(contact => contact.data);
                    } else return '';
                } else {
                    if (person && person.contact && person.contact.length > 0) {
                        const contacts = person.contact
                            .filter(contact => ContactType[contact.type] && contactsToTable.indexOf(contact.type) >= 0)
                            .sort((a, b) => (ContactType[a.type] ? ContactType[a.type].sort : 1000) - (ContactType[b.type] ? ContactType[b.type].sort : 1000));
                        if(contacts.length > 0) {
                            return (
                                <div className={'table-contact'}>
                                    {contacts.map((contact, i) => <div key={i} className={'contact-item'}><FontAwesomeIcon icon={ContactType[contact.type].icon}/>{contact.data}</div>)}
                                </div>
                            )
                        } else return '---';
                    } else return '---';
                }
            case 'profession':
                if(searchable) {
                    if (person && person.profession && person.profession.length > 0) {
                        return person.profession.map(profession => PersonProfession[profession] ? PersonProfession[profession].label : '');
                    } else return '';
                } else {
                    if (person && person.profession && person.profession.length > 0) {
                        return person.profession.map(profession => PersonProfession[profession] ? PersonProfession[profession].label : '').join(', ');
                    } else return '---';
                }

            case 'company':
                if(searchable) {
                    if (person && person.company && person.company.length > 0) {
                        return person.company.map(companyId => this.props.companies[companyId] ? `${this.props.companies[companyId].name.replace(/ +/g, '_')}` : '').join(' ');
                    } else return '';
                } else {
                    if (person && person.company && person.company.length > 0) {
                        return person.company.map(companyId => this.props.companies[companyId] ? `${this.props.companies[companyId].name}` : '').join(', ');
                    } else return '---';
                }

            case 'company-order':
                if (person && person.company && person.company.length > 0) {
                    if(this.props.companies[person.company[0]]) return this.props.companies[person.company[0]].name;
                    else return 'zzzzzzzzz'
                } else return 'zzzzzzzzz';

            case 'project':
                if(searchable && this.props.projects) {
                    const projects = Object.keys(this.props.projects).filter(projectId => this.props.projects[projectId].person && this.props.projects[projectId].person.some(projectPerson => projectPerson.id === person._id));
                    return projects.map(projectId => `${this.props.projects[projectId].name.replace(/ +/g, '_')}${this.props.projects[projectId].alias ? ` ${this.props.projects[projectId].alias.replace(/ +/g, '_')}` : ''}`).join(' ');
                } else return '';

            default: return person && person[field] ? person[field] : '---';
        }
    }
}