import React, {Fragment} from 'react';
import { Table } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Fuse from 'fuse.js';

import Toolbox from '../toolbox/ListToolbox';

import * as Icons from '../../constants/Icons';

import * as ContactType from '../../constants/ContactType';
import * as CompanyBusiness from '../../constants/CompanyBusiness';

import {TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT, TABLE_SCROLLBARS_AUTO_HIDE_DURATION, TABLE_PAGE_SIZE_COMPANY} from '../../constants/Constatnts';

import memoize from 'memoize-one';

import {CompaniesColumnDef} from '../../constants/TableColumnsDef';

//const searchKeys = ['name', '$name', 'contact', 'business', 'person', 'project'];
const searchKeys = ['name', '$name', 'person', 'business'];
const searchKeysShort = {
    name: {key: ['name', '$name'], description: `company names`},
    person: {key: 'person', description: `company persons`},
    business: {key: 'business', description: `company business`},
    contact: {key: 'contact', description: `company contacts (*)`},
    project: {key: 'project', description: `projects participated by company on (*)`}
};

export default class CompanyList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            page: 0
        };
    }

    componentDidUpdate(prevProps) { //remove selected company if doesn't exist in filtered set
        if(this.props.selected && (this.props.filter !== prevProps.filter || this.props.search !== prevProps.search ) && this.getList(this.props.companies, this.props.search, this.props.sort).indexOf(this.props.selected) < 0) this.props.select(null);
    }

    render() {
        //console.log('RENDER COMPANIES LIST');
        const {selected, companies, sort, search} = this.props;

        const finalListIds = this.getList(companies, search, sort);

        const searchTips = Object.keys(searchKeysShort).map(key => `${key}: for search in ${searchKeysShort[key].description}`).join('\n');

        const numOfPages = Math.ceil(finalListIds.length / TABLE_PAGE_SIZE_COMPANY);

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
                    numOfPages = {numOfPages}
                    numOfRows = {finalListIds.length}
                    changePage = {this.changePage}
                />
                <Fragment>
                    {this.getHeader(CompaniesColumnDef)}
                    <Scrollbars  className={'body-scroll-content companies'} autoHide={true} autoHideTimeout={TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT} autoHideDuration={TABLE_SCROLLBARS_AUTO_HIDE_DURATION}>
                        {this.getTable(CompaniesColumnDef, finalListIds, TABLE_PAGE_SIZE_COMPANY, this.state.page)}
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

    getTable = (columnDef, sortedCompanyIds, pageSize, page) => {
        return (
            <Table className={`table-body`}>
                <tbody style={{borderBottom: '1px solid #dee2e6'}}>
                {sortedCompanyIds.filter((companyId, i) => (i >= pageSize * page) && (i < pageSize * (page + 1))).map(companyId => <tr className={this.props.selected === companyId ? 'selected' : ''} onClick = {event => this.rowClickHandler(event, companyId)} onDoubleClick={event => this.rowDoubleClickHandler(event, companyId)} key={companyId}>
                    {columnDef.map((column, key) =>
                        <td key={key} className={`${column.className}`}>
                            {this.getComputedField(column.field, this.props.companies[companyId])}
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
    getList = memoize((companies, search, sort) => {
        if(companies && Object.keys(companies).length) {
            //console.log(`GET LIST [${Object.keys(companies).length}] [${search}] [${sort}]`);
            const companyIds = this.getIds(companies);
            const searchedCompanyIds = this.searchList(companies, companyIds, search, sort === 'search');
            return this.sortList(companies, searchedCompanyIds, sort);
        } else return [];
    });

    getIds = memoize(companies => {
        //console.log('GET IDs');
        return Object.keys(companies)
    });

    searchList = memoize((companies, ids, search) => {
        //console.log('SEARCH');
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
            const data = ids.map(id => keysModified.reduce((mod, key) => ({...mod, [key]: this.getComputedField(key, companies[id], false, true)}) , {_id: id}));
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

    sortList = memoize((companies, ids, sort) => {
        //console.log(`SORT [${sort}]`);
        if(!sort) {
            return ids.sort((a, b) => companies[b].created.localeCompare(companies[a].created)); //default sort - latest created first
        } else if(sort === 'search') {
            return ids; //keep order from search engine
        } else {
            return ids.sort((a, b) => {
                const down = sort.indexOf('-') === 0;
                const field = down ? sort.substr(1) : sort;

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