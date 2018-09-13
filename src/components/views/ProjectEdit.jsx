import React, {Fragment} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Scrollbars } from 'react-custom-scrollbars';
import { Input } from 'reactstrap';
import Select from 'react-select';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import * as Constants from '../../constants/Constatnts';

import * as Icons from '../../constants/Icons';

import * as ProjectStatus from '../../constants/ProjectStatus';
import * as TeamRole from '../../constants/TeamRole';

const statusOptions = Object.keys(ProjectStatus).map(key => ({value: ProjectStatus[key].id, label: ProjectStatus[key].label}));

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
        const lastContact = editedData.lastContact !== undefined ? editedData.lastContact ? moment(editedData.lastContact) : null : projects[selected] && projects[selected].lastContact ? moment(projects[selected].lastContact) : null;

        if(Object.keys(editedData).length === 0) team.sort((a, b) => {
           const sa = a.role.map(role => TeamRole[role] ? TeamRole[role].sort : 0).reduce((a, b) => Math.min(a, b));
           const sb = b.role.map(role => TeamRole[role] ? TeamRole[role].sort : 0).reduce((a, b) => Math.min(a, b));
           return sa - sb;
        });
        return (
            <div className={'app-body'}>
                {/* ------------------ TOOLBOX ------------------ */}
                <div className={'app-toolbox'}>
                    <div className={'inner-container'}>
                        <div className={'toolbox-group'}>
                            <div onClick={this.close} className={'tool-box-button'}>{'Cancel'}</div>
                            <div onClick={this.state.saveDisabled ? undefined : this.save} className={`tool-box-button green${this.state.saveDisabled ? ' disabled' : ''}`}>{selected ? 'Save' : 'Create'}</div>
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
                <Scrollbars autoHide={true} autoHideTimeout={800} autoHideDuration={200}>
                    <div className={'detail-body'}>

                        {/* ------------------ NAME, CONTACT ------------------ */}
                        <div className={'detail-row'}>
                            <div className={'detail-group size-8'}>
                                <div className={`detail-label${typeof editedData.name !== 'undefined' && selected  ? ' value-changed' : ''}`}>{'Project name:'}</div>
                                <Input
                                    placeholder={'Project name...'}
                                    autoFocus={!selected}
                                    className={`detail-input${this.state.validation.name ? ' invalid' : ''}`}
                                    onChange={this.handleNameChange}
                                    value={name}
                                />
                            </div>
                            <div className={'detail-group size-4'}>
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
                                    className={`detail-input${this.state.validation.statusNote ? ' invalid' : ''}`}
                                    onChange={this.handleStatusNoteChange}
                                    value={statusNote}
                                />
                            </div>
                        </div>

                        {/* ------------------ TEAM ------------------ */}
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group column size-12'}>
                                <div onClick={() => this.handleTeamChange()} className={`detail-label clickable column${editedData.team !== undefined && selected ? ' value-changed' : ''}`}>
                                    {'UPP Team'}<FontAwesomeIcon className={'label-icon add'} icon={Icons.ICON_EDITOR_ITEM_ADD}/>
                                </div>
                                <div className={'detail-group-wrapper'}>
                                    {team.map((line, i) =>
                                        <div className={`detail-array-line size-6 spacer`} key={i}>
                                            <FontAwesomeIcon className={'remove-icon'} onClick={() => this.handleTeamChange(i)} icon={Icons.ICON_EDITOR_LINE_REMOVE}/>
                                            <div className={'line-content'}>
                                                <Select
                                                    options={this.getTeamUsersOptions(team, i)}
                                                    value={line.id ? {value: line.id, label: users[line.id] ? users[line.id].name : line.id  } : null}
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
                                <div onClick={() => this.handleCompanyChange()} className={`detail-label clickable column${editedData.company !== undefined && selected ? ' value-changed' : ''}`}>{'Companies'}<FontAwesomeIcon className={'label-icon add'} icon={Icons.ICON_EDITOR_ITEM_ADD}/></div>
                                {company.map((companyLine, i) =>
                                    <div className={`detail-array-line`} key={i}>
                                        <FontAwesomeIcon className={'remove-icon'} onClick={() => this.handleCompanyChange(i)} icon={Icons.ICON_EDITOR_LINE_REMOVE}/>
                                        <div className={'line-content'}>
                                            <Select
                                                options={this.getCompanyOptions(companies)}
                                                value={companyLine.id ? {value: companyLine.id, label: companies[companyLine.id] ? companies[companyLine.id].name : companyLine.id  } : null}
                                                onChange={option => this.handleCompanyChange(i, {id: !option || !option.value ? null : option.value})}
                                                isSearchable={true}
                                                isMulti={false}
                                                isClearable={true}
                                                className={`control-select company-name${companyLine.id === null ? ' invalid' : ''}`}
                                                classNamePrefix={'control-select'}
                                                placeholder={'Company...'}
                                            />
                                            <Select
                                                options={[]}
                                                //value={companyLine.role.map(role => ({value: role, label: CompanyRole[role] ? CompanyRole[role].label : role}))}
                                                onChange={option => this.handleCompanyChange(i, {role: !option ? [] : option.map(o => o.value)})}
                                                isSearchable={false}
                                                isMulti={true}
                                                isClearable={true}
                                                className={`control-select company-role`}
                                                classNamePrefix={'control-select'}
                                                placeholder={'Role...'}
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
                                <div onClick={() => this.handlePersonChange()} className={`detail-label clickable column${editedData.person !== undefined && selected ? ' value-changed' : ''}`}>{'People'}<FontAwesomeIcon className={'label-icon add'} icon={Icons.ICON_EDITOR_ITEM_ADD}/></div>
                                {person.map((personLine, i) =>
                                    <div className={`detail-array-line`} key={i}>
                                        <FontAwesomeIcon className={'remove-icon'} onClick={() => this.handlePersonChange(i)} icon={Icons.ICON_EDITOR_LINE_REMOVE}/>
                                        <div className={'line-content'}>
                                            <Select
                                                options={this.getPersonOptions(persons)}
                                                value={personLine.id ? {value: personLine.id, label: persons[personLine.id] ? persons[personLine.id].name : personLine.id  } : null}
                                                onChange={option => this.handlePersonChange(i, {id: !option || !option.value ? null : option.value})}
                                                isSearchable={true}
                                                isMulti={false}
                                                isClearable={true}
                                                className={`control-select person-name${personLine.id === null ? ' invalid' : ''}`}
                                                classNamePrefix={'control-select'}
                                                placeholder={'Person...'}
                                            />
                                            <Select
                                                options={[]}
                                                //value={personLine.role.map(role => ({value: role, label: PersonRole[role] ? PersonRole[role].label : role}))}
                                                onChange={option => this.handlePersonChange(i, {role: !option ? [] : option.map(o => o.value)})}
                                                isSearchable={false}
                                                isMulti={true}
                                                isClearable={true}
                                                className={`control-select person-role`}
                                                classNamePrefix={'control-select'}
                                                placeholder={'Role...'}
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

    save = () => {
        if(this.props.selected) this.props.update();
        else this.props.create();
        this.close();
    };

    remove = () => {
        this.props.remove();
        this.close();
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
        if(!name) return false;
        return Object.keys(this.props.projects).filter(id => id !== this.props.selected).map(id => this.props.projects[id].name.toLowerCase()).indexOf(name.toLowerCase()) >= 0;
    };

    handleRemoveArmed = () => {
        this.setState({removeArmed: !this.state.removeArmed})
    };

    updateEditedData = updateData => {
        const object = this.props.selected ? this.props.projects[this.props.selected] : {};
        const newData = {...this.props.editedData, ...updateData};
        for (const key of Object.keys(newData)) {
            if (object && this.areEquivalent(object[key], newData[key])) {
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

    areEquivalent = (a, b) => { //TODO do better check
        return JSON.stringify(a) === JSON.stringify(b);
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
      return Object.keys(companies).map(companyId => ({
          value: companyId,
          label: companies[companyId].name
      }));
    };

    getPersonOptions = persons => {
        return Object.keys(persons).map(personId => ({
            value: personId,
            label: persons[personId].name
        }));
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

        if(!object.name || !object.name.trim()) validation['name'] = {field: 'Project name', status: 'Must be set'};
        if(this.isNameUsed(object.name)) validation['name'] = {field: 'Project name', status: 'Is not unique'};
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
        if(object.person && object.person.some(person => person.id === null)) validation['person'] = {field: 'People', status: 'Some person is not set'};

        const disableSave = Object.keys(validation).length > 0 || Object.keys(this.props.editedData).length === 0;
        if(this.areEquivalent(validation, this.state.validation)) validation = this.state.validation;
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

    handleProducerChange = option => {
        this.props.editItem(this.updateEditedData({producer: option ? option.value : null}));
    };

    handleManagerChange = option => {
        this.props.editItem(this.updateEditedData({manager: option ? option.value : null}));
    };

    handleSupervisorChange = option => {
        this.props.editItem(this.updateEditedData({supervisor: option ? option.value : null}));
    };

    handleSupervisor2Change = (option, meta) => {
        this.props.editItem(this.updateEditedData({supervisor2: option ? option.value : null}));
        if(meta.action === 'clear') this.setState({supervisor2: false});
    };

    handleLead2DChange = option => {
        this.props.editItem(this.updateEditedData({lead2D: option ? option.value : null}));
    };

    handleLead3DChange = option => {
        this.props.editItem(this.updateEditedData({lead3D: option ? option.value : null}));
    };

    handleLeadMPChange = option => {
        this.props.editItem(this.updateEditedData({leadMP: option ? option.value : null}));
    };

    handleLastContactChange = date => {
        this.props.editItem(this.updateEditedData({lastContact: date ? date.startOf('day') : null}));
    };

    handleTeamChange = (index, data) => {
        const field = 'team';
        const emptyItem = {id: null, role: [], note: ''};
        const object = this.props.projects[this.props.selected];
        const newData = this.props.editedData[field] ? [...this.props.editedData[field]] : object ? [...object[field]] : [];
        if(typeof index === 'undefined' && typeof data === 'undefined') { //ADD
            if (this.props.editedData[field] && this.props.editedData[field].some(item => item.id === null)) return;
            newData.push({id: null, role: [], note: ''}) //TODO empty
        } else if(typeof index === 'undefined') { //ADD - fill id in data
            newData.push({...emptyItem, id: data});
        } else if(typeof data === 'undefined') {//REMOVE at index
            newData.splice(index, 1);
        } else { //data contains update for line index
            newData[index] = {...newData[index], ...data}
        }
        const editedData = this.updateEditedData({[field]: newData});
        if(data && data.id && editedData[field][index].role.length === 0) {
            const userBookingRoles = this.props.users[data.id] ? this.props.users[data.id].role : [];
            const projectUsedRoles = editedData[field].reduce((usedRoles, line) => usedRoles.concat(line.role), []);
            const possibleRoles = Object.keys(TeamRole).reduce((roles, id) => {
                const teamRole = Array.isArray(TeamRole[id].role) ? TeamRole[id].role : [TeamRole[id].role];
                for(const role of teamRole) {
                    if(userBookingRoles.indexOf(role) >= 0 && roles.indexOf(TeamRole[id].id) < 0 && (TeamRole[id].multi || projectUsedRoles.indexOf(TeamRole[id].id) < 0)) { //not used in others lines
                        roles.push(TeamRole[id].id);
                    }
                }
                return roles;
            }, []);
            editedData[field][index].role = possibleRoles;
        }
        this.props.editItem(editedData);
    };





    handleCompanyChange = (index, data) => {
        const field = 'company';
        const emptyItem = {id: null, role: [], flag: [], note: ''};
        const project = this.props.projects[this.props.selected];
        const newData = this.props.editedData[field] ? [...this.props.editedData[field]] : project ? [...project[field]] : [];

        /*
        const project = this.props.projects[this.props.selected];
        const newCompany = this.props.editedData.company ? [...this.props.editedData.company] : project ? [...project.company] : [];
        if(typeof index === 'undefined' && typeof data === 'undefined') { //ADD
            if (this.props.editedData.company && this.props.editedData.company.some(company => company.id === null)) return;
            newCompany.push({id: null, role: [], note: ''})
        } else if(typeof index === 'undefined') { //ADD - fill id in data
            newCompany.push({id: data, role: [], note: ''})
        } else if(typeof data === 'undefined') {//REMOVE at index
            newCompany.splice(index, 1);
        } else { //data contains update for line index
            newCompany[index] = {...newCompany[index], ...data}
        }
        this.props.editItem(this.updateEditedData({
            company: newCompany
        }));
        */
    };

    handlePersonChange = (index, data) => {
        const project = this.props.projects[this.props.selected];
        const newPerson = this.props.editedData.person ? [...this.props.editedData.person] : project ? [...project.person] : [];
        if(typeof index === 'undefined' && typeof data === 'undefined') { //ADD
            if(this.props.editedData.person && this.props.editedData.person.some(person => person.id === null)) return;
            newPerson.push({id: null, role: [], note: '', profession: []})
        } else if(typeof index === 'undefined') { //ADD - fill id in data
            newPerson.push({id: data, role: [], note: '', profession: []})
        } else if(typeof data === 'undefined') {//REMOVE at index
            newPerson.splice(index, 1);
        } else { //data contains update for line index
            newPerson[index] = {...newPerson[index], ...data}
        }
        this.props.editItem(this.updateEditedData({
            person: newPerson
        }));
    };




    addFromBox = () => {
        if(!this.props.box) return;
        const project = this.props.projects[this.props.selected];
        const newCompany = this.props.editedData.company ? [...this.props.editedData.company] : project ? [...project.company] : [];
        const newPerson = this.props.editedData.person ? [...this.props.editedData.person] : project ? [...project.person] : [];

        for (const item of this.props.box) {
            if (this.props.companies[item]) {
                if(!newCompany.some(company => company.id === item)) newCompany.push({id: item, role: [], note: ''});
            } else if (this.props.persons[item]) {
                if(!newPerson.some(person => person.id === item)) newPerson.push({id: item, role: [], note: '', profession: []});
            }
        }

        this.props.editItem(this.updateEditedData({
            company: newCompany,
            person: newPerson
        }));
    };
};
