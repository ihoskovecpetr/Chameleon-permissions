import React, {Fragment} from 'react';
import { Table } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input } from 'reactstrap';
import Fuse from 'fuse.js';

import memoize from 'memoize-one';

const ICON_SORT = 'arrows-alt-v'; //sort
const ICON_SORT_UP = 'long-arrow-alt-up'; //sort-up
const ICON_SORT_DOWN = 'long-arrow-alt-down'; //sort-down

const ICON_SEARCH = 'search';
const ICON_CLEAR = 'times';

const ICON_BOX = 'box-open';


import {PeopleColumnDef} from '../../constants/TableColumnsDef';

export default class PeopleList extends React.PureComponent {

    componentDidUpdate(prevProps) { //remove selected person if doesn't exist in filtered set
        if(this.props.selectedPerson && (this.props.filter !== prevProps.filter || this.props.search !== prevProps.search ) && this.searchList(this.props.people, this.filterList(this.props.people, this.props.filter), this.props.search).indexOf(this.props.selectedPerson) < 0) this.props.selectPerson(null);
    }

    render() {
        //console.log('RENDER PEOPLE LIST');
        const {selectedPerson, people, filter, sort, search} = this.props;

        const filteredPersonIds = this.filterList(people, filter);
        const searchedPersonIds = this.searchList(people, filteredPersonIds, search);
        const sortedPersonIds = this.sortList(people, searchedPersonIds, sort);

        return (
            <div className={'app-body'}>
                <div className={'app-toolbox'}>
                    <div className={'inner-container space'}>
                        <div className={'toolbox-group'}>
                            <div onClick={this.addPerson} className={'tool-box-button green'}>{'New'}</div>
                            <div onClick={selectedPerson ? () => this.showPerson() : undefined} className={`tool-box-button${selectedPerson ? '' : ' disabled'}`}>{'Show'}</div>
                            <div onClick={selectedPerson ? () => this.editPerson() : undefined} className={`tool-box-button${selectedPerson ? '' : ' disabled'}`}>{'Edit'}</div>
                            <div onClick={selectedPerson ? this.addToBox : undefined} className={`tool-box-button icon box blue${selectedPerson ? '' : ' disabled'}`}><FontAwesomeIcon icon={ICON_BOX}/></div>
                        </div>
                    </div>
                    <div className={'inner-container flex'}>
                        <div className={'toolbox-group right-auto'}>
                            <div className={'tool-box-search-container'}>
                                <div className={'icon search'}><FontAwesomeIcon icon={ICON_SEARCH}/></div>
                                <Input value={search} onChange={this.searchInputHandler} className={`input-search`}/>
                                <div className={'icon clear'} onClick={this.clearSearchInputHanler}><FontAwesomeIcon icon={ICON_CLEAR}/></div>
                            </div>
                        </div>
                    </div>
                </div>
                <Fragment>
                    {this.getHeader(PeopleColumnDef)}
                    <Scrollbars autoHide={true} autoHideTimeout={800} autoHideDuration={200}>
                        {this.getTable(PeopleColumnDef, sortedPersonIds)}
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

    getTable = (columnDef, sortedPersonIds) => {
        return (
            <Table className={`table-body`}>
                <tbody style={{borderBottom: '1px solid #dee2e6'}}>
                {sortedPersonIds.map(personId => <tr className={this.props.selectedPerson === personId ? 'selected' : ''} onClick = {event => this.rowClickHandler(event, personId)} onDoubleClick={event => this.rowDoubleClickHandler(event, personId)} key={personId}>
                    {columnDef.map((column, i) =>
                        <td key={i} className={`${column.className}`}>
                            {this.getComputedField(column.field, this.props.people[personId])}
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
    filterList = memoize((people, filter) => {
        //console.log('FILTER');
        return Object.keys(people).map(id => id).filter(id => {
            const person = people[id];
            //filter
            for(const f of filter) {
                switch (f) {
                }
            }
            return true;
        });
    });

    sortList = memoize((people, ids, sort) => {
        //console.log('SORT');
        if(!sort) {
            return ids.sort((a, b) => people[b].created.localeCompare(people[a].created)); //default sort - latest created first
        } else {
            return ids.sort((a, b) => {
                const down = sort.indexOf('-') === 0;
                let field = down ? sort.substr(1) : sort;
                //if (field === 'status') field = 'status-order';
                let dataA = down ? this.getComputedField(field, people[a]) : this.getComputedField(field, people[b]);
                let dataB = down ? this.getComputedField(field, people[b]) : this.getComputedField(field, people[a]);
                if (typeof dataA === 'undefined' && typeof dataB === 'undefined') return 0;
                if (typeof dataA === 'undefined') return 1;
                if (typeof dataB === 'undefined') return 0;
                if (dataA === null) dataA = '';
                if (dataB === null) dataB = '';
                return dataA.localeCompare(dataB);
            })
        }
    });

    searchList = memoize((people, ids, search) => {
        //console.log('SEARCH');
        if(search && search.trim()) {
            const data = ids.map(id => {
                return {
                    _id: people[id]._id,
                    name: people[id].name,
                    $name: people[id].$name,
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
    selectPerson = (id) => {
        this.props.selectPerson(id);
    };

    addPerson = () => {
        this.props.addPerson();
    };

    showPerson = (id) => {
        this.props.showPerson(id);
    };

    editPerson = (id) => {
        this.props.editPerson(id);
    };

    addToBox = () => {
        if(this.props.selectedPerson) this.props.addToBox(this.props.selectedPerson);
    };

    // ***************************************************
    // HANDLERS
    // ***************************************************
    rowClickHandler = (event, personId) => {
        if(typeof event.target.className === 'string' && event.target.className.indexOf('table-select') < 0 && event.target.className.indexOf('table-button') < 0) this.selectPerson(personId);
    };

    rowDoubleClickHandler = (event, personId) => {
        if(typeof event.target.className === 'string' && event.target.className.indexOf('table-select') < 0 && event.target.className.indexOf('table-button') < 0) event.altKey ? this.editPerson(personId) : this.showPerson(personId);
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
    getComputedField(field, person) {
        switch(field) {

            default: return person && person[field] ? person[field] : '---';
        }
    }
}