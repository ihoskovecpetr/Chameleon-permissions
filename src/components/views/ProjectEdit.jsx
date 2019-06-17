import React, {Fragment} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Scrollbars } from 'react-custom-scrollbars';
import { Input } from 'reactstrap';
import Textarea from 'react-textarea-autosize';

import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import moment from 'moment';
import areEquivalent from '../../lib/compareObjects';
import DatePicker from 'react-datepicker';
import * as Constants from '../../constants/Constatnts';

import * as CompanyFlag from '../../constants/CompanyFlag';
import * as PersonFlag from '../../constants/PersonFlag';
import * as CompanyBusiness from '../../constants/CompanyBusiness';
import * as PersonProfession from '../../constants/PersonProfession';
import * as ProjectClientTiming from '../../constants/ProjectClientTiming';
import * as StringFormatter from '../../lib/stringFormatHelper';

import Toolbox from '../toolbox/EditToolbox';

import * as Icons from '../../constants/Icons';

import * as ProjectStatus from '../../constants/ProjectStatus';
import * as TeamRole from '../../constants/TeamRole';
import * as VipTag from '../../constants/VipTag';

import memoize from 'memoize-one';

const statusOptions = Object.keys(ProjectStatus).filter(key => !ProjectStatus[key].virtual).map(key => ({value: ProjectStatus[key].id, label: ProjectStatus[key].label}));
const timingOptions = [{value: ProjectClientTiming.GO_AHEAD.id, label: ProjectClientTiming.GO_AHEAD.label}]//Object.keys(ProjectClientTiming).map(key => ({value: ProjectClientTiming[key].id, label: ProjectClientTiming[key].label}));

export default class ProjectEdit extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            saveDisabled: true,
            validation: {},
            removeArmed: false
        };
        this.validationTimer = null;
        this.lastValidation = 0;
        this.today = moment().startOf('day');
    }

    componentDidMount() {
        this.checkJustAddedObject();
        this.checkValidity();
    }

    componentWillUpdate() {
        //console.log('WILL UPDATE');
        //console.time('UPDATE');
    }

    componentDidUpdate(prevProps) {
        //console.log('DID UPDATE');
        if(this.props.editedData !== prevProps.editedData || this.props.projects !== prevProps.projects) this.checkValidity();
        //console.timeEnd('UPDATE');
    }

    componentWillUnmount() {
        if(this.validationTimer) clearTimeout(this.validationTimer);
    }

    render() {
        //console.log('RENDER');
        const {project, editedData, projects, companies, persons, users} = this.props;

        const name = editedData.name !== undefined ? editedData.name : project ? project.name : '';
        const alias = editedData.alias !== undefined ? editedData.alias : project ? project.alias : '';
        let status = editedData.status !== undefined ? editedData.status : project && project.status ? project.status : null;
        // .............................................................................................................
        let altStatus = null;
        let altText = '';
        if(status && ProjectStatus[status] && (ProjectStatus[status].virtual || ProjectStatus[status].alt)) {
            if(ProjectStatus[status].virtual) {
                status = Object.keys(ProjectStatus).find(s => ProjectStatus[s].alt === status);
                if(status) {
                    altStatus = true;
                    altText = ProjectStatus[status].altTxt;
                } else status = null;
            } else if(ProjectStatus[status].alt) {
                altStatus = false;
                altText = ProjectStatus[status].altTxt;
            }
        }
        // .............................................................................................................
        const statusNote = editedData.statusNote !== undefined ? editedData.statusNote : project && project.statusNote ? project.statusNote : '';
        const company = editedData.company !== undefined ? editedData.company : project && project.company ? project.company : [];
        const person = editedData.person !== undefined ? editedData.person : project && project.person ? project.person : [];
        const team = editedData.team !== undefined ? editedData.team : project && project.team ? project.team : [];
        const timing = editedData.timing !== undefined ? editedData.timing : project && project.timing ? project.timing : [];
        const lastContact = editedData.lastContact !== undefined ? editedData.lastContact ? moment(editedData.lastContact) : null : project && project.lastContact ? moment(project.lastContact) : null;
        const inquired = editedData.inquired !== undefined ? editedData.inquired ? moment(editedData.inquired) : null : project && project.inquired ? moment(project.inquired) : null;

        const projectNote = editedData.projectNote !== undefined ? editedData.projectNote : project && project.projectNote ? project.projectNote : '';
        const story = editedData.story !== undefined ? editedData.story : project && project.story ? project.story : '';

        const ballparkFrom = editedData.budget !== undefined ? editedData.budget.ballpark.from ? editedData.budget.ballpark.from : '' : project && project.budget ? project.budget.ballpark.from ? project.budget.ballpark.from : '' : '';
        const ballparkTo = editedData.budget !== undefined ? editedData.budget.ballpark.to ? editedData.budget.ballpark.to : '' : project && project.budget ? project.budget.ballpark.to ? project.budget.ballpark.to : '' : '';
        const ballparkCurrency = editedData.budget !== undefined ? editedData.budget.ballpark.currency ? editedData.budget.ballpark.currency : 'eur' : project && project.budget ? project.budget.ballpark.currency ? project.budget.ballpark.currency : 'eur' : 'eur';

        const vipTag = editedData.vipTag !== undefined ? editedData.vipTag : project && project.vipTag ? project.vipTag : [];
        const vipTagNote = editedData.vipTagNote !== undefined ? editedData.vipTagNote : project && project.vipTagNote ? project.vipTagNote : '';

        if(Object.keys(editedData).length === 0) {
            team.sort((a, b) => (a.role.map(role => TeamRole[role] ? TeamRole[role].sort : 100).reduce((a, b) => Math.min(a, b), 100)) - (b.role.map(role => TeamRole[role] ? TeamRole[role].sort : 100).reduce((a, b) => Math.min(a, b), 100)));
            timing.sort((a, b) => 0);
            company.sort((a, b) => (a.flag.map(flag => CompanyFlag[flag] ? CompanyFlag[flag].sort : 100).reduce((a, b) => Math.min(a, b), 100)) - (b.flag.map(flag => CompanyFlag[flag] ? CompanyFlag[flag].sort : 100).reduce((a, b) => Math.min(a, b), 100)));
            person.sort((a, b) => (a.flag.map(flag => PersonFlag[flag] ? PersonFlag[flag].sort : 100).reduce((a, b) => Math.min(a, b), 100)) - (b.flag.map(flag => PersonFlag[flag] ? PersonFlag[flag].sort : 100).reduce((a, b) => Math.min(a, b), 100)));
        }

        const dataChanged = !project || Object.keys(editedData).length > 0;
        return (
            <div className={'app-body'}>
                <Toolbox
                    returnToPreviousView = {this.props.returnToPreviousView}
                    save = {this.save}
                    remove = {this.remove}
                    dataChanged = {dataChanged}
                    validation = {this.state.validation}
                    saveDisabled = {this.state.saveDisabled}
                    addFromBox = {this.addFromBox}
                    box = {this.props.box && this.props.box.length > 0}
                    selected = {project && project._id}
                    label = {'Project'}
                    id = {project && project.projectId ? project.projectId : null}
                    editable = {this.props.editable}
                />
                <Scrollbars  className={'body-scroll-content projects'} autoHide={true} autoHideTimeout={Constants.TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT} autoHideDuration={Constants.TABLE_SCROLLBARS_AUTO_HIDE_DURATION}>
                    <div className={'detail-body edit'}>

                        {/* ------------------ NAME, INQUIRED, LAST CONTACT ------------------ */}
                        <div className={'detail-row'}>
                            <div className={'detail-group size-4'}>
                                <div className={`detail-label${typeof editedData.name !== 'undefined' && project  ? ' value-changed' : ''}`}>{'Project Name:'}</div>
                                <Input
                                    placeholder={'Project name...'}
                                    autoFocus={!project}
                                    className={`detail-input upper-case${this.state.validation.name ? ' invalid' : ''}`}
                                    onChange={this.handleNameChange}
                                    value={name}
                                />
                            </div>
                            <div className={'detail-group size-4 datepicker-container full-width'}>
                                <div className={`detail-label${typeof editedData.inquired !== 'undefined' && project  ? ' value-changed' : ''}`}>{'Project Inquired:'}</div>
                                <DatePicker
                                    selected={inquired}
                                    dateFormat={'D.M.YYYY'}
                                    className={`detail-date-picker${this.state.validation.inquired ? ' invalid' : ''}`}
                                    onChange={this.handleInquiredChange}
                                    maxDate={this.today}
                                    placeholderText={'Project inquired...'}
                                    onChangeRaw={this.handleDateChangeRaw}
                                />
                            </div>
                            <div className={'detail-group size-4 datepicker-container full-width'}>
                                <div className={`detail-label${typeof editedData.lastContact !== 'undefined' && project  ? ' value-changed' : ''}`}>{'Last Contact:'}</div>
                                <DatePicker
                                    selected={lastContact}
                                    dateFormat={'D.M.YYYY'}
                                    className={`detail-date-picker${this.state.validation.lastContact ? ' invalid' : ''}`}
                                    onChange={this.handleLastContactChange}
                                    maxDate={this.today}
                                    placeholderText={'Last Contact...'}
                                    isClearable
                                    onChangeRaw={this.handleDateChangeRaw}
                                />
                            </div>
                        </div>
                        {/* ------------------ ALIAS, VIP TAG, VIP TAG NOTE ------------------ */}
                        <div className={'detail-row'}>
                            <div className={'detail-group size-4'}>
                                <div className={`detail-label${typeof editedData.alias !== 'undefined' && project  ? ' value-changed' : ''}`}>{'Project Alias:'}</div>
                                <Input
                                    placeholder={'Project alias...'}
                                    className={`detail-input upper-case${this.state.validation.alias ? ' invalid' : ''}`}
                                    onChange={this.handleAliasChange}
                                    value={alias}
                                />
                            </div>
                            <div className={'detail-group size-4'}>
                                <div className={`detail-label${typeof editedData.vipTag !== 'undefined' && project  ? ' value-changed' : ''}`}>{'Prestige:'}</div>
                                <div className={`control-vip-tag`}>
                                    {Object.keys(VipTag).map((tag, i) =>
                                        <div key={i} data-tooltip={VipTag[tag].label}>
                                            <FontAwesomeIcon
                                                onClick={() => this.vipTagClicked(tag, vipTag)}
                                                className={`control-tag-icon${vipTag.indexOf(tag) >= 0 ? ' active' : ''}`}
                                                icon={VipTag[tag].icon}
                                            />
                                        </div>)}
                                </div>
                            </div>
                            <div className={'detail-group size-4'}>
                                <div className={`detail-label${typeof editedData.alias !== 'undefined' && project  ? ' value-changed' : ''}`}>{'Prestige Note:'}</div>
                                <Textarea
                                    placeholder={'Prestige note...'}
                                    className={`detail-input textarea${this.state.validation.vipTagNote ? ' invalid' : ''}`}
                                    onChange={this.handleVipTagNoteChange}
                                    value={vipTagNote}
                                />
                            </div>
                        </div>

                        {/* ------------------ STATUS + STATUS NOTE ------------------ */}
                        <div className={'detail-row'}>
                            <div className={'detail-group size-4'}>
                                <div className={`detail-label${typeof editedData.status !== 'undefined' && project ? ' value-changed' : ''}`}>{'Project Status:'}</div>
                                <Select
                                    options={statusOptions}
                                    value={{value: status, label: ProjectStatus[status] ? ProjectStatus[status].label : ''}}
                                    onChange={this.handleStatusChange}
                                    isSearchable={false}
                                    className={`control-select${this.state.validation.status ? ' invalid' : ''}${altStatus !== null ? ' alt' : ''}`}
                                    classNamePrefix={'control-select'}
                                />
                                {altStatus !== null ?
                                    <div className={'detail-status-alt-box'} onClick={this.handleStatusAltChanged}>
                                        <FontAwesomeIcon className={'alt-checkbox'} icon={altStatus ? Icons.ICON_CHECKBOX_CHECKED : Icons.ICON_CHECKBOX_UNCHECKED}/>
                                        <span className={'alt-text'}>{altText}</span>
                                    </div>
                                    : null}
                            </div>
                            <div className={'detail-group size-8'}>
                                <div className={`detail-label${editedData.statusNote !== undefined && project ? ' value-changed' : ''}`}>{'Status Note:'}</div>
                                <Textarea
                                    placeholder={'Status note...'}
                                    className={`detail-input textarea${this.state.validation.statusNote ? ' invalid' : ''}`}
                                    onChange={this.handleStatusNoteChange}
                                    value={statusNote}
                                />
                            </div>
                        </div>
                        {/* ------------------ BUDGET - BALLPARK ------------------ */}
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group size-8'}>
                                <div className={`detail-label${typeof editedData.budget !== 'undefined' && project ? ' value-changed' : ''}`}>{'Budget:'}</div>
                                <Select
                                    options={[{value: 'czk', label: 'CZK'}, {value: 'eur', label: 'EUR'}, {value: 'usd', label: 'USD'}]}
                                    value={{value: ballparkCurrency, label: ballparkCurrency.toUpperCase()}}
                                    onChange={option => this.handleBudgetChange('ballpark.currency', option.value)}
                                    isSearchable={false}
                                    className={`control-select currency`}
                                    classNamePrefix={'control-select'}
                                />
                                <div className={'detail-input-group'} data-input-label={ballparkCurrency.toUpperCase()}>
                                    <Input
                                        placeholder={'Budget from...'}
                                        className={`detail-input${this.state.validation.budget ? ' invalid' : ''}`}
                                        onChange={event => this.handleBudgetChange('ballpark.from', event.target.value)}
                                        value={StringFormatter.currencyFormat(ballparkFrom)}
                                    />
                                </div>
                                <div style={{margin: '0 0.5em', whiteSpace: 'nowrap'}}>{'-'}</div>
                                <div className={'detail-input-group'} data-input-label={ballparkCurrency.toUpperCase()}>
                                    <Input
                                        placeholder={'Budget to...'}
                                        className={`detail-input${this.state.validation.budget ? ' invalid' : ''}`}
                                        onChange={event => this.handleBudgetChange('ballpark.to', event.target.value)}
                                        value={StringFormatter.currencyFormat(ballparkTo)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ------------------ CLIENT TIMING ------------------ */}
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group column size-12'}>
                                <div onClick={() => this.handleTimingChange()} className={`detail-label clickable column${editedData.timing !== undefined && project ? ' value-changed' : ''}`}>
                                    {'Client Timing'}
                                    <FontAwesomeIcon className={'label-icon add'} icon={Icons.ICON_EDITOR_ITEM_ADD}/>
                                </div>
                                <div className={'detail-group-wrapper'}>
                                    {timing.map((line, i) =>
                                        <div className={`detail-array-line size-6 spacer`} key={i}>
                                            <FontAwesomeIcon className={'remove-icon'} onClick={() => this.handleTimingChange(i)} icon={Icons.ICON_EDITOR_LINE_REMOVE}/>
                                            <div className={'line-content datepicker-container timing'}>
                                                <Select
                                                    options={timingOptions}
                                                    value={line.category === 100 && line.label && ProjectClientTiming[line.label] ? {value: line.label, label: ProjectClientTiming[line.label].label} : null}
                                                    onChange={option => this.handleTimingChange(i, {label: !option || !option.value ? null : option.value})}
                                                    isSearchable={false}
                                                    isMulti={false}
                                                    isClearable={false}
                                                    className={`control-select timing-label`}
                                                    classNamePrefix={'control-select'}
                                                    placeholder={'Timing type...'}
                                                />
                                                <DatePicker
                                                    selected={line.date ? moment(line.date) : null}
                                                    autoFocus={!line.date}
                                                    dateFormat={'D.M.YYYY'}
                                                    className={`detail-date-picker${!line.date ? ' invalid' : ''}`}
                                                    onChange={date => this.handleTimingChange(i, {date: date.startOf('day')})}
                                                    placeholderText={'Last Contact...'}
                                                    isClearable={false}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ------------------ TEAM ------------------ */}
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group column size-12'}>
                                <div onClick={() => this.handleTeamChange()} className={`detail-label clickable column${editedData.team !== undefined && project ? ' value-changed' : ''}`}>
                                    {'UPP Team'}
                                    <FontAwesomeIcon className={'label-icon add'} icon={Icons.ICON_EDITOR_ITEM_ADD}/>
                                </div>
                                <div className={'detail-group-wrapper'}>
                                    {team.map((line, i) =>
                                        <div className={`detail-array-line size-6 spacer`} key={i}>
                                            <FontAwesomeIcon className={'remove-icon'} onClick={() => this.handleTeamChange(i)} icon={Icons.ICON_EDITOR_LINE_REMOVE}/>
                                            <div className={'line-content'}>
                                                <Select
                                                    options={this.getTeamUsersOptions(team, i)}
                                                    value={line.id ? {value: line.id, label: users[line.id] ? users[line.id].name : line.id  } : null}
                                                    autoFocus={!line.id}
                                                    onChange={option => this.handleTeamChange(i, {id: !option || !option.value ? null : option.value})}
                                                    isSearchable={true}
                                                    isMulti={false}
                                                    isClearable={true}
                                                    className={`control-select team-name${line.id === null || (this.state.validation['team-name-duplicity'] && this.state.validation['team-name-duplicity'].index.indexOf(i) >= 0)  ? ' invalid' : ''}`}
                                                    classNamePrefix={'control-select'}
                                                    placeholder={'Team member...'}
                                                />
                                                <Select
                                                    options={this.getTeamRoleOptions(team, i)}
                                                    value={line.role.map(role => ({value: role, label: TeamRole[role] ? TeamRole[role].label : role}))}
                                                    onChange={option => this.handleTeamChange(i, {role: !option ? [] : option.map(o => o.value)})}
                                                    isSearchable={false}
                                                    isMulti={true}
                                                    isClearable={true}
                                                    className={`control-select team-role${line.role.length === 0 ? ' invalid' : ''}`}
                                                    classNamePrefix={'control-select'}
                                                    placeholder={'Role...'}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ------------------ COMPANY ------------------ */}
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group column size-12'}>
                                <div
                                    onClick={event => event.altKey ? this.createNewCompany() : this.handleCompanyChange()}
                                    className={`detail-label clickable column${editedData.company !== undefined && project ? ' value-changed' : ''}`}
                                >
                                    {'Companies'}
                                    <FontAwesomeIcon className={'label-icon add'} icon={Icons.ICON_EDITOR_ITEM_ADD}/>
                                </div>
                                {company.map((companyLine, i) => companyLine.id && !companies[companyLine.id] ? null :
                                    <div className={`detail-array-line`} key={i}>
                                        <FontAwesomeIcon className={'remove-icon'} onClick={() => this.handleCompanyChange(i)} icon={Icons.ICON_EDITOR_LINE_REMOVE}/>
                                        <div className={'line-content'}>
                                            <div className={'wrapper company-name'}>
                                                <CreatableSelect
                                                    options={this.getCompanyOptions(companies)}
                                                    value={companyLine.id ? {value: companyLine.id, label: companies[companyLine.id] ? companies[companyLine.id].name : companyLine.id  } : null}
                                                    autoFocus={!companyLine.id}
                                                    onChange={option => this.handleCompanyChange(i, {id: !option || !option.value ? null : option.value})}
                                                    onCreateOption={name => this.createNewCompany(i, name)}
                                                    formatCreateLabel={value => `Create: "${value}"`}
                                                    isSearchable={true}
                                                    isMulti={false}
                                                    isClearable={true}
                                                    className={`control-select${companyLine.id === null || (this.state.validation['company-name-duplicity'] && this.state.validation['company-name-duplicity'].index.indexOf(i) >= 0) ? ' invalid' : ''}`}
                                                    classNamePrefix={'control-select'}
                                                    placeholder={'Company...'}
                                                />
                                                <div className={`control-flags`}>
                                                    {Object.keys(CompanyFlag).map(flag =>
                                                        <div key={flag} data-tooltip={CompanyFlag[flag].label}>
                                                            <FontAwesomeIcon
                                                                onClick={() => this.companyFlagClicked(i, companyLine.flag, CompanyFlag[flag].id)}
                                                                className={`control-flag-icon${companyLine.flag.indexOf(CompanyFlag[flag].id) >= 0 ? ' active' : ''}`}
                                                                icon={CompanyFlag[flag].icon}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <Select
                                                options={this.getCompanyBusinessOptions(companyLine.id)}
                                                value={companyLine.business.map(business => ({value: business, label: CompanyBusiness[business] ? CompanyBusiness[business].label : business}))}
                                                onChange={option => this.handleCompanyChange(i, {business: !option ? [] : option.map(o => o.value)})}
                                                isSearchable={false}
                                                isMulti={true}
                                                isClearable={true}
                                                className={`control-select company-business`}
                                                classNamePrefix={'control-select'}
                                                placeholder={'Business..'}
                                            />

                                            <Input
                                                className={`detail-input company-note`}
                                                onChange={event => this.handleCompanyChange(i, {note: event.target.value})}
                                                value={companyLine.note}
                                                placeholder={'Note...'}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ------------------ PERSON ------------------ */}
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group column size-12'}>
                                <div
                                    onClick={event => event.altKey ? this.createNewPerson() : this.handlePersonChange()}
                                    className={`detail-label clickable column${editedData.person !== undefined && project ? ' value-changed' : ''}`}
                                >
                                    {'People'}
                                    <FontAwesomeIcon className={'label-icon add'} icon={Icons.ICON_EDITOR_ITEM_ADD}/>
                                </div>
                                {person.map((personLine, i) => personLine.id && !persons[personLine.id] ? null :
                                    <div className={`detail-array-line`} key={i}>
                                        <FontAwesomeIcon className={'remove-icon'} onClick={() => this.handlePersonChange(i)} icon={Icons.ICON_EDITOR_LINE_REMOVE}/>
                                        <div className={'line-content'}>
                                            <div className={'wrapper person-name'}>
                                                <CreatableSelect
                                                    options={this.getPersonOptions(persons)}
                                                    value={personLine.id ? {value: personLine.id, label: persons[personLine.id] ? persons[personLine.id].name : personLine.id  } : null}
                                                    autoFocus={!personLine.id}
                                                    onChange={option => this.handlePersonChange(i, {id: !option || !option.value ? null : option.value})}
                                                    onCreateOption={name => this.createNewPerson(i, name)}
                                                    formatCreateLabel={value => `Create: "${value}"`}
                                                    isSearchable={true}
                                                    isMulti={false}
                                                    isClearable={true}
                                                    className={`control-select${personLine.id === null || (this.state.validation['person-name-duplicity'] && this.state.validation['person-name-duplicity'].index.indexOf(i) >= 0)? ' invalid' : ''}`}
                                                    classNamePrefix={'control-select'}
                                                    placeholder={'Person...'}
                                                />
                                                <div className={`control-flags`}>
                                                    {Object.keys(PersonFlag).map(flag =>
                                                        <div key={flag} data-tooltip={PersonFlag[flag].label}>
                                                            <FontAwesomeIcon
                                                                onClick={() => this.personFlagClicked(i, personLine.flag, PersonFlag[flag].id)}
                                                                className={`control-flag-icon${personLine.flag.indexOf(PersonFlag[flag].id) >= 0 ? ' active' : ''}`}
                                                                icon={PersonFlag[flag].icon}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <Select
                                                options={this.getPersonProfessionOptions(personLine.id)}
                                                value={personLine.profession.map(profession => ({value: profession, label: PersonProfession[profession] ? PersonProfession[profession].label : profession}))}
                                                onChange={option => this.handlePersonChange(i, {profession: !option ? [] : option.map(o => o.value)})}
                                                isSearchable={false}
                                                isMulti={true}
                                                isClearable={true}
                                                className={`control-select person-profession`}
                                                classNamePrefix={'control-select'}
                                                placeholder={'Profession...'}
                                            />
                                            <Select
                                                options={this.getProjectCompaniesOptions(company)}
                                                value={personLine.company ? {value: personLine.company, label: companies[personLine.company] ? companies[personLine.company].name : personLine.company  } : null}
                                                onChange={option => this.handlePersonChange(i, {company: !option || !option.value ? null : option.value})}
                                                isSearchable={false}
                                                isMulti={false}
                                                isClearable={true}
                                                className={`control-select person-company${this.state.validation['person-company'] && this.state.validation['person-company'].index.indexOf(i) >= 0 ? ' invalid' : ''}`}
                                                classNamePrefix={'control-select'}
                                                placeholder={'Company...'}
                                            />
                                            <Input
                                                className={`detail-input person-note`}
                                                onChange={event => this.handlePersonChange(i, {note: event.target.value})}
                                                value={personLine.note}
                                                placeholder={'Note...'}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* ------------------ NOTE ------------------ */}
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group size-12'}>
                                <div className={`detail-label${editedData.projectNote !== undefined && project ? ' value-changed' : ''}`}>{'Project note:'}</div>
                                <Textarea
                                    placeholder={'Project note...'}
                                    className={`detail-input textarea`}
                                    onChange={this.handleProjectNoteChange}
                                    value={projectNote}
                                />
                            </div>
                        </div>
                        {/* ------------------ STORY ------------------ */}
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group size-12'}>
                                <div className={`detail-label${editedData.story !== undefined && project ? ' value-changed' : ''}`}>{'Project story:'}</div>
                                <Textarea
                                    placeholder={'Project story...'}
                                    className={`detail-input textarea`}
                                    onChange={this.handleStoryChange}
                                    value={story}
                                />
                            </div>
                        </div>
                    </div>
                </Scrollbars>
            </div>
        )
    }


    // *****************************************************************************************************************
    // CLOSE, SAVE, REMOVE, BOX
    // *****************************************************************************************************************
    close = () => {
        this.props.returnToPreviousView();
    };
    save = async () => {
        if(this.setValidation()) return;
        try {
            if (this.props.project) await this.props.update(this.props.project._id);
            else await this.props.create();
            this.close();
        } catch (e) {}
    };

    remove = async () => {
        try {
            await this.props.remove(this.props.project._id);
            this.props.returnToPreviousView(true);
        } catch(e) {}
    };

    // *****************************************************************************************************************
    // HELPERS
    // *****************************************************************************************************************
    checkValidity = () => {
        //console.log('CHECK VALIDITY')
        if(this.validationTimer) return;
        const time = +new Date() - this.lastValidation;
        if(time > Constants.VALIDATION_DELAY_MS) this.setValidation();
        else this.validationTimer = setTimeout(this.setValidation, Constants.VALIDATION_DELAY_MS - time);
    };

    isNameUsed = name => {
        if(!name) return false;
        const filtered = Object.keys(this.props.projects).filter(projectId => this.props.projects[projectId].name.toLowerCase().trim() === name.toLowerCase().trim()).filter(projectId => !this.props.project || projectId !== this.props.project._id);
        return filtered.length > 0;
    };

    handleRemoveArmed = () => {
        this.setState({removeArmed: !this.state.removeArmed})
    };

    updateEditedData = updateData => {
        const object = this.props.project ? this.props.project : undefined;
        const newData = {...this.props.editedData, ...updateData};
        for (const key of Object.keys(newData)) {
            if (object && areEquivalent(object[key], newData[key])) {
                delete newData[key];
                switch (key) {
                    case 'status':
                        delete newData['statusNote']; //to refresh ald one if status returned to original
                        break;
                }
            }

        }
        return newData;
    };

    getTeamUsersOptions = (team, index) => {
        const bookingRoles = Object.keys(TeamRole).reduce((roles, id) => roles.concat(TeamRole[id] ? TeamRole[id].role : ''), []);
        const requiredBookingRoles = team[index] && team[index].role && team[index].role.length > 0 ? team[index].role.map(id => TeamRole[id] ? TeamRole[id].role : '') : [];
        const usersAlreadyInTeam = team.filter((line, i) => i !== index && line.id).map(line => line.id);

        return Object.keys(this.props.users)
            .filter(userId => {
                if(usersAlreadyInTeam.indexOf(userId) >= 0) return false;
                if(!this.props.users[userId] || !this.props.users[userId].role || this.props.users[userId].role.filter(role => bookingRoles.indexOf(role) >= 0).length === 0) return false;
                if(requiredBookingRoles.length === 0) {
                    const alreadyUsedRoles = team.reduce((usedRoles, line, i) => {
                        if(i !== index) {
                            for(const role of line.role) {
                                if(!(TeamRole[role] && TeamRole[role].multi) && usedRoles.indexOf(role) < 0) usedRoles.push(role);
                            }
                        }
                        return usedRoles;
                    }, []);
                    const freeBookingRoles = Object.keys(TeamRole).filter(id => alreadyUsedRoles.indexOf(id) < 0).reduce((roles, role) => roles.concat(TeamRole[role] ? TeamRole[role].role : ''), []);
                    let hasRole = false;
                    for(const role of freeBookingRoles) {
                        if (!hasRole && this.props.users[userId].role.indexOf(role) >= 0) hasRole = true;
                    }
                    return hasRole;
                } else {
                    let notPassed = false;
                    for (const requiredRole of requiredBookingRoles) {
                        if (Array.isArray(requiredRole)) {
                            let hasRole = false;
                            for (const role of requiredRole) {
                                if (this.props.users[userId].role.indexOf(role) >= 0) hasRole = true;
                            }
                            if (!hasRole) notPassed = true;
                        } else {
                            if (this.props.users[userId].role.indexOf(requiredRole) < 0) notPassed = true;
                        }
                    }
                    return !notPassed;
                }
            })
            .sort((a, b) => this.props.users[a].name.localeCompare(this.props.users[b].name))
            .map(user => {return {value: user, label: this.props.users[user].name}});
    };

    getCompanyBusinessOptions = id => {
        if(!id) return [];
        const company = this.props.companies[id];
        if(company) return company.business.map(business => ({value: business, label: CompanyBusiness[business] ? CompanyBusiness[business].label : business}));
        else return [];
    };

    getPersonProfessionOptions = id => {
        if(!id) return [];
        const person = this.props.persons[id];
        if(person) return person.profession.map(profession => ({value: profession, label: PersonProfession[profession] ? PersonProfession[profession].label : profession}));
        else return [];
    };

    getTeamRoleOptions = (team, index) => {
        const currentUserRoles = team[index].id && this.props.users[team[index].id] ? this.props.users[team[index].id].role : [];
        const alreadyUsedRoles = team.reduce((usedRoles, line, i) => {
            for(const role of line.role) {
                if(!(TeamRole[role] && TeamRole[role].multi) && usedRoles.indexOf(role) < 0) usedRoles.push(role);
            }
            return usedRoles;
        }, []);
        return Object.keys(TeamRole).filter(role => {
            if(alreadyUsedRoles.indexOf(role) >= 0) return false;
            if(!team[index].id) return true;
            for(const userRole of currentUserRoles) {
                if(TeamRole[role].role.indexOf(userRole) >= 0) return true;
            }
            return false;
        }).map(role => ({value: role, label: TeamRole[role] ? TeamRole[role].label : role}));
    };

    getCompanyOptions = companies => {
      return Object.keys(companies).sort((a, b) => companies[a].name.localeCompare(companies[b].name)).map(companyId => ({
          value: companyId,
          label: companies[companyId].name
      }));
    };

    getPersonOptions = memoize(persons => {
        //console.log('GET PERSONS OPTIONS');
        return Object.keys(persons).sort((a, b) => persons[a].name.localeCompare(persons[b].name)).map(personId => ({
            value: personId,
            label: persons[personId].name
        }));
    });

    getProjectCompaniesOptions = company => {
        const companies = company.filter(company => company.id).map(company => company.id).filter((companyId, index, self) => self.indexOf(companyId) === index).map(companyId => ({
            value: companyId,
            label: this.props.companies[companyId] ? this.props.companies[companyId].name : companyId
        }));
        return companies;
    };
    // *****************************************************************************************************************
    // VALIDATION
    // *****************************************************************************************************************

    setValidation = () => {
        if(this.validationTimer) clearTimeout(this.validationTimer);
        this.validationTimer = null;
        this.lastValidation = +new Date();
        const originalObject = this.props.project;
        if(originalObject && !originalObject._id) return true; // when refresh, no data fetched yet
        const object = Object.assign({}, originalObject, this.props.editedData);
        let validation = {};

        if(!object.name || !object.name.trim()) validation['name'] = {field: 'Project Name', status: 'Must be set'};
        if(this.isNameUsed(object.name)) validation['name'] = {field: 'Project Name', status: 'Is not unique'};
        if(!object.status) validation['status'] = {field: 'Project status', status: 'Must be set'};
        if(!ProjectStatus[object.status]) validation['status'] = {field: 'Project status', status: 'Is invalid'};

        //if((object.status === ProjectStatus.ON_HOLD.id || object.status === ProjectStatus.REFUSED.id || object.status === ProjectStatus.LOST.id) && (!object.statusNote || !object.statusNote.trim())) validation['statusNote'] = {field: 'Status note', status: `Must be set for status "${ProjectStatus[object.status].label}"`};
        if(!object.statusNote || !object.statusNote.trim()) validation['statusNote'] = {field: 'Status note', status: 'Must be set'};

        if(object.team && object.team.some(team => team.id === null)) validation['team-name'] = {field: 'Team', status: 'Some team member is not set'};
        if(object.team && object.team.some(team => team.role.length === 0)) validation['team-role'] = {field: 'Team', status: 'Some team member has not set role'};

        const teamUsers = object.team ? object.team.filter(line => line.id).map(line => line.id) : [];
        teamUsers.forEach((user, index) => {
            if(teamUsers.indexOf(user) !== index) {
                if(!validation['team-name-duplicity']) validation['team-name-duplicity'] = {field: 'Team', index: [index], status: `User is in team more than once`};
                else validation['team-name-duplicity'].index.push(index);
            }
        });

        if(object.company && object.company.some(company => company.id === null)) validation['company'] = {field: 'Companies', status: 'Some company is not set'};
        if(object.company && object.company.length > 0 && !object.company.some(company => company.flag.indexOf(CompanyFlag.UPP_CLIENT.id) >= 0)) validation['company'] = {field: 'Companies', status: 'UPP client is not set'};
        const companies = object.company ? object.company.filter(line => line.id).map(line => line.id) : [];
        companies.forEach((company, index) => {
            if(companies.indexOf(company) !== index) {
                if(!validation['company-name-duplicity']) validation['company-name-duplicity'] = {field: 'Company', index: [index], status: `Some company is duplicated`};
                else validation['company-name-duplicity'].index.push(index);
            }
        });

        if(object.person && object.person.some(person => person.id === null)) validation['person'] = {field: 'People', status: 'Some person is not set'};
        const persons = object.person ? object.person.filter(line => line.id).map(line => line.id) : [];
        persons.forEach((person, index) => {
            if(persons.indexOf(person) !== index) {
                if(!validation['person-name-duplicity']) validation['person-name-duplicity'] = {field: 'Person', index: [index], status: `Some person is duplicated`};
                else validation['person-name-duplicity'].index.push(index);
            }
        });

        if(object.person && object.person.length > 0) {
            object.person.forEach((personLine, index) => {
                if(personLine.company && companies.indexOf(personLine.company) < 0) {
                    if(!validation['person-company']) validation['person-company'] = {field: 'Person', index: [index], status: `Some selected company is not set in the project`};
                    else validation['person-company'].index.push(index);
                }
            });
        }

        if(object.timing && object.timing.length > 0) {
            object.timing.forEach((timingLine, index) => {
                if(!timingLine.date) {
                    if(!validation['timing']) validation['timing'] = {field: 'Timing', index: [index], status: `Some timing date is not set`};
                    else validation['timing'].index.push(index);
                }
            })
        }

        if(object.budget && object.budget.ballpark && object.budget.ballpark.to) {
            if(!object.budget.ballpark.from) validation['budget'] = {field: 'Budget', status: 'Budget from is not set'};
            else if(object.budget.ballpark.to === object.budget.ballpark.from) validation['budget'] = {field: 'Budget', status: `Budget 'from' is equal to Budget 'to'`};
            else if(object.budget.ballpark.to < object.budget.ballpark.from) validation['budget'] = {field: 'Budget', status: `Budget 'from' is less than Budget 'to'`};
        }

        if(object.vipTag && object.vipTag.length > 0 && (!object.vipTagNote || !object.vipTagNote.trim())) validation['vipTagNote'] = {field: 'Prestige Note', status: `Note has to be set`};
        if(object.vipTag && object.vipTag.length === 0 && object.vipTagNote) validation['vipTagNote'] = {field: 'Prestige Note', status: `Note is not relevant`};

        const disableSave = Object.keys(validation).length > 0 || Object.keys(this.props.editedData).length === 0;
        if(areEquivalent(validation, this.state.validation)) validation = this.state.validation;
        this.setState({validation: validation, saveDisabled: disableSave});
        return disableSave;
    };

    // *****************************************************************************************************************
    // VALUES CHANGE HANDLERS
    // *****************************************************************************************************************
    handleNameChange = event => {
        this.props.editItem(this.updateEditedData({name: event.target.value}));
    };

    handleAliasChange = event => {
        this.props.editItem(this.updateEditedData({alias: event.target.value}));
    };

    handleStatusChange = option => {
        //if(option.value === ProjectStatus.ON_HOLD.id || option.value === ProjectStatus.REFUSED.id || option.value === ProjectStatus.LOST.id) {
            this.props.editItem(this.updateEditedData({status: option.value, statusNote: ''}));
        //} else {
            //this.props.editItem(this.updateEditedData({status: option.value}));
        //}
    };

    handleStatusAltChanged = event => {
        const status = this.props.editedData.status || this.props.project.status;
        if(status) {
            if(status === ProjectStatus.CANCELED.id) this.props.editItem(this.updateEditedData({status: ProjectStatus.CANCELED_ALT.id}));
            else if(status === ProjectStatus.CANCELED_ALT.id) this.props.editItem(this.updateEditedData({status: ProjectStatus.CANCELED.id}));
        }
    };

    handleStatusNoteChange = event => {
        this.props.editItem(this.updateEditedData({statusNote: event.target.value}));
    };

    handleVipTagNoteChange = event => {
        this.props.editItem(this.updateEditedData({vipTagNote: event.target.value}));
    };

    handleProjectNoteChange = event => {
        this.props.editItem(this.updateEditedData({projectNote: event.target.value}));
    };

    handleStoryChange = event => {
        this.props.editItem(this.updateEditedData({story: event.target.value}));
    };

    handleLastContactChange = date => {
        this.props.editItem(this.updateEditedData({lastContact: date ? date.startOf('day') : null}));
    };

    handleInquiredChange = date => {
        this.props.editItem(this.updateEditedData({inquired: date ? date.startOf('day') : null}));
    };

    handleTimingChange = (index, data) => {
        const emptyItem = {type: 'CLIENT', date: null, dateTo: null, category: 100, label: ProjectClientTiming.GO_AHEAD.id};
        const object = this.props.project;
        const newData = this.props.editedData.timing ? [...this.props.editedData.timing] : object ? [...object.timing] : [];
        if(typeof index === 'undefined' && typeof data === 'undefined') { //ADD
            if (newData.length >= 1) return;//this.props.editedData.timing.some(item => !item.label || !item.date)) return;
            newData.push(emptyItem)
        } else if(typeof index === 'undefined') { //ADD - fill id in data
            newData.push({...emptyItem, id: data});
        } else if(typeof data === 'undefined') { //REMOVE at index
            newData.splice(index, 1);
        } else { //data contains update for line index
            newData[index] = {...newData[index], ...data}
        }
        const editedData = this.updateEditedData({timing: newData});
        //TODO check if there is only one go ahead etc...
        this.props.editItem(editedData);
    };

    handleTeamChange = (index, data) => {
        const emptyItem = {id: null, role: [], note: ''};
        const object = this.props.project;
        const newData = this.props.editedData.team ? [...this.props.editedData.team] : object ? [...object.team] : [];
        if(typeof index === 'undefined' && typeof data === 'undefined') { //ADD
            if (this.props.editedData.team && this.props.editedData.team.some(item => item.id === null)) return;
            newData.push(emptyItem)
        } else if(typeof index === 'undefined') { //ADD - fill id in data
            newData.push({...emptyItem, id: data});
        } else if(typeof data === 'undefined') { //REMOVE at index
            newData.splice(index, 1);
        } else { //data contains update for line index
            newData[index] = {...newData[index], ...data}
        }
        const editedData = this.updateEditedData({team: newData});
        if(data && data.id && editedData.team[index].role.length === 0) {
            const userBookingRoles = this.props.users[data.id] ? this.props.users[data.id].role : [];
            const projectUsedRoles = editedData.team.reduce((usedRoles, line) => usedRoles.concat(line.role), []);
            editedData.team[index].role = Object.keys(TeamRole).reduce((roles, id) => {
                const teamRole = Array.isArray(TeamRole[id].role) ? TeamRole[id].role : [TeamRole[id].role];
                for(const role of teamRole) {
                    if(TeamRole[id].auto && userBookingRoles.indexOf(role) >= 0 && roles.indexOf(TeamRole[id].id) < 0 && (TeamRole[id].multi || projectUsedRoles.indexOf(TeamRole[id].id) < 0)) { //not used in others lines
                        roles.push(TeamRole[id].id);
                    }
                }
                return roles;
            }, []);
        }
        this.props.editItem(editedData);
    };

    handleCompanyChange = (index, data) => {
        const emptyItem = {id: null, business: [], flag: [], note: ''};
        const project = this.props.project;
        const newData = this.props.editedData.company ? [...this.props.editedData.company] : project ? [...project.company] : [];
        if(typeof index === 'undefined' && typeof data === 'undefined') { //ADD
            if (this.props.editedData.company && this.props.editedData.company.some(company => company.id === null)) return;
            newData.push(emptyItem)
        } else if(typeof data === 'undefined') { //REMOVE at index
            newData.splice(index, 1);
        } else { //data contains update for line index, index === undefined => insert new
            if(typeof index === 'undefined') {
                newData.push(emptyItem);
                index = newData.length - 1;
            }
            newData[index] = {...newData[index], ...data};
            if(data && typeof data.id !== "undefined") newData[index].business = data.id && this.props.companies[data.id] ? this.props.companies[data.id].business : []; //business
        }
        this.props.editItem(this.updateEditedData({company: newData}));
    };

    companyFlagClicked = (index, flags, flag) => {
        const newFlags = [...flags];
        const i = newFlags.indexOf(flag);
        if(i < 0) newFlags.push(flag);
        else newFlags.splice(i, 1);
        this.handleCompanyChange(index, {flag: newFlags.sort()})
    };

    personFlagClicked = (index, flags, flag) => {
        const newFlags = [...flags];
        const i = newFlags.indexOf(flag);
        if(i < 0) newFlags.push(flag);
        else newFlags.splice(i, 1);
        this.handlePersonChange(index, {flag: newFlags.sort()})
    };

    vipTagClicked = (tag, tags) => {
        const newTags = [...tags];
        const i = newTags.indexOf(tag);
        if(i < 0) newTags.push(tag);
        else newTags.splice(i, 1);
        this.props.editItem(this.updateEditedData({vipTag: newTags.sort((a, b) => VipTag[a].sort - VipTag[b].sort)}));
    };

    handleBudgetChange = (which, value) => {
        const emptyItem = {booking: null, client: null, sent: [], ballpark: {from: 0, to: 0, currency: 'eur'}};
        const project = this.props.project;
        const newData = this.props.editedData.budget ? {...this.props.editedData.budget, ballpark: {...this.props.editedData.budget.ballpark}, sent: [...this.props.editedData.budget.sent]} : project ? {...project.budget, ballpark: {...project.budget.ballpark}, sent: [...project.budget.sent]} : emptyItem;
        switch(which) {
            case 'ballpark.from':
                value = value ? Number.parseInt(value.replace(/[. ,]/g, '')) : 0;
                if(isNaN(value)) value = 0;
                if(value < 0) value = -value;
                newData.ballpark.from = value;
                break;
            case 'ballpark.to':
                value = value ? Number.parseInt(value.replace(/[. ,]/g, '')) : 0;
                if(isNaN(value)) value = 0;
                if(value < 0) value = -value;
                newData.ballpark.to = value;
                break;
            case 'ballpark.currency':
                newData.ballpark.currency = value;
                break;
        }
        this.props.editItem(this.updateEditedData({budget: newData}));
    };


    handlePersonChange = (index, data) => {
        const emptyItem = {id: null, profession: [], flag: [], note: '', company: null};
        const project = this.props.project;
        const newData = this.props.editedData.person ? [...this.props.editedData.person] : project ? [...project.person] : [];
        if(typeof index === 'undefined' && typeof data === 'undefined') { //ADD
            if(this.props.editedData.person && this.props.editedData.person.some(person => person.id === null)) return;
            newData.push(emptyItem)
        } else if(typeof data === 'undefined') { //REMOVE at index
            newData.splice(index, 1);
        } else { //data contains update for line index, index === undefined => insert new
            if(typeof index === 'undefined') {
                newData.push(emptyItem);
                index = newData.length - 1;
            }
            newData[index] = {...newData[index], ...data};
            if(data && data.id) { //person has been changed - reset/set some data
                newData[index].profession = data.id && this.props.persons[data.id] ? this.props.persons[data.id].profession : []; //profession
                let projectCompanies = this.props.editedData.company !== undefined ? this.props.editedData.company : project ? project.company : [];
                const personCompanies = this.props.persons[data.id].company;
                projectCompanies = projectCompanies.filter(company => company.id).map(company => company.id).filter((projectCompaniesId, index, self) => self.indexOf(projectCompaniesId) === index);
                projectCompanies = projectCompanies.filter(projectCompaniesId => personCompanies.indexOf(projectCompaniesId) >= 0);
                newData[index].company = projectCompanies.length === 1 ? projectCompanies[0] : null;
            }
        }
        this.props.editItem(this.updateEditedData({person: newData}));
    };

    addFromBox = () => {
        if(!this.props.box) return;
        const project = this.props.project;
        const company = this.props.editedData.company ? this.props.editedData.company : project ? project.company : [];
        const person = this.props.editedData.person ? this.props.editedData.person : project ? project.person : [];

        for (const id of this.props.box) {
            if (this.props.companies[id]) {
                if(!company.some(company => company.id === id)) setTimeout(() => this.handleCompanyChange(undefined, {id: id}), 0);
            } else if (this.props.persons[id]) {
                if(!person.some(person => person.id === id)) setTimeout(() => this.handlePersonChange(undefined, {id: id}), 0);
            }
        }
    };

    createNewPerson = (index, name) => {
        if(typeof index === 'undefined') {
            this.handlePersonChange(index, {waiting: 1});
            this.props.addPerson('');
        } else {
            this.handlePersonChange(index, {waiting: 2});
            this.props.addPerson(name);
        }
    };

    createNewCompany = (index, name) => {
        if(typeof index === 'undefined') {
            this.handleCompanyChange(index, {waiting: 1});
            this.props.addCompany('');
        } else {
            this.handleCompanyChange(index, {waiting: 2});
            this.props.addCompany(name);
        }
    };

    checkJustAddedObject = () => {
        if(this.props.editedData && this.props.editedData.company) {
            this.props.editedData.company.forEach((companyLine, i) => {
                if(companyLine.waiting) {
                    if(this.props.justAdded) this.handleCompanyChange(i, {id: this.props.justAdded._id, waiting: undefined});
                    else if(companyLine.waiting === 1) this.handleCompanyChange(i);
                    else if(companyLine.waiting === 2) this.handleCompanyChange(i, {waiting: undefined});
                }
            })
        }
        if(this.props.editedData && this.props.editedData.person) {
            this.props.editedData.person.forEach((personLine, i) => {
                if(personLine.waiting) {
                    if(this.props.justAdded) this.handlePersonChange(i,  {id: this.props.justAdded._id, waiting: undefined});
                    else if(personLine.waiting === 1) this.handlePersonChange(i);
                    else if(personLine.waiting === 2) this.handlePersonChange(i, {waiting: undefined});
                }
            })
        }
        this.props.setJustAddedObject(null);
    };

    handleDateChangeRaw = event => {
        event.preventDefault();
    };
};
