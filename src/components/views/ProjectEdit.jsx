import React, {Fragment} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Scrollbars } from 'react-custom-scrollbars';
import { Input } from 'reactstrap';
import Select from 'react-select';

import * as ProjectStatus from '../../constants/ProjectStatus';
import * as CompanyRole from '../../constants/CompanyRole';
import * as CompanyRating from '../../constants/CompanyRating';
import * as PersonRole from '../../constants/PersonRole';
import * as PersonRating from '../../constants/PersonRating';
import * as PersonProfession from '../../constants/PersonProfession';

const statusOptions = Object.keys(ProjectStatus).map(key => ({value: key, label: ProjectStatus[key].label}));
const companyRoleOptions = Object.keys(CompanyRole).map(key => ({value: key, label: CompanyRole[key].label}));
const companyRatingOptions = Object.keys(CompanyRating).map(key => ({value: key, label: CompanyRating[key].label}));
const personRoleOptions = Object.keys(PersonRole).map(key => ({value: key, label: PersonRole[key].label}));
const personRatingOptions = Object.keys(PersonRating).map(key => ({value: key, label: PersonRating[key].label}));
const personProfessionOptions = Object.keys(PersonProfession).map(key => ({value: key, label: PersonProfession[key].label}));

const ICON_CHECKBOX_CHECKED = ['far','check-square'];
const ICON_CHECKBOX_UNCHECKED = ['far', 'square'];
const ICON_VALIDATION = 'exclamation-circle';

const ICON_LABEL_ITEM_ADD = 'plus-circle';
const ICON_LABEL_ITEM_REMOVE = 'minus-circle';

const ICON_LINE_REMOVE = 'trash';

export default class ProjectEdit extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            saveDisabled: true,
            validation: {},
            removeArmed: false,
            supervisor2: false
        };
    }

    componentDidMount() {
        this.checkProject();
    }

    componentDidUpdate(prevProps) {
        if(this.props.editedData !== prevProps.editedData || this.props.projects !== prevProps.projects) this.checkProject();
    }

    render() {
        const {selectedProject, editedData, projects, companies, persons, users} = this.props;

        const name = editedData.name !== undefined ? editedData.name : !selectedProject ? '' : projects[selectedProject] ? projects[selectedProject].name : '';
        const status = editedData.status !== undefined ? editedData.status : projects[selectedProject] ? projects[selectedProject].status : null;
        const statusNote = editedData.statusNote !== undefined ? editedData.statusNote : projects[selectedProject] ? projects[selectedProject].statusNote : '';
        const producer = editedData.producer !== undefined ? editedData.producer : projects[selectedProject] ? projects[selectedProject].producer : null;
        const manager = editedData.manager !== undefined ? editedData.manager : projects[selectedProject] ? projects[selectedProject].manager : null;
        const supervisor = editedData.supervisor !== undefined ? editedData.supervisor : projects[selectedProject] ? projects[selectedProject].supervisor : null;
        const supervisor2 = editedData.supervisor2 !== undefined ? editedData.supervisor2 : projects[selectedProject] ? projects[selectedProject].supervisor2 : null;
        const lead2D = editedData.lead2D !== undefined ? editedData.lead2D : projects[selectedProject] ? projects[selectedProject].lead2D : null;
        const lead3D = editedData.lead3D !== undefined ? editedData.lead3D : projects[selectedProject] ? projects[selectedProject].lead3D : null;
        const leadMP = editedData.leadMP !== undefined ? editedData.leadMP : projects[selectedProject] ? projects[selectedProject].leadMP : null;
        const company = editedData.company !== undefined ? editedData.company : projects[selectedProject] ? projects[selectedProject].company : [];
        const person = editedData.person !== undefined ? editedData.person : projects[selectedProject] ? projects[selectedProject].person : [];


        let canSupervisorChangeNumber = 0;
        if(this.state.supervisor2) {
            if (typeof editedData.supervisor2 === 'undefined' && (!projects[selectedProject] || !projects[selectedProject].supervisor2)) canSupervisorChangeNumber = -1;
        } else {
            if((editedData.supervisor !== null && projects[selectedProject] && projects[selectedProject].supervisor) || editedData.supervisor) canSupervisorChangeNumber = 1;
        }

        return (
            <div className={'app-body'}>
                <div className={'app-toolbox'}>
                    <div className={'inner-container'}>
                        <div className={'toolbox-group'}>
                            <div onClick={this.close} className={'tool-box-button'}>{'Cancel'}</div>
                            <div onClick={this.state.saveDisabled ? undefined : this.save} className={`tool-box-button green${this.state.saveDisabled ? ' disabled' : ''}`}>{selectedProject ? 'Save' : 'Create'}</div>
                            <div className={'tool-box-validation'}>
                                <FontAwesomeIcon className={`tool-box-validation-icon${Object.keys(this.state.validation).length > 0 ? ' active' : ''}`} icon={ICON_VALIDATION}/>
                                <div className={'tool-box-validation-container'}>
                                    {Object.keys(this.state.validation).map(validationField => <div key={validationField}>{`${this.state.validation[validationField].field}: ${this.state.validation[validationField].status}`}</div>)}
                                </div>
                            </div>
                            {!selectedProject ? null :
                                <Fragment>
                                    <div onClick={!this.state.removeArmed ? undefined : this.remove} className={`tool-box-button remove red${!this.state.removeArmed ? ' disabled' : ''}`}>{'Remove Project'}</div>
                                    <FontAwesomeIcon className={`tool-box-checkbox`} onClick={this.handleRemoveArmed} icon={this.state.removeArmed ? ICON_CHECKBOX_CHECKED : ICON_CHECKBOX_UNCHECKED} style={{cursor: 'pointer'}}/>
                                </Fragment>
                            }
                        </div>
                    </div>
                    <div className={'inner-container left-auto'}>
                    {selectedProject && projects[selectedProject] ? <div className={'toolbox-id'}>{projects[selectedProject].projectId}</div> : null}
                    </div>
                </div>
                <Scrollbars autoHide={true} autoHideTimeout={800} autoHideDuration={200}>
                    <div className={'detail-body'}>
                        <div className={'detail-row'}>
                            <div className={'detail-group size-7'}>
                                <div className={`detail-label${typeof editedData.name !== 'undefined' && selectedProject  ? ' value-changed' : ''}`}>{'Project name:'}</div>
                                <Input className={`detail-input${this.state.validation.name ? ' invalid' : ''}`} onChange={this.handleNameChange} value={name}/>
                            </div>
                            <div className={'detail-group size-5'}>
                                <div className={`detail-label${typeof editedData.status !== 'undefined' && selectedProject ? ' value-changed' : ''}`}>{'Project status:'}</div>
                                <Select
                                    options={statusOptions}
                                    value={{value: status, label: ProjectStatus[status] ? ProjectStatus[status].label : ''}}
                                    onChange={this.handleStatusChange}
                                    isSearchable={false}
                                    className={`control-select${this.state.validation.status ? ' invalid' : ''}`}
                                    classNamePrefix={'control-select'}
                                />
                            </div>
                        </div>
                        <div className={'detail-row'}>
                            <div className={'detail-group size-12'}>
                                <div className={`detail-label${editedData.statusNote !== undefined && selectedProject ? ' value-changed' : ''}`}>{'Status note:'}</div>
                                <Input className={`detail-input${this.state.validation.statusNote ? ' invalid' : ''}`} onChange={this.handleStatusNoteChange} value={statusNote}/>
                            </div>
                        </div>
                        <div className={'detail-spacer'}/>
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group size-4'}>
                                <div className={`detail-label${typeof editedData.producer !== 'undefined' && selectedProject ? ' value-changed' : ''}`}>{'Producer:'}</div>
                                <Select
                                    options={this.getUsersOptions(users, ['producer', 'manager'])}
                                    value={producer ? {value: producer, label: users[producer] ? users[producer].name : producer} : null}
                                    onChange={this.handleProducerChange}
                                    isSearchable={true}
                                    isMulti={false}
                                    isClearable={true}
                                    className={`control-select${this.state.validation.producer ? ' invalid' : ''}`}
                                    classNamePrefix={'control-select'}
                                    placeholder={'Producer...'}
                                />
                            </div>
                            <div className={'detail-group size-4'}>
                                <div className={`detail-label${typeof editedData.manager !== 'undefined' && selectedProject ? ' value-changed' : ''}`}>{'Manager:'}</div>
                                <Select
                                    options={this.getUsersOptions(users, 'manager')}
                                    value={manager ? {value: manager, label: users[manager] ? users[manager].name : manager} : null}
                                    onChange={this.handleManagerChange}
                                    isSearchable={true}
                                    isMulti={false}
                                    isClearable={true}
                                    className={`control-select${this.state.validation.manager ? ' invalid' : ''}`}
                                    classNamePrefix={'control-select'}
                                    placeholder={'Manager...'}
                                />
                            </div>
                            <div className={'detail-group size-4'}>
                                <div
                                    onClick={canSupervisorChangeNumber === 1 ? () => this.setState({supervisor2: true}) : canSupervisorChangeNumber === -1 ? () => this.setState({supervisor2: false}) : undefined}
                                    className={`detail-label${(typeof editedData.supervisor !== 'undefined' || typeof editedData.supervisor2 !== 'undefined') && selectedProject ? ' value-changed' : ''}${canSupervisorChangeNumber !== 0 ? ' clickable' : ''}`}
                                >
                                    {'Supervisor:'}
                                    {canSupervisorChangeNumber === 1 ? <FontAwesomeIcon className={'label-icon add'} icon={ICON_LABEL_ITEM_ADD}/> : canSupervisorChangeNumber === -1 ? <FontAwesomeIcon className={'label-icon remove'} icon={ICON_LABEL_ITEM_REMOVE}/> : null}
                                </div>
                                <div className={`column-wrapper`}>
                                    <Select
                                        options={this.getUsersOptions(users, 'supervisor', supervisor2)}
                                        value={supervisor ? {value: supervisor, label: users[supervisor] ? users[supervisor].name : supervisor} : null}
                                        onChange={this.handleSupervisorChange}
                                        isSearchable={true}
                                        isMulti={false}
                                        isClearable={true}
                                        className={`control-select no-label${this.state.validation.supervisor ? ' invalid' : ''}`}
                                        classNamePrefix={'control-select'}
                                        placeholder={'Supervisor...'}
                                    />
                                    {supervisor2 || this.state.supervisor2 ? <Select
                                        options={this.getUsersOptions(users, 'supervisor', supervisor)}
                                        value={supervisor2 ? {value: supervisor2, label: users[supervisor2] ? users[supervisor2].name : supervisor2} : null}
                                        onChange={this.handleSupervisor2Change}
                                        isSearchable={true}
                                        isMulti={false}
                                        isClearable={true}
                                        className={`control-select no-label${this.state.validation.supervisor2 ? ' invalid' : ''}`}
                                        classNamePrefix={'control-select'}
                                        placeholder={'Supervisor 2...'}
                                    /> : null}
                                </div>
                            </div>
                            <div className={'detail-group size-4'}>
                                <div className={`detail-label${typeof editedData.lead2D !== 'undefined' && selectedProject ? ' value-changed' : ''}`}>{'Lead 2D:'}</div>
                                <Select
                                    options={this.getUsersOptions(users, 'lead2D')}
                                    value={lead2D ? {value: lead2D, label: users[lead2D] ? users[lead2D].name : lead2D} : null}
                                    onChange={this.handleLead2DChange}
                                    isSearchable={true}
                                    isMulti={false}
                                    isClearable={true}
                                    className={`control-select${this.state.validation.lead2D ? ' invalid' : ''}`}
                                    classNamePrefix={'control-select'}
                                    placeholder={'Lead 2D...'}
                                />
                            </div>
                            <div className={'detail-group size-4'}>
                                <div className={`detail-label${typeof editedData.lead3D !== 'undefined' && selectedProject ? ' value-changed' : ''}`}>{'Lead 3D:'}</div>
                                <Select
                                    options={this.getUsersOptions(users, 'lead3D')}
                                    value={lead3D ? {value: lead3D, label: users[lead3D] ? users[lead3D].name : lead3D} : null}
                                    onChange={this.handleLead3DChange}
                                    isSearchable={true}
                                    isMulti={false}
                                    isClearable={true}
                                    className={`control-select${this.state.validation.lead3D ? ' invalid' : ''}`}
                                    classNamePrefix={'control-select'}
                                    placeholder={'Lead 3D...'}
                                />
                            </div>
                            <div className={'detail-group size-4'}>
                                <div className={`detail-label${typeof editedData.leadMP !== 'undefined' && selectedProject ? ' value-changed' : ''}`}>{'Lead MP:'}</div>
                                <Select
                                    options={this.getUsersOptions(users, 'leadMP')}
                                    value={leadMP ? {value: leadMP, label: users[leadMP] ? users[leadMP].name : leadMP} : null}
                                    onChange={this.handleLeadMPChange}
                                    isSearchable={true}
                                    isMulti={false}
                                    isClearable={true}
                                    className={`control-select${this.state.validation.leadMP ? ' invalid' : ''}`}
                                    classNamePrefix={'control-select'}
                                    placeholder={'Lead MP...'}
                                />
                            </div>
                        </div>

                        <div className={'detail-row spacer'}>
                            <div className={'detail-group column size-12'}>
                                <div onClick={() => this.handleCompanyChange()} className={`detail-label clickable column${editedData.statusNote !== undefined && selectedProject ? ' value-changed' : ''}`}>{'Companies'}<FontAwesomeIcon className={'label-icon add'} icon={ICON_LABEL_ITEM_ADD}/></div>
                                {company.map((companyLine, i) =>
                                    <div className={`detail-array-line`} key={i}>
                                        <FontAwesomeIcon className={'remove-icon'} onClick={() => this.handleCompanyChange(i)} icon={ICON_LINE_REMOVE}/>
                                        <div className={'line-content'}>
                                            <Select
                                                options={this.getCopmanyOptions(companies)}
                                                value={companyLine.id ? {value: companyLine.id, label: companies[companyLine.id] ? companies[companyLine.id].name : companyLine.id  } : null}
                                                onChange={option => this.handleCompanyChange(i, {id: !option || !option.value ? null : option.value})}
                                                isSearchable={true}
                                                isMulti={false}
                                                isClearable={true}
                                                className={`control-select name${companyLine.id === null ? ' invalid' : ''}`}
                                                classNamePrefix={'control-select'}
                                                placeholder={'Company...'}
                                            />
                                            <Select
                                                options={companyRoleOptions}
                                                value={companyLine.role.map(role => ({value: role, label: CompanyRole[role].label}))}
                                                onChange={option => this.handleCompanyChange(i, {role: !option ? [] : option.map(o => o.value)})}
                                                isSearchable={false}
                                                isMulti={true}
                                                isClearable={true}
                                                className={`control-select role`}
                                                classNamePrefix={'control-select'}
                                                placeholder={'Role...'}
                                            />
                                            <Select
                                                options={companyRatingOptions}
                                                value={companyLine.rating.map(rating => ({value: rating, label: CompanyRating[rating].label}))}
                                                onChange={option => this.handleCompanyChange(i, {rating: !option ? [] : option.map(o => o.value)})}
                                                isSearchable={false}
                                                isMulti={true}
                                                isClearable={true}
                                                className={`control-select rating`}
                                                classNamePrefix={'control-select'}
                                                placeholder={'Rating...'}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={'detail-row spacer'}>
                            <div onClick={() => this.handlePersonChange()} className={'detail-group column size-12'}>
                                <div className={`detail-label clickable column${editedData.statusNote !== undefined && selectedProject ? ' value-changed' : ''}`}>{'People'}<FontAwesomeIcon className={'label-icon add'} icon={ICON_LABEL_ITEM_ADD}/></div>
                                {person.map((personLine, i) =>
                                    <div className={`detail-array-line`} key={i}>
                                        <FontAwesomeIcon className={'remove-icon'} onClick={() => this.handleCompanyChange(i)} icon={ICON_LINE_REMOVE}/>
                                        <div className={'line-content'}>
                                            <Select
                                                options={this.getPersonOptions(persons)}
                                                value={personLine.id ? {value: personLine.id, label: persons[personLine.id] ? persons[personLine.id].name : personLine.id  } : null}
                                                onChange={option => this.handlePersonChange(i, {id: !option || !option.value ? null : option.value})}
                                                isSearchable={true}
                                                isMulti={false}
                                                isClearable={true}
                                                className={`control-select name${personLine.id === null ? ' invalid' : ''}`}
                                                classNamePrefix={'control-select'}
                                                placeholder={'Person...'}
                                            />
                                            <Select
                                                options={personRoleOptions}
                                                value={personLine.role.map(role => ({value: role, label: PersonRole[role].label}))}
                                                onChange={option => this.handlePersonChange(i, {role: !option ? [] : option.map(o => o.value)})}
                                                isSearchable={false}
                                                isMulti={true}
                                                isClearable={true}
                                                className={`control-select role`}
                                                classNamePrefix={'control-select'}
                                                placeholder={'Role...'}
                                            />
                                            <Select
                                                options={personProfessionOptions}
                                                value={personLine.profession.map(profession => ({value: profession, label: PersonProfession[profession].label}))}
                                                onChange={option => this.handlePersonChange(i, {profession: !option ? [] : option.map(o => o.value)})}
                                                isSearchable={false}
                                                isMulti={true}
                                                isClearable={true}
                                                className={`control-select profession`}
                                                classNamePrefix={'control-select'}
                                                placeholder={'Profession...'}
                                            />
                                            <Select
                                                options={companyRatingOptions}
                                                value={personLine.rating.map(rating => ({value: rating, label: PersonRating[rating].label}))}
                                                onChange={option => this.handlePersonChange(i, {rating: !option ? [] : option.map(o => o.value)})}
                                                isSearchable={false}
                                                isMulti={true}
                                                isClearable={true}
                                                className={`control-select rating`}
                                                classNamePrefix={'control-select'}
                                                placeholder={'Rating...'}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={'detail-row spacer'}/>

                    </div>
                </Scrollbars>
            </div>
        )
    }


    // *****************************************************************************************************************
    // CLOSE, SAVE, REMOVE
    // *****************************************************************************************************************
    close = () => {
        this.props.returnToPreviousView();
    };

    save = () => {
        if(this.props.selectedProject) this.props.updateProject();
        else this.props.createProject();
        this.close();
    };

    remove = () => {
        this.props.removeProject();
        this.close();
    };

    // *****************************************************************************************************************
    // HELPERS
    // *****************************************************************************************************************
    checkProject() {
        const disable = !this.isCurrentProjectValid() || Object.keys(this.props.editedData).length === 0;
        if(this.state.saveDisabled !== disable) this.setState({saveDisabled: disable});
    }

    isProjectsNameUsed = name => {
        if(!name) return false;
        return Object.keys(this.props.projects).filter(projectId => projectId !== this.props.selectedProject).map(projectId => this.props.projects[projectId].name.toLowerCase()).indexOf(name.toLowerCase()) >= 0;
    };

    handleRemoveArmed = () => {
        this.setState({removeArmed: !this.state.removeArmed})
    };

    updateEditedData = updateData => {
        const project = this.props.selectedProject ? this.props.projects[this.props.selectedProject] : undefined;
        if(!project) return this.props.editedData;
        /*const arrayProperties = ['company', 'person'];
        for(const property of arrayProperties) {
            if(updateData[property]) {
                const index = project[property].findIndex(item => item.id === updateData[property].index);
                if(index >= 0) updateData[property][index] = updateData[property];
                else updateData[property] = [...project[property], updateData[property]];
            }
        }*/

        const newData = {...this.props.editedData, ...updateData};
        for (const key of Object.keys(newData)) {
            if (project && this.areEquivalent(project[key], newData[key])) delete newData[key];
        }
        return newData;
    };

    areEquivalent = (a, b) => {
        return JSON.stringify(a) === JSON.stringify(b);
    };

    getUsersOptions = (users, role) => {
        return Object.keys(users)
            .filter(userId => {
                if(!users[userId] || !users[userId].role || users[userId].role.length === 0) return false;
                let hasRole = false;
                if(!Array.isArray(role)) role = [role];
                role.forEach(r => {
                    if(!hasRole) hasRole = users[userId].role.indexOf(`booking:${r}`) >= 0
                });
                return hasRole;
            })
            .sort((a, b) => users[a].name.localeCompare(users[b].name))
            .map(user => {return {value: user, label: users[user].name}});
    };

    getCopmanyOptions = companies => {
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
    isCurrentProjectValid = () => {
        const origProject = this.props.selectedProject && this.props.projects && this.props.projects[this.props.selectedProject] ? this.props.projects[this.props.selectedProject] : {};
        if(!origProject._id && this.props.selectedProject) return true; // when refresh, no data fetched yet
        const project = Object.assign({}, origProject, this.props.editedData);
        const validation = {};

        if(!project.name || !project.name.trim()) validation['name'] = {field: 'Project name', status: 'Is empty'};
        if(this.isProjectsNameUsed(project.name)) validation['name'] = {field: 'Project name', status: 'Is not unique'};
        if(!project.status) validation['status'] = {field: 'Project status', status: 'Is not set'};
        if(!ProjectStatus[project.status]) validation['status'] = {field: 'Project status', status: 'Is invalid'};

        if((project.status === 'LOST' || project.status === 'REFUSED') && (!project.statusNote || !project.statusNote.trim())) validation['statusNote'] = {field: 'Status note', status: `Must be set for status "${project.status}"`};

        if(project.supervisor2 && !project.supervisor) validation['supervisor'] = {field: 'Project supervisor', status: 'Must be set if supervisor2 is set'};
        if(project.supervisor && project.supervisor === project.supervisor2) validation['supervisor2'] = {field: 'Project supervisor2', status: 'Must be different of supervisor'};

        if(project.company.some(company => company.id === null)) validation['company'] = {field: 'Companies', status: 'A company is not set'};
        if(project.person.some(person => person.id === null)) validation['person'] = {field: 'People', status: 'A person is not set'};

        this.setState({validation: validation});
        return Object.keys(validation).length === 0;
    };

    // *****************************************************************************************************************
    // VALUES CHANGE HANDLERS
    // *****************************************************************************************************************
    handleNameChange = event => {
        this.props.editItem(this.updateEditedData({name: event.target.value}));
    };

    handleStatusChange = option => {
        this.props.editItem(this.updateEditedData({status: option.value}));
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

    handleCompanyChange = (index, data) => {
        const project = this.props.projects[this.props.selectedProject];
        if(!project) return;
        const newCompany = this.props.editedData.company ? [...this.props.editedData.company] : [...project.company];
        if(typeof index === 'undefined') { //ADD
            if(this.props.editedData.company && this.props.editedData.company.some(company => company.id === null)) return;
            newCompany.push({id: null, role: [], note: '', rating: []})
        } else if(typeof data === 'undefined') {//REMOVE at index
            newCompany.splice(index, 1);
        } else { //data contains update for line index
            console.log(data)
            newCompany[index] = {...newCompany[index], ...data}
        }
        console.log(newCompany)
        this.props.editItem(this.updateEditedData({
            company: newCompany
        }));
    };

    handlePersonChange = (index, data) => {
        const project = this.props.projects[this.props.selectedProject];
        if(!project) return;
        const newPerson = this.props.editedData.person ? [...this.props.editedData.person] : [...project.person];
        if(typeof index === 'undefined') { //ADD
            if(this.props.editedData.person && this.props.editedData.person.some(person => person.id === null)) return;
            newPerson.push({id: null, role: [], note: '', rating: [], profession: []})
        } else if(typeof data === 'undefined') {//REMOVE at index
            newPerson.splice(index, 1);
        } else { //data contains update for line index
            newPerson[index] = {...newPerson[index], ...data}
        }
        this.props.editItem(this.updateEditedData({
            person: newPerson
        }));
    }
}
