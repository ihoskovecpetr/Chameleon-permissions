import React, {Fragment} from 'react';
import { Table } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input } from 'reactstrap';
import Fuse from 'fuse.js';

import * as Icons from '../../constants/Icons';

import * as ContactType from '../../constants/ContactType';
import * as CompanyBusiness from '../../constants/CompanyBusiness';

import {TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT, TABLE_SCROLLBARS_AUTO_HIDE_DURATION} from '../../constants/Constatnts';

import memoize from 'memoize-one';

import {CompaniesColumnDef} from '../../constants/TableColumnsDef';

const searchKeys = ['name', '$name', 'contact', 'business', 'person', 'project'];

export default class CompanyList extends React.PureComponent {

    componentDidUpdate(prevProps) { //remove selected company if doesn't exist in filtered set
        if(this.props.selected && (this.props.filter !== prevProps.filter || this.props.search !== prevProps.search ) && this.searchList(this.props.companies, this.filterList(this.props.companies, this.props.filter), this.props.search, searchKeys).indexOf(this.props.selected) < 0) this.props.select(null);
    }

    render() {
        //console.log('RENDER COMPANIES LIST');
        const {selected, companies, filter, sort, search} = this.props;

        const filteredCompanyIds = this.filterList(companies, filter);
        const searchedCompanyIds = this.searchList(companies, filteredCompanyIds, search, searchKeys);
        const sortedCompanyIds = this.sortList(companies, searchedCompanyIds, sort);

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
                    {this.getHeader(CompaniesColumnDef)}
                    <Scrollbars  className={'body-scroll-content companies'} autoHide={true} autoHideTimeout={TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT} autoHideDuration={TABLE_SCROLLBARS_AUTO_HIDE_DURATION}>
                        {this.getTable(CompaniesColumnDef, sortedCompanyIds)}
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

    getTable = (columnDef, sortedCompanyIds) => {
        return (
            <Table className={`table-body`}>
                <tbody style={{borderBottom: '1px solid #dee2e6'}}>
                {sortedCompanyIds.map(companyId => <tr className={this.props.selected === companyId ? 'selected' : ''} onClick = {event => this.rowClickHandler(event, companyId)} onDoubleClick={event => this.rowDoubleClickHandler(event, companyId)} key={companyId}>
                    {columnDef.map((column, i) =>
                        <td key={i} className={`${column.className}`}>
                            {this.getComputedField(column.field, this.props.companies[companyId])}
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
    filterList = memoize((companies, filter) => {
        //console.log('FILTER');
        return Object.keys(companies).map(id => id).filter(id => {
            const company = companies[id];
            //filter
            for(const f of filter) {
                switch (f) {
                }
            }
            return true;
        });
    });

    sortList = memoize((companies, ids, sort) => {
        //console.log('SORT');
        if(!sort) {
            return ids.sort((a, b) => companies[b].created.localeCompare(companies[a].created)); //default sort - latest created first
        } else {
            return ids.sort((a, b) => {
                const down = sort.indexOf('-') === 0;
                let field = down ? sort.substr(1) : sort;
                //if (field === 'status') field = 'status-order';
                let dataA = down ? this.getComputedField(field, companies[a], false, true) : this.getComputedField(field, companies[b], false, true);
                let dataB = down ? this.getComputedField(field, companies[b], false, true) : this.getComputedField(field, companies[a], false, true);
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
    rowClickHandler = (event, companyId) => {
        if(typeof event.target.className === 'string' && event.target.className.indexOf('table-select') < 0 && event.target.className.indexOf('table-button') < 0) this.select(companyId);
    };

    rowDoubleClickHandler = (event, companyId) => {
        if(typeof event.target.className === 'string' && event.target.className.indexOf('table-select') < 0 && event.target.className.indexOf('table-button') < 0) event.altKey ? this.edit(companyId, true) : this.show(companyId, true);
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
    getComputedField(field, company, editable, searchable) {
        switch(field) {
            case 'contact':
                const contactsToTable = ['EMAIL', 'PHONE', 'MOBILE'];
                if(searchable) {
                    if (company && company.contact && company.contact.length > 0) {
                        return company.contact.map(contact => contact.data);
                    } else return '';
                } else {
                    if (company && company.contact && company.contact.length > 0) {
                        const contacts = company.contact
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
            case 'business':
                if(searchable) {
                    if (company && company.business && company.business.length > 0) {
                        return company.business.map(business => CompanyBusiness[business] ? CompanyBusiness[business].label : '');
                    } else return '';
                } else {
                    if (company && company.business && company.business.length > 0) {
                        return company.business.map(business => CompanyBusiness[business] ? CompanyBusiness[business].label : '').join(', ');
                    } else return '---';
                }

            case 'person':
                if(searchable) {
                    if (company && company.person && company.person.length > 0) {
                        return company.person.map(personId => this.props.persons[personId] ? `${this.props.persons[personId].name.replace(/ +/g, '_')}` : '').join(' ');
                    } else return '';
                } else return '';

            case 'project':
                if(searchable && this.props.projects) {
                    const projects = Object.keys(this.props.projects).filter(projectId => this.props.projects[projectId].company && this.props.projects[projectId].company.some(projectCompany => projectCompany.id === company._id));
                    return projects.map(projectId => `${this.props.projects[projectId].name.replace(/ +/g, '_')}${this.props.projects[projectId].alias ? ` ${this.props.projects[projectId].alias.replace(/ +/g, '_')}` : ''}`).join(' ');
                } else return '';

            default: return company && company[field] ? company[field] : '---';
        }
    }
}