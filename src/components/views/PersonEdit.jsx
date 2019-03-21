import React, {Fragment} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Scrollbars } from 'react-custom-scrollbars';
import { Input } from 'reactstrap';
import Textarea from 'react-textarea-autosize';
import Select from 'react-select';
import areEquivalent from '../../lib/compareObjects';
import * as Constants from '../../constants/Constatnts';

import Toolbox from '../toolbox/EditToolbox';

import * as Icons from '../../constants/Icons';

import * as PersonProfession from '../../constants/PersonProfession';
import * as ContactType from '../../constants/ContactType';
import CreatableSelect from "react-select/lib/Creatable";

const personProfessionOptions = Object.keys(PersonProfession).map(key => ({value: PersonProfession[key].id, label: PersonProfession[key].label}));
const contactTypeOptions = Object.keys(ContactType).map(key => ({value: ContactType[key].type, label: ContactType[key].label}));

export default class PersonEdit extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            saveDisabled: true,
            validation: {},
            removeArmed: false
        };
        this.validationTimer = null;
        this.lastValidation = 0;
        this.returnNew = props.editedData && typeof props.editedData.name !== 'undefined';
    }

    componentDidMount() {
        this.checkJustAddedObject();
        this.checkValidity();
    }

    componentDidUpdate(prevProps) {
        if(this.props.editedData !== prevProps.editedData || this.props.persons !== prevProps.persons) this.checkValidity();
    }

    componentWillUnmount() {
        if(this.validationTimer) clearTimeout(this.validationTimer);
    }

    render() {
        const {person, companies, editedData} = this.props;

        const name = editedData.name !== undefined ? editedData.name : person && person.name ? person.name : '';
        const profession = editedData.profession !== undefined ? editedData.profession : person && person.profession ? person.profession : [];
        const contact = editedData.contact !== undefined ? editedData.contact : person && person.contact ? person.contact : [];
        const company = editedData.company !== undefined ? editedData.company :  person && person.company ? person.company : [];
        const note = editedData.note !== undefined ? editedData.note : person && person.note ? person.note : '';

        const dataChanged = !person || Object.keys(editedData).length > 0;

        return (
            <div className={'app-body'}>
                <Toolbox
                    returnToPreviousView = {this.props.returnToPreviousView}
                    save = {this.save}
                    remove = {this.remove}
                    dataChanged = {dataChanged}
                    validation = {this.state.validation}
                    saveDisabled = {this.state.saveDisabled}
                    selected = {person && person._id}
                    label = {'Person'}
                    editable = {this.props.editable}
                />
                <Scrollbars className={'body-scroll-content people'} className={'body-scroll-content people'} autoHide={true} autoHideTimeout={Constants.TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT} autoHideDuration={Constants.TABLE_SCROLLBARS_AUTO_HIDE_DURATION}>
                    <div className={'detail-body edit'}>
                        {/* ------------------ NAME, PROFESSION ------------------ */}
                        <div className={'detail-row'}>
                            <div className={'detail-group size-5'}>
                                <div className={`detail-label${typeof editedData.name !== 'undefined' && person  ? ' value-changed' : ''}`}>{'Person Name:'}</div>
                                <Input placeholder={'Person Name...'} autoFocus={!person} className={`detail-input${this.state.validation.name ? ' invalid' : ''}`} onChange={this.handleNameChange} value={name}/>
                            </div>
                            <div className={'detail-group size-7'}>
                                <div className={`detail-label${typeof editedData.profession !== 'undefined' && person  ? ' value-changed' : ''}`}>{'Profession:'}</div>
                                <Select
                                    options={personProfessionOptions}
                                    value={profession.map(profession => ({value: profession, label: PersonProfession[profession] ? PersonProfession[profession].label : ''}))}
                                    onChange={this.handlePersonProfessionChange}
                                    isSearchable={true}
                                    isMulti={true}
                                    isClearable={true}
                                    className={`control-select wrap${this.state.validation.status ? ' invalid' : ''}`}
                                    classNamePrefix={'control-select'}
                                    placeholder={'Person profession...'}
                                />
                            </div>
                        </div>
                        {/* ------------------ CONTACTS ------------------ */}
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group column size-12'}>
                                <div onClick={() => this.handleContactChange()} className={`detail-label clickable column${editedData.contact !== undefined && person ? ' value-changed' : ''}`}>{'Contacts'}<FontAwesomeIcon className={'label-icon add'} icon={Icons.ICON_EDITOR_ITEM_ADD}/></div>
                                <div className={'detail-group-wrapper'}>
                                    {contact.map((contactLine, i) =>
                                        <div className={`detail-array-line size-6 spacer`} key={i}>
                                            <FontAwesomeIcon className={'remove-icon'} onClick={() => this.handleContactChange(i)} icon={Icons.ICON_EDITOR_LINE_REMOVE}/>
                                            <div className={'line-content'}>
                                                <Select
                                                    options={contactTypeOptions}
                                                    value={contactLine.type ? {value: contactLine.type, label: ContactType[contactLine.type] ? ContactType[contactLine.type].label : contactLine.type  } : null}
                                                    autoFocus={!contactLine.type}
                                                    onChange={option => this.handleContactChange(i, {type: !option || !option.value ? null : option.value})}
                                                    isSearchable={true}
                                                    isMulti={false}
                                                    isClearable={true}
                                                    className={`control-select contact-type${contactLine.type === null ? ' invalid' : ''}`}
                                                    classNamePrefix={'control-select'}
                                                    placeholder={'Contact type...'}
                                                />
                                                <Input
                                                    className={`detail-input contact-data${!contactLine.data || !contactLine.data.trim() ? ' invalid' : ''}`}
                                                    onChange={event => this.handleContactChange(i, {data: event.target.value})} value={contactLine.data}
                                                    placeholder={'Contact...'}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* ------------------ COMPANIES ------------------ */}
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group size-12'}>
                                <div onClick={event => event.altKey ? this.createNewCompany('') : {}} className={`detail-label${typeof editedData.company !== 'undefined' && company  ? ' value-changed' : ''}`}>{'Companies:'}</div>
                                <CreatableSelect
                                    options={this.getCompaniesOption(companies)}
                                    value={company.map(company => ({value: company, label: companies[company] ? companies[company].name : ''}))}
                                    onChange={this.handleCompanyChange}
                                    onCreateOption={name => this.createNewCompany(name)}
                                    formatCreateLabel={value => `Create: "${value}"`}
                                    isSearchable={true}
                                    isMulti={true}
                                    isClearable={true}
                                    className={`control-select wrap${this.state.validation.company ? ' invalid' : ''}`}
                                    classNamePrefix={'control-select'}
                                    placeholder={'Person Companies...'}
                                />
                            </div>
                        </div>
                        {/* ------------------ NOTE ------------------ */}
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group size-12'}>
                                <div className={`detail-label${editedData.note !== undefined && person ? ' value-changed' : ''}`}>{'Person note:'}</div>
                                <Textarea
                                    placeholder={'Person note...'}
                                    className={`detail-input textarea`}
                                    onChange={this.handleNoteChange}
                                    value={note}
                                />
                            </div>
                        </div>
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

    save = async () => {
        if(this.setValidation()) return;
        try {
            if (this.props.person) this.props.update(this.props.person._id);
            else {
                if (this.returnNew) {
                    const object = await this.props.create();
                    this.props.setJustAddedObject(object);
                } else this.props.create();
            }
            this.close();
        } catch(e) {}
    };

    remove = async () => {
        try {
            this.props.remove(this.props.person._id);
            this.props.returnToPreviousView(true);
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
        if(!name) return false;
        const filtered = Object.keys(this.props.persons).filter(personId => this.props.persons[personId].name.toLowerCase().trim() === name.toLowerCase().trim()).filter(personId => !this.props.person || personId !== this.props.person._id);
        return filtered.length > 0;
    };

    handleRemoveArmed = () => {
        this.setState({removeArmed: !this.state.removeArmed})
    };

    updateEditedData = updateData => {
        const newData = {...this.props.editedData, ...updateData};
        const object = this.props.person ? this.props.person : undefined;
        for(const key of Object.keys(newData)) {
            if(object && object[key] === newData[key])  delete newData[key];
        }
        return newData;
    };

    getCompaniesOption = companies => {
        return Object.keys(companies).map(companyId => ({
            value: companyId,
            label: companies[companyId].name
        }))
    };

    handleNoteChange = event => {
        this.props.editItem(this.updateEditedData({note: event.target.value}));
    };

    // *****************************************************************************************************************
    // VALIDATION
    // *****************************************************************************************************************
    setValidation = () => {
        if(this.validationTimer) clearTimeout(this.validationTimer);
        this.validationTimer = null;
        this.lastValidation = +new Date();
        const originalObject = this.props.person;
        if(originalObject && !originalObject._id) return true; // when refresh, no data fetched yet
        const object = Object.assign({}, originalObject, this.props.editedData);
        let validation = {};

        if(!object.name || !object.name.trim()) validation['name'] = {field: 'Person Name', status: 'Is empty'};
        if(this.isNameUsed(object.name)) validation['name'] = {field: 'Person Name', status: 'Is not unique'};

        if(object.contact && object.contact.some(contact => contact.type === null)) validation['contact-type'] = {field: 'Contact', status: 'Some contact has not set type'};
        if(object.contact && object.contact.some(contact => !contact.data || !contact.data.trim())) validation['contact-data'] = {field: 'Contact', status: 'Some contact is not set'};

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

    handlePersonProfessionChange = options => {
        this.props.editItem(this.updateEditedData({profession: options.map(option => option.value)}));
    };

    handleCompanyChange = options => {
        this.props.editItem(this.updateEditedData({company: options.map(option => option.value)}));
    };

    handleContactChange = (index, data) => {
        const emptyItem = {type: null, data: ''};
        const object = this.props.person;
        const newData = this.props.editedData.contact ? [...this.props.editedData.contact] : object ? [...object.contact] : [];
        if(typeof index === 'undefined' && typeof data === 'undefined') { //ADD
            if (this.props.editedData.contact && this.props.editedData.contact.some(item => item.type === null)) return;
            newData.push(emptyItem)
        } else if(typeof index === 'undefined') { //ADD - fill type in data
            newData.push({...emptyItem, type: data});
        } else if(typeof data === 'undefined') {//REMOVE at index
            newData.splice(index, 1);
        } else { //data contains update for line index
            newData[index] = {...newData[index], ...data}
        }
        const editedData = this.updateEditedData({contact: newData});
        this.props.editItem(editedData);
    };

    createNewCompany = (name) => {
        this.props.addCompany(name, this.props.person ? this.props.person._id : undefined);
    };

    checkJustAddedObject = () => {
        if(this.props.justAdded && !this.props.person) { //new company added to not exists yet person
            const company = this.props.editedData.company ? [...this.props.editedData.company, this.props.justAdded._id] : this.props.person ? [...this.props.person.company, this.props.justAdded._id] : [this.props.justAdded._id];
            this.props.editItem(this.updateEditedData({company: company}));
        }
        this.props.setJustAddedObject(null);
    }
}