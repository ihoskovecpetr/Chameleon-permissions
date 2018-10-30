import React, {Fragment} from 'react';
import { Table } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input } from 'reactstrap';
import Fuse from 'fuse.js';

import * as Icons from '../../constants/Icons';

import * as ContactType from '../../constants/ContactType';
import * as PersonProfession from '../../constants/PersonProfession';

import {TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT, TABLE_SCROLLBARS_AUTO_HIDE_DURATION} from '../../constants/Constatnts';

import memoize from 'memoize-one';

import {PersonsColumnDef} from '../../constants/TableColumnsDef';

const searchKeys = ['name', '$name', 'contact', 'profession', 'company', 'project'];

export default class PersonList extends React.PureComponent {

    componentDidUpdate(prevProps) { //remove selected person if doesn't exist in filtered set
        if(this.props.selected && (this.props.filter !== prevProps.filter || this.props.search !== prevProps.search ) && this.searchList(this.props.persons, this.filterList(this.props.persons, this.props.filter), this.props.search, searchKeys).indexOf(this.props.selected) < 0) this.props.select(null);
    }

    render() {
        //console.log('RENDER PERSONS LIST');
        const {selected, persons, filter, sort, search} = this.props;

        const filteredPersonIds = this.filterList(persons, filter);
        const searchedPersonIds = this.searchList(persons, filteredPersonIds, search, searchKeys);
        const sortedPersonIds = this.sortList(persons, searchedPersonIds, sort);

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
                    </div>
                </div>
                <Fragment>
                    {this.getHeader(PersonsColumnDef)}
                    <Scrollbars autoHide={true} autoHideTimeout={TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT} autoHideDuration={TABLE_SCROLLBARS_AUTO_HIDE_DURATION}>
                        {this.getTable(PersonsColumnDef, sortedPersonIds)}
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

    getTable = (columnDef, sortedPersonIds) => {
        return (
            <Table className={`table-body`}>
                <tbody style={{borderBottom: '1px solid #dee2e6'}}>
                {sortedPersonIds.map(personId => <tr className={this.props.selected === personId ? 'selected' : ''} onClick = {event => this.rowClickHandler(event, personId)} onDoubleClick={event => this.rowDoubleClickHandler(event, personId)} key={personId}>
                    {columnDef.map((column, i) =>
                        <td key={i} className={`${column.className}`}>
                            {this.getComputedField(column.field, this.props.persons[personId])}
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
    filterList = memoize((persons, filter) => {
        //console.log('FILTER');
        return Object.keys(persons).map(id => id).filter(id => {
            const person = persons[id];
            //filter
            for(const f of filter) {
                switch (f) {
                }
            }
            return true;
        });
    });

    sortList = memoize((persons, ids, sort) => {
        //console.log('SORT');
        if(!sort) {
            return ids.sort((a, b) => persons[b].created.localeCompare(persons[a].created)); //default sort - latest created first
        } else {
            return ids.sort((a, b) => {
                let down = sort.indexOf('-') === 0;
                let field = down ? sort.substr(1) : sort;
                //if(['last-contact'].indexOf(field) >= 0) down = !down;
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
    /*
    searchList = memoize((projects, ids, search, keys) => {
        //console.log('SEARCH');
        if(search && search.trim()) {
            const data = ids.map(id => keys.reduce((mod, key) => ({...mod, [key]: this.getComputedField(key, projects[id], false, true)}) , {_id: id}));
            const fuse = new Fuse(data, {
                verbose: false,
                id: '_id',
                findAllMatches: true,
                keys: keys
            });
            return fuse.search(search.trim());
        } else return ids;
    });
    */
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
    rowClickHandler = (event, personId) => {
        if(typeof event.target.className === 'string' && event.target.className.indexOf('table-select') < 0 && event.target.className.indexOf('table-button') < 0) this.select(personId);
    };

    rowDoubleClickHandler = (event, personId) => {
        if(typeof event.target.className === 'string' && event.target.className.indexOf('table-select') < 0 && event.target.className.indexOf('table-button') < 0) event.altKey ? this.edit(personId, true) : this.show(personId, true);
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