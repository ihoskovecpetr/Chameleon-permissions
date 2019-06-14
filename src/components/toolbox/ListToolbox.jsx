import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as Icons from "../../constants/Icons";
import React, {Fragment} from "react";
import { Input } from 'reactstrap';
import Tooltip from "rc-tooltip";
import * as FilterTypes from "../../constants/FilterTypes";
import * as KeyboardShortcut from "../../constants/KeyboardShortcuts";

export default class PersonDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            removeArmed: false,
        };
        this.keyboard = [
            {...KeyboardShortcut.NEW, command: this.add},
            {...KeyboardShortcut.SHOW, command: this.show},
            {...KeyboardShortcut.EDIT, command: this.edit},
            {...KeyboardShortcut.ADD_BOX, command: this.addToBox},
            {...KeyboardShortcut.FILTER_MY, command: this.userFilterHandler, keep: 'projects'},
            {...KeyboardShortcut.FILTER_MY, command: this.userFilterHandler, keep: 'bids'},
            {...KeyboardShortcut.FILTER_ACTIVE, command: this.activeFilterHandler, keep: 'projects'},
            {...KeyboardShortcut.FILTER_AWARDED, command: this.awardedFilterHandler, keep: 'projects'},
            {...KeyboardShortcut.FILTER_ACTIVE, command: this.activeBidsFilterHandler, keep: 'bids'},
            {...KeyboardShortcut.FILTER_BIDS, command: this.toggleActiveBidMode, keep: 'projects'},
            {...KeyboardShortcut.FILTER_BIDS, command: this.toggleActiveBidMode, keep: 'bids'}
        ];
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    render() {
        const {selected, searchTips, search, activeBid, filter} = this.props;
        const useFilters = typeof filter !== 'undefined';
        const keep = useFilters ? activeBid ? 'bids' : 'projects' : null;
        const keyboardHints = this.keyboard.filter(key => !key.keep || key.keep === keep).map(key => `${key.keys.map(key => key.description).join(', ')}: ${key.name}`).join('\n');

        const userFilter = useFilters ? filter.indexOf(FilterTypes.USER_FILTER) >= 0 : undefined;
        const activeFilter = useFilters ? filter.indexOf(FilterTypes.ACTIVE_PROJECTS_FILTER) >= 0 || filter.indexOf(FilterTypes.NON_ACTIVE_PROJECTS_FILTER) >= 0 : undefined;
        const activeFilterReversed = useFilters ? filter.indexOf(FilterTypes.NON_ACTIVE_PROJECTS_FILTER) >= 0 : undefined;
        const awardedFilter = useFilters ? filter.indexOf(FilterTypes.AWARDED_PROJECTS_FILTER) >= 0 || filter.indexOf(FilterTypes.NOT_AWARDED_PROJECTS_FILTER) >= 0 : undefined;
        const awardFilterReversed = useFilters ? filter.indexOf(FilterTypes.NOT_AWARDED_PROJECTS_FILTER) >= 0 : undefined;

        const activeBidsFilter = useFilters ? filter.indexOf(FilterTypes.ACTIVE_BIDS_FILTER) >= 0 || filter.indexOf(FilterTypes.NON_ACTIVE_BIDS_FILTER) >= 0 : undefined;
        const activeBidsFilterReversed = useFilters ? filter.indexOf(FilterTypes.NON_ACTIVE_BIDS_FILTER) >= 0 : undefined;

        return (
            <div className={'app-toolbox'}>
                <div className={'inner-container space'}>
                    <div className={'toolbox-group'}>
                        <div onClick={this.add} className={'tool-box-button green'}>{'New'}</div>
                        <div onClick={selected ? this.show : undefined} className={`tool-box-button${selected ? '' : ' disabled'}`}>{'Show'}</div>
                        <div onClick={selected ? this.edit : undefined} className={`tool-box-button orange${selected ? '' : ' disabled'}`}>{'Edit'}</div>
                        <div onClick={selected ? this.addToBox : undefined} className={`tool-box-button blue${selected ? '' : ' disabled'}`}><FontAwesomeIcon icon={Icons.ICON_BOX_ARROW}/><FontAwesomeIcon icon={Icons.ICON_BOX}/></div>
                        <div className={'toolbox-pages'}>
                            <FontAwesomeIcon icon={Icons.ICON_PAGE_PREV} onClick={this.props.page > 1 ? event => this.pageDown(event) : undefined} className={`arrow left${this.props.page <= 1 ? ' disabled' : ''}`}>{'<'}</FontAwesomeIcon>
                            <FontAwesomeIcon icon={Icons.ICON_PAGE_NEXT} onClick={this.props.page < this.props.numOfPages ? event => this.pageUp(event, this.props.numOfPages) : undefined} className={`arrow right${this.props.page >= this.props.numOfPages ? ' disabled' : ''}`}>{'>'}</FontAwesomeIcon>
                            <span>{`${this.props.page}/${this.props.numOfPages} [${this.props.numOfRows ? this.props.numOfRows : '-'}]`}</span>
                        </div>
                    </div>
                </div>
                <div className={'inner-container flex'}>
                    <div className={'toolbox-group right-auto'}>
                        <div className={'tool-box-search-container'}>
                            <Tooltip placement={"bottomLeft"} overlay={<span>{searchTips}</span>}>
                                <div className={'icon search'}><FontAwesomeIcon icon={Icons.ICON_SEARCH}/></div>
                            </Tooltip>
                            <Input value={search} onChange={this.searchInputHandler} className={`input-search`}/>
                            <div className={'icon clear'} onClick={this.clearSearchInputHandler}><FontAwesomeIcon icon={Icons.ICON_SEARCH_CLEAR}/></div>
                        </div>
                        <Tooltip placement={"bottomLeft"} overlay={<span>{keyboardHints}</span>}>
                            <div className={'icon-keyboard'}><FontAwesomeIcon icon={Icons.ICON_KEYBOARD_SHORTCUTS}/></div>
                        </Tooltip>
                    </div>
                </div>

                {/* ------------------ FILTER SWITCHES ------------------ */}
                {useFilters ? <div className={'toolbox-group'}>
                    <div onClick={this.userFilterHandler} className={`tool-box-button-switch${userFilter ? ' checked' : ''}`}><FontAwesomeIcon className={'check'} icon={userFilter ? Icons.ICON_CHECKBOX_FILTER_CHECKED : Icons.ICON_CHECKBOX_FILTER_UNCHECKED}/><span className={`text`}>{'My'}</span></div>

                    {activeBid ?
                        <div onClick={event => this.activeBidsFilterHandler(event, false)} className={`tool-box-button-switch${activeBidsFilter ?  activeBidsFilterReversed ? ' reversed' : ' checked' : ''}`}><FontAwesomeIcon onClick={event => this.activeBidsFilterHandler(event, true)} className={'check'} icon={activeBidsFilter ? Icons.ICON_CHECKBOX_FILTER_CHECKED : Icons.ICON_CHECKBOX_FILTER_UNCHECKED}/><span className={`text${activeBidsFilterReversed ? ' reversed' : ''}`}>{'Active'}</span></div>
                        :
                        <Fragment>
                            <div onClick={event => this.activeFilterHandler(event, false)} className={`tool-box-button-switch${activeFilter ?  activeFilterReversed ? ' reversed' : ' checked' : ''}`}><FontAwesomeIcon onClick={event => this.activeFilterHandler(event, true)} className={'check'} icon={activeFilter ? Icons.ICON_CHECKBOX_FILTER_CHECKED : Icons.ICON_CHECKBOX_FILTER_UNCHECKED}/><span className={`text${activeFilterReversed ? ' reversed' : ''}`}>{'Active'}</span></div>
                            <div onClick={event => this.awardedFilterHandler(event, false)} className={`tool-box-button-switch${awardedFilter ? awardFilterReversed ? ' reversed ' : ' checked' : ''}`}><FontAwesomeIcon onClick={event => this.awardedFilterHandler(event, true)} className={'check'} icon={awardedFilter ? Icons.ICON_CHECKBOX_FILTER_CHECKED : Icons.ICON_CHECKBOX_FILTER_UNCHECKED}/><span className={`text${awardFilterReversed ? ' reversed' : ''}`}>{'Awarded'}</span></div>
                        </Fragment>
                    }
                    {/* BID SWITCH */}
                    <div onClick={this.toggleActiveBidMode} className={`tool-box-button-switch${activeBid ? ' checked' : ''}`}><FontAwesomeIcon className={'check'} icon={activeBid ? Icons.ICON_CHECKBOX_FILTER_CHECKED : Icons.ICON_CHECKBOX_FILTER_UNCHECKED}/><span className={`text`}>{'Bids'}</span></div>
                </div> : null}
            </div>
        );
    }
    // *****************************************************************************************************************
    // CLOSE, EDIT, REMOVE
    // *****************************************************************************************************************
    close = () => {
        this.props.returnToPreviousView();
    };

    edit = () => {
        if(this.props.editable || true) this.props.edit(this.props.selected);
    };

    remove = () => {
        if(this.props.editable) this.props.remove();
        this.close();
    };

    // *****************************************************************************************************************
    // HELPERS
    // *****************************************************************************************************************
    add = () => {
      this.props.add();
    };

    show = () => {
        if(this.props.selected) this.props.show(this.props.selected);
    };

    edit = () => {
        if(this.props.selected) this.props.edit(this.props.selected);
    };

    addToBox = () => {
        if(this.props.selected) this.props.addToBox(this.props.selected);
    };

    searchInputHandler = (event) => {
        if(event.target.value) this.props.setSort('search');
        else this.props.setSort('');
        this.props.setSearch(event.target.value);
        if((this.props.search ? this.props.search.trim() : '') !== event.target.value.trim()) this.props.changePage(0, true);
    };

    clearSearchInputHandler = () => {
        this.props.setSort('');
        this.props.setSearch('');
        if(this.props.search) this.props.changePage(0, true);
    };

    toggleActiveBidMode = () => {
        this.props.setActiveBid(!this.props.activeBid)
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

    activeBidsFilterHandler = (event, check) => {
        if(check) event.stopPropagation();
        if (this.props.filter.indexOf(FilterTypes.ACTIVE_BIDS_FILTER) >= 0) {
            this.props.setFilter(FilterTypes.ACTIVE_BIDS_FILTER, false);
            if(!check) this.props.setFilter(FilterTypes.NON_ACTIVE_BIDS_FILTER, true);
        }
        else if (this.props.filter.indexOf(FilterTypes.NON_ACTIVE_BIDS_FILTER) >= 0) this.props.setFilter(FilterTypes.NON_ACTIVE_BIDS_FILTER, false);
        else this.props.setFilter(FilterTypes.ACTIVE_BIDS_FILTER, true);
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

    handleKeyDown = event => {
        const keep = typeof this.props.filter !== 'undefined' ? this.props.activeBid ? 'bids' : 'projects' : null;
        for(const shortcut of this.keyboard.filter(key => !key.keep || key.keep === keep)) {
            for(const key of shortcut.keys) if(event.which === key.keyCode && key.ctrl === event.ctrlKey && key.alt === event.altKey && key.shift === event.shiftKey) shortcut.command();
        }
    };

    pageDown = event => {
        if(event.shiftKey) this.props.changePage(0, true);
        else this.props.changePage(-1);
    };

    pageUp = (event, numOfPages) => {
        if(event.shiftKey) this.props.changePage(numOfPages - 1, true);
        else this.props.changePage(1);
    };
}