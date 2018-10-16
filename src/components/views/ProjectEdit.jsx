import React, {Fragment} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Scrollbars } from 'react-custom-scrollbars';
import { Input } from 'reactstrap';
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

import * as Icons from '../../constants/Icons';

import * as ProjectStatus from '../../constants/ProjectStatus';
import * as TeamRole from '../../constants/TeamRole';

const statusOptions = Object.keys(ProjectStatus).map(key => ({value: ProjectStatus[key].id, label: ProjectStatus[key].label}));
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
    }

    componentDidMount() {
        this.checkJustAddedObject();
        this.checkValidity();
    }

    componentDidUpdate(prevProps) {
        //console.log('DID UPDATE')
        if(this.props.editedData !== prevProps.editedData || this.props.projects !== prevProps.projects) this.checkValidity();
    }

    render() {
        //console.log('RENDER')
        const {selected, editedData, projects, companies, persons, users} = this.props;

        const name = editedData.name !== undefined ? editedData.name : !selected ? '' : projects[selected] ? projects[selected].name : '';
        const status = editedData.status !== undefined ? editedData.status : projects[selected] ? projects[selected].status : null;
        const statusNote = editedData.statusNote !== undefined ? editedData.statusNote : projects[selected] ? projects[selected].statusNote : '';
        const company = editedData.company !== undefined ? editedData.company : projects[selected] ? projects[selected].company : [];
        const person = editedData.person !== undefined ? editedData.person : projects[selected] ? projects[selected].person : [];
        const team = editedData.team !== undefined ? editedData.team : projects[selected] ? projects[selected].team : [];
        const timing = editedData.timing !== undefined ? editedData.timing : projects[selected] ? projects[selected].timing : [];
        const lastContact = editedData.lastContact !== undefined ? editedData.lastContact ? moment(editedData.lastContact) : null : projects[selected] && projects[selected].lastContact ? moment(projects[selected].lastContact) : null;

        if(Object.keys(editedData).length === 0) {
            team.sort((a, b) => (a.role.map(role => TeamRole[role] ? TeamRole[role].sort : 100).reduce((a, b) => Math.min(a, b), 100)) - (b.role.map(role => TeamRole[role] ? TeamRole[role].sort : 100).reduce((a, b) => Math.min(a, b), 100)));
            timing.sort((a, b) => 0);
            company.sort((a, b) => (a.flag.map(flag => CompanyFlag[flag] ? Object.keys(CompanyFlag).indexOf(flag) : 100).reduce((a, b) => Math.min(a, b), 100)) - (b.flag.map(flag => CompanyFlag[flag] ? Object.keys(CompanyFlag).indexOf(flag) : 100).reduce((a, b) => Math.min(a, b), 100)));
            person.sort((a, b) => (a.flag.map(flag => PersonFlag[flag] ? Object.keys(PersonFlag).indexOf(flag) : 100).reduce((a, b) => Math.min(a, b), 100)) - (b.flag.map(flag => PersonFlag[flag] ? Object.keys(PersonFlag).indexOf(flag) : 100).reduce((a, b) => Math.min(a, b), 100)));
        }

        return (
            <div className={'app-body'}>
                {/* ------------------ TOOLBOX ------------------ */}
                <div className={'app-toolbox'}>
                    <div className={'inner-container'}>
                        <div className={'toolbox-group'}>
                            <div onClick={this.close} className={'tool-box-button'}>{'Cancel'}</div>
                            <div onClick={this.state.saveDisabled ? undefined : this.save} className={`tool-box-button${selected ? ' orange' : ' green'}${this.state.saveDisabled ? ' disabled' : ''}`}>{selected ? 'Save' : 'Create'}</div>
                            <div onClick={this.props.box && this.props.box.length > 0 ? this.addFromBox : undefined} className={`tool-box-button blue${!this.props.box || this.props.box.length === 0 ? ' disabled' : ''}`}><FontAwesomeIcon icon={Icons.ICON_BOX}/><FontAwesomeIcon icon={Icons.ICON_BOX_ARROW}/></div>
                            <div className={'tool-box-validation'}>
                                <FontAwesomeIcon className={`tool-box-validation-icon${Object.keys(this.state.validation).length > 0 ? ' active' : ''}`} icon={Icons.ICON_EDITOR_VALIDATION}/>
                                <div className={'tool-box-validation-container'}>
                                    {Object.keys(this.state.validation).map(validationField => <div key={validationField}>{`${this.state.validation[validationField].field}: ${this.state.validation[validationField].status}`}</div>)}
                                </div>
                            </div>
                            {!selected ? null :
                                <Fragment>
                                    <div onClick={!this.state.removeArmed ? undefined : this.remove} className={`tool-box-button remove red${!this.state.removeArmed ? ' disabled' : ''}`}>{'Remove Project'}</div>
                                    <FontAwesomeIcon className={`tool-box-checkbox`} onClick={this.handleRemoveArmed} icon={this.state.removeArmed ? Icons.ICON_CHECKBOX_CHECKED : Icons.ICON_CHECKBOX_UNCHECKED} style={{cursor: 'pointer'}}/>
                                </Fragment>
                            }
                        </div>
                    </div>
                    <div className={'inner-container left-auto'}>
                    {selected && projects[selected] ? <div className={'toolbox-id'}>{projects[selected].projectId}</div> : null}
                    </div>
                </div>

                {/* ------------------ FORM ------------------ */}
                <Scrollbars autoHide={true} autoHideTimeout={Constants.TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT} autoHideDuration={Constants.TABLE_SCROLLBARS_AUTO_HIDE_DURATION}>
                    <div className={'detail-body edit'}>

                        {/* ------------------ NAME, CONTACT ------------------ */}
                        <div className={'detail-row'}>
                            <div className={'detail-group size-8'}>
                                <div className={`detail-label${typeof editedData.name !== 'undefined' && selected  ? ' value-changed' : ''}`}>{'Project Name:'}</div>
                                <Input
                                    placeholder={'Project name...'}
                                    autoFocus={!selected}
                                    className={`detail-input${this.state.validation.name ? ' invalid' : ''}`}
                                    onChange={this.handleNameChange}
                                    value={name}
                                />
                            </div>
                            <div className={'detail-group size-4 datepicker-container last-contact'}>
                                <div className={`detail-label${typeof editedData.lastContact !== 'undefined' && selected  ? ' value-changed' : ''}`}>{'Last Contact:'}</div>
                                <DatePicker
                                    selected={lastContact}
                                    dateFormat={'D.M.YYYY'}
                                    className={`detail-date-picker${this.state.validation.lastContact ? ' invalid' : ''}`}
                                    onChange={this.handleLastContactChange}
                                    maxDate={moment().startOf('day')}
                                    placeholderText={'Last Contact...'}
                                    isClearable
                                />
                            </div>
                        </div>

                        {/* ------------------ STATUS + NOTE ------------------ */}
                        <div className={'detail-row'}>
                            <div className={'detail-group size-4'}>
                                <div className={`detail-label${typeof editedData.status !== 'undefined' && selected ? ' value-changed' : ''}`}>{'Project status:'}</div>
                                <Select
                                    options={statusOptions}
                                    value={{value: status, label: ProjectStatus[status] ? ProjectStatus[status].label : ''}}
                                    onChange={this.handleStatusChange}
                                    isSearchable={false}
                                    className={`control-select${this.state.validation.status ? ' invalid' : ''}`}
                                    classNamePrefix={'control-select'}
                                />
                            </div>
                            <div className={'detail-group size-8'}>
                                <div className={`detail-label${editedData.statusNote !== undefined && selected ? ' value-changed' : ''}`}>{'Status note:'}</div>
                                <Input
                                    placeholder={'Status note...'}
                                    className={`detail-input textarea${this.state.validation.statusNote ? ' invalid' : ''}`}
                                    onChange={this.handleStatusNoteChange}
                                    value={statusNote}
                                    type={'textarea'}
                                />
                            </div>
                        </div>

                        {/* ------------------ CLIENT TIMING ------------------ */}
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group column size-12'}>
                                <div onClick={() => this.handleTimingChange()} className={`detail-label clickable column${editedData.timing !== undefined && selected ? ' value-changed' : ''}`}>
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
                                <div onClick={() => this.handleTeamChange()} className={`detail-label clickable column${editedData.team !== undefined && selected ? ' value-changed' : ''}`}>
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
                                    className={`detail-label clickable column${editedData.company !== undefined && selected ? ' value-changed' : ''}`}
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
                                                    <div data-tooltip={'UPP Client'}>
                                                        <FontAwesomeIcon
                                                            onClick={() => this.companyFlagClicked(i, companyLine.flag, CompanyFlag.UPP_CLIENT)}
                                                            className={`control-flag-icon${companyLine.flag.indexOf(CompanyFlag.UPP_CLIENT) >= 0 ? ' active' : ''}`}
                                                            icon={Icons.ICON_EDITOR_FLAG_CLIENT}
                                                        />
                                                    </div>
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
                                                onChange={event => this.handleCompanyChange(i, {note: event.target.value})} value={companyLine.note}
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
                                    className={`detail-label clickable column${editedData.person !== undefined && selected ? ' value-changed' : ''}`}
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
                                                    <div data-tooltip={'Business'}>
                                                        <FontAwesomeIcon
                                                            onClick={() => this.personFlagClicked(i, personLine.flag, PersonFlag.BUSINESS)}
                                                            className={`control-flag-icon${personLine.flag.indexOf(PersonFlag.BUSINESS) >= 0 ? ' active' : ''}`}
                                                            icon={Icons.ICON_EDITOR_FLAG_BUSINESS}
                                                        />
                                                    </div>
                                                    <div data-tooltip={'Creativity'}>
                                                        <FontAwesomeIcon
                                                            onClick={() => this.personFlagClicked(i, personLine.flag, PersonFlag.CREATIVITY)}
                                                            className={`control-flag-icon${personLine.flag.indexOf(PersonFlag.CREATIVITY) >= 0 ? ' active' : ''}`}
                                                            icon={Icons.ICON_EDITOR_FLAG_CREATIVITY}
                                                        />
                                                    </div>
                                                    <div data-tooltip={'Organization'}>
                                                        <FontAwesomeIcon
                                                            onClick={() => this.personFlagClicked(i, personLine.flag, PersonFlag.ORGANIZATION)}
                                                            className={`control-flag-icon${personLine.flag.indexOf(PersonFlag.ORGANIZATION) >= 0 ? ' active' : ''}`}
                                                            icon={Icons.ICON_EDITOR_FLAG_ORGANIZE}
                                                        />
                                                    </div>
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
                                                onChange={event => this.handlePersonChange(i, {note: event.target.value})} value={personLine.note}
                                                placeholder={'Note...'}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* -------------------------------------------- */}
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
        try {
            if (this.props.selected) await this.props.update(this.props.selected);
            else await this.props.create();
            this.close();
        } catch (e) {}
    };

    remove = async () => {
        try {
            await this.props.remove(this.props.selected);
            this.close();
        } catch(e) {}
    };

    // *****************************************************************************************************************
    // HELPERS
    // *****************************************************************************************************************
    checkValidity() {
        if(this.validationTimer) return;
        const time = +new Date() - this.lastValidation;
        if(time > Constants.VALIDATION_DELAY_MS) this.setValidation();
        else this.validationTimer = setTimeout(this.setValidation, Constants.VALIDATION_DELAY_MS - time);
    }

    isNameUsed = name => {
        if(!name || !this.props.selected) return false;
        const filtered = Object.keys(this.props.projects).filter(projectId => this.props.projects[projectId].name.toLowerCase().trim() === name.toLowerCase().trim()).filter(projectId => projectId !== this.props.selected);
        return filtered.length > 0;
    };

    handleRemoveArmed = () => {
        this.setState({removeArmed: !this.state.removeArmed})
    };

    updateEditedData = updateData => {
        const object = this.props.selected ? this.props.projects[this.props.selected] : {};
        const newData = {...this.props.editedData, ...updateData};
        for (const key of Object.keys(newData)) {
            if (object && areEquivalent(object[key], newData[key])) {
                delete newData[key];
                switch (key) {
                    case 'status':
                        delete newData['statusNote'];
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

    getPersonOptions = persons => {
        return Object.keys(persons).sort((a, b) => persons[a].name.localeCompare(persons[b].name)).map(personId => ({
            value: personId,
            label: persons[personId].name
        }));
    };

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
        //console.log('VALIDATION')
        if(this.validationTimer) clearTimeout(this.validationTimer);
        this.validationTimer = null;
        this.lastValidation = +new Date();
        const originalObject = this.props.selected && this.props.projects && this.props.projects[this.props.selected] ? this.props.projects[this.props.selected] : {};
        if(!originalObject._id && this.props.selected) return true; // when refresh, no data fetched yet
        const object = Object.assign({}, originalObject, this.props.editedData);
        let validation = {};

        if(!object.name || !object.name.trim()) validation['name'] = {field: 'Project Name', status: 'Must be set'};
        if(this.isNameUsed(object.name)) validation['name'] = {field: 'Project Name', status: 'Is not unique'};
        if(!object.status) validation['status'] = {field: 'Project status', status: 'Must be set'};
        if(!ProjectStatus[object.status]) validation['status'] = {field: 'Project status', status: 'Is invalid'};

        if((object.status === ProjectStatus.ON_HOLD.id || object.status === ProjectStatus.REFUSED.id || object.status === ProjectStatus.LOST.id) && (!object.statusNote || !object.statusNote.trim())) validation['statusNote'] = {field: 'Status note', status: `Must be set for status "${ProjectStatus[object.status].label}"`};

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

        const disableSave = Object.keys(validation).length > 0 || Object.keys(this.props.editedData).length === 0;
        if(areEquivalent(validation, this.state.validation)) validation = this.state.validation;
        this.setState({validation: validation, saveDisabled: disableSave});
    };

    // *****************************************************************************************************************
    // VALUES CHANGE HANDLERS
    // *****************************************************************************************************************
    handleNameChange = event => {
        this.props.editItem(this.updateEditedData({name: event.target.value}));
    };

    handleStatusChange = option => {
        if(option.value === ProjectStatus.ON_HOLD.id || option.value === ProjectStatus.REFUSED.id || option.value === ProjectStatus.LOST.id) {
            this.props.editItem(this.updateEditedData({status: option.value, statusNote: ''}));
        } else {
            this.props.editItem(this.updateEditedData({status: option.value}));
        }
    };

    handleStatusNoteChange = event => {
        this.props.editItem(this.updateEditedData({statusNote: event.target.value}));
    };

    handleLastContactChange = date => {
        this.props.editItem(this.updateEditedData({lastContact: date ? date.startOf('day') : null}));
    };

    handleTimingChange = (index, data) => {
        const emptyItem = {type: 'CLIENT', date: null, dateTo: null, category: 100, label: ProjectClientTiming.GO_AHEAD.id};
        const object = this.props.projects[this.props.selected];
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
        const object = this.props.projects[this.props.selected];
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
                    if(userBookingRoles.indexOf(role) >= 0 && roles.indexOf(TeamRole[id].id) < 0 && (TeamRole[id].multi || projectUsedRoles.indexOf(TeamRole[id].id) < 0)) { //not used in others lines
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
        const project = this.props.projects[this.props.selected];
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
        this.handleCompanyChange(index, {flag: newFlags})
    };

    handlePersonChange = (index, data) => {
        const emptyItem = {id: null, profession: [], flag: [], note: '', company: null};
        const project = this.props.projects[this.props.selected];
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

    personFlagClicked = (index, flags, flag) => {
        const newFlags = [...flags];
        const i = newFlags.indexOf(flag);
        if(i < 0) newFlags.push(flag);
        else newFlags.splice(i, 1);
        this.handlePersonChange(index, {flag: newFlags})
    };

    addFromBox = () => {
        if(!this.props.box) return;
        const project = this.props.projects[this.props.selected];
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
    }
};
