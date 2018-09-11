import React, {Fragment} from 'react';
import { Table } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input } from 'reactstrap';
import Fuse from 'fuse.js';

import * as Icons from '../../constants/Icons';

import memoize from 'memoize-one';

import {CompaniesColumnDef} from '../../constants/TableColumnsDef';

export default class CompaniesList extends React.PureComponent {

    componentDidUpdate(prevProps) { //remove selected company if doesn't exist in filtered set
        if(this.props.selectedCompany && (this.props.filter !== prevProps.filter || this.props.search !== prevProps.search ) && this.searchList(this.props.companies, this.filterList(this.props.companies, this.props.filter), this.props.search).indexOf(this.props.selectedCompany) < 0) this.props.selectPerson(null);
    }

    render() {
        //console.log('RENDER COMPANIES LIST');
        const {selectedCompany, companies, filter, sort, search} = this.props;

        const filteredCompanyIds = this.filterList(companies, filter);
        const searchedCompanyIds = this.searchList(companies, filteredCompanyIds, search);
        const sortedCompanyIds = this.sortList(companies, searchedCompanyIds, sort);

        return (
            <div className={'app-body'}>
                <div className={'app-toolbox'}>
                    <div className={'inner-container space'}>
                        <div className={'toolbox-group'}>
                            <div onClick={this.addCompany} className={'tool-box-button green'}>{'New'}</div>
                            <div onClick={selectedCompany ? () => this.showCompany() : undefined} className={`tool-box-button${selectedCompany ? '' : ' disabled'}`}>{'Show'}</div>
                            <div onClick={selectedCompany ? () => this.editCompany() : undefined} className={`tool-box-button${selectedCompany ? '' : ' disabled'}`}>{'Edit'}</div>
                            <div onClick={selectedCompany ? this.addToBox : undefined} className={`tool-box-button blue${selectedCompany ? '' : ' disabled'}`}><FontAwesomeIcon icon={Icons.ICON_BOX_ARROW}/><FontAwesomeIcon icon={Icons.ICON_BOX}/></div>
                        </div>
                    </div>
                    <div className={'inner-container flex'}>
                        <div className={'toolbox-group right-auto'}>
                            <div className={'tool-box-search-container'}>
                                <div className={'icon search'}><FontAwesomeIcon icon={Icons.ICON_SEARCH}/></div>
                                <Input value={search} onChange={this.searchInputHandler} className={`input-search`}/>
                                <div className={'icon clear'} onClick={this.clearSearchInputHanler}><FontAwesomeIcon icon={Icons.ICON_SEARCH_CLEAR}/></div>
                            </div>
                        </div>
                    </div>
                </div>
                <Fragment>
                    {this.getHeader(CompaniesColumnDef)}
                    <Scrollbars autoHide={true} autoHideTimeout={800} autoHideDuration={200}>
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
                {sortedCompanyIds.map(companyId => <tr className={this.props.selectedCompany === companyId ? 'selected' : ''} onClick = {event => this.rowClickHandler(event, companyId)} onDoubleClick={event => this.rowDoubleClickHandler(event, companyId)} key={companyId}>
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
                let dataA = down ? this.getComputedField(field, companies[a]) : this.getComputedField(field, companies[b]);
                let dataB = down ? this.getComputedField(field, companies[b]) : this.getComputedField(field, companies[a]);
                if (typeof dataA === 'undefined' && typeof dataB === 'undefined') return 0;
                if (typeof dataA === 'undefined') return 1;
                if (typeof dataB === 'undefined') return 0;
                if (dataA === null) dataA = '';
                if (dataB === null) dataB = '';
                return dataA.localeCompare(dataB);
            })
        }
    });

    searchList = memoize((companies, ids, search) => {
        //console.log('SEARCH');
        if(search && search.trim()) {
            const data = ids.map(id => {
                return {
                    _id: companies[id]._id,
                    name: companies[id].name,
                    $name: companies[id].$name,
                }
            });
            const fuse = new Fuse(data, {
                verbose: false,
                id: '_id',
                findAllMatches: true,
                keys: ['name', '$name']
            });
            return fuse.search(search.trim());
        } else return ids;
    });

    // ***************************************************
    // ROUTING
    // ***************************************************
    selectCompany = (id) => {
        this.props.selectCompany(id);
    };

    addCompany = () => {
        this.props.addCompany();
    };

    showCompany = (id) => {
        this.props.showCompany(id);
    };

    editCompany = (id) => {
        this.props.editCompany(id);
    };

    addToBox = () => {
        if(this.props.selectedCompany) this.props.addToBox(this.props.selectedCompany);
    };

    // ***************************************************
    // HANDLERS
    // ***************************************************
    rowClickHandler = (event, companyId) => {
        if(typeof event.target.className === 'string' && event.target.className.indexOf('control-select') < 0 && event.target.className.indexOf('table-button') < 0) this.selectCompany(companyId);
    };

    rowDoubleClickHandler = (event, companyId) => {
        if(typeof event.target.className === 'string' && event.target.className.indexOf('control-select') < 0 && event.target.className.indexOf('table-button') < 0) event.altKey ? this.editCompany(companyId) : this.showCompany(companyId);
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

    // ***************************************************
    // COMPUTE FIELD
    // ***************************************************
    getComputedField(field, company) {
        switch(field) {

            default: return company && company[field] ? company[field] : '---';
        }
    }
}