import React, {Fragment} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Scrollbars } from 'react-custom-scrollbars';
import { Input } from 'reactstrap';
import Textarea from 'react-textarea-autosize';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import areEquivalent from '../../lib/compareObjects';
import * as Constants from '../../constants/Constatnts';

import * as Icons from '../../constants/Icons';

import * as CompanyBusiness from '../../constants/CompanyBusiness';
import * as ContactType from '../../constants/ContactType';

const companyBusinessOptions = Object.keys(CompanyBusiness).map(key => ({value: CompanyBusiness[key].id, label: CompanyBusiness[key].label}));
const contactTypeOptions = Object.keys(ContactType).map(key => ({value: ContactType[key].type, label: ContactType[key].label}));

export default class CompanyEdit extends React.PureComponent {
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
        if(this.props.editedData !== prevProps.editedData || this.props.companies !== prevProps.companies) this.checkValidity();
    }

    componentWillUnmount() {
        if(this.validationTimer) clearTimeout(this.validationTimer);
    }

    render() {
        const {company, persons, editedData} = this.props;

        const name = editedData.name !== undefined ? editedData.name : company && company.name ? company.name : '';
        const business = editedData.business !== undefined ? editedData.business : company && company.business ? company.business : [];
        const contact = editedData.contact !== undefined ? editedData.contact :  company && company.contact ? company.contact : [];
        const person = editedData.person !== undefined ? editedData.person :  company && company.person ? company.person : [];
        const note = editedData.note !== undefined ? editedData.note : company && company.note ? company.note : '';

        const dataChanged = !company || Object.keys(editedData).length > 0;

        return (
            <div className={'app-body'}>
                {/* ------------------ TOOLBOX ------------------ */}
                <div className={'app-toolbox'}>
                    <div className={'inner-container'}>
                        <div className={'toolbox-group'}>
                            <div onClick={this.close} className={`tool-box-button${dataChanged ? ' red' : ''}`}>{dataChanged ? 'Cancel' : 'Close'}</div>
                            <div onClick={this.state.saveDisabled ? undefined : this.save} className={`tool-box-button${company ? ' orange' : ' green'}${this.state.saveDisabled ? ' disabled' : ''}`}>{company ? 'Save' : 'Create'}</div>
                            <div className={'tool-box-validation'}>
                                <FontAwesomeIcon className={`tool-box-validation-icon${Object.keys(this.state.validation).length > 0 ? ' active' : ''}`} icon={Icons.ICON_EDITOR_VALIDATION}/>
                                <div className={'tool-box-validation-container'}>
                                    {Object.keys(this.state.validation).map(validationField => <div key={validationField}>{`${this.state.validation[validationField].field}: ${this.state.validation[validationField].status}`}</div>)}
                                </div>
                            </div>
                            {!company ? null :
                                <Fragment>
                                    <div onClick={!this.state.removeArmed ? undefined : this.remove} className={`tool-box-button remove red${!this.state.removeArmed ? ' disabled' : ''}`}>{'Remove Company'}</div>
                                    <FontAwesomeIcon className={`tool-box-checkbox`} onClick={this.handleRemoveArmed} icon={this.state.removeArmed ? Icons.ICON_CHECKBOX_CHECKED : Icons.ICON_CHECKBOX_UNCHECKED} style={{cursor: 'pointer'}}/>
                                </Fragment>
                            }
                        </div>
                    </div>
                </div>
                {/* ------------------ FORM ------------------ */}
                <Scrollbars autoHide={true} autoHideTimeout={Constants.TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT} autoHideDuration={Constants.TABLE_SCROLLBARS_AUTO_HIDE_DURATION}>
                    <div className={'detail-body edit'}>
                        {/* ------------------ NAME, BUSINESS ------------------ */}
                        <div className={'detail-row'}>
                            <div className={'detail-group size-5'}>
                                <div className={`detail-label${typeof editedData.name !== 'undefined' && company  ? ' value-changed' : ''}`}>{'Company Name:'}</div>
                                <Input placeholder={'Company Name...'} autoFocus={!company} className={`detail-input${this.state.validation.name ? ' invalid' : ''}`} onChange={this.handleNameChange} value={name}/>
                            </div>
                            <div className={'detail-group size-7'}>
                                <div className={`detail-label${typeof editedData.business !== 'undefined' && company  ? ' value-changed' : ''}`}>{'Business:'}</div>
                                <Select
                                    options={companyBusinessOptions}
                                    value={business.map(business => ({value: business, label: CompanyBusiness[business] ? CompanyBusiness[business].label : ''}))}
                                    onChange={this.handleCompanyBusinessChange}
                                    isSearchable={true}
                                    isMulti={true}
                                    isClearable={true}
                                    className={`control-select wrap${this.state.validation.business ? ' invalid' : ''}`}
                                    classNamePrefix={'control-select'}
                                    placeholder={'Company business...'}
                                />
                            </div>
                        </div>
                        {/* ------------------ CONTACTS ------------------ */}
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group column size-12'}>
                                <div onClick={() => this.handleContactChange()} className={`detail-label clickable column${editedData.contact !== undefined && company ? ' value-changed' : ''}`}>{'Contacts'}<FontAwesomeIcon className={'label-icon add'} icon={Icons.ICON_EDITOR_ITEM_ADD}/></div>
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
                        {/* ------------------ PERSONS ------------------ */}
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group size-12'}>
                                <div onClick={event => event.altKey ? this.createNewPerson('') : {}} className={`detail-label${typeof editedData.person !== 'undefined' && company  ? ' value-changed' : ''}`}>{'People:'}</div>
                                <CreatableSelect
                                    options={this.getPersonsOption(persons)}
                                    value={person.map(person => ({value: person, label: persons[person] ? persons[person].name : ''}))}
                                    onChange={this.handlePersonChange}
                                    onCreateOption={name => this.createNewPerson(name)}
                                    formatCreateLabel={value => `Create: "${value}"`}
                                    isSearchable={true}
                                    isMulti={true}
                                    isClearable={true}
                                    className={`control-select wrap${this.state.validation.person ? ' invalid' : ''}`}
                                    classNamePrefix={'control-select'}
                                    placeholder={'Company People...'}
                                />
                            </div>
                        </div>
                        {/* ------------------ NOTE ------------------ */}
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group size-12'}>
                                <div className={`detail-label${editedData.note !== undefined && company ? ' value-changed' : ''}`}>{'Company note:'}</div>
                                <Textarea
                                    placeholder={'Company note...'}
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
            if (this.props.company) this.props.update(this.props.company._id);
            else {
                if (this.returnNew) {
                    const object = await this.props.create();
                    this.props.setJustAddedObject(object);
                } else this.props.create();
            }
            this.close();
        } catch(e) {}
    };

    remove = () => {
        try {
            this.props.remove(this.props.company._id);
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
        if(!name) return false;
        const filtered = Object.keys(this.props.companies).filter(companyId => this.props.companies[companyId].name.toLowerCase().trim() === name.toLowerCase().trim()).filter(companyId => !this.props.company || companyId !== this.props.company._id);
        return filtered.length > 0;
    };

    handleRemoveArmed = () => {
        this.setState({removeArmed: !this.state.removeArmed})
    };

    updateEditedData = updateData => {
        const newData = {...this.props.editedData, ...updateData};
        const object = this.props.company ? this.props.company : undefined;
        for(const key of Object.keys(newData)) {
            if(object && areEquivalent(object[key], newData[key]))  delete newData[key];
        }
        return newData;
    };

    getPersonsOption = persons => {
      return Object.keys(persons).map(personId => ({
          value: personId,
          label: persons[personId].name
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
        const originalObject = this.props.company;
        if(originalObject && !originalObject._id) return true; // when refresh, no data fetched yet
        const object = Object.assign({}, originalObject, this.props.editedData);
        let validation = {};

        if(!object.name || !object.name.trim()) validation['name'] = {field: 'Company Name', status: 'Is empty'};
        if(this.isNameUsed(object.name)) validation['name'] = {field: 'Company Name', status: 'Is not unique'};

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

    handleCompanyBusinessChange = options => {
        this.props.editItem(this.updateEditedData({business: options.map(option => option.value)}));
    };

    handlePersonChange = options => {
        this.props.editItem(this.updateEditedData({person: options.map(option => option.value)}));
    };

    handleContactChange = (index, data) => {
        const emptyItem = {type: null, data: ''};
        const object = this.props.company;
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

    createNewPerson = (name) => {
        this.props.addPerson(name, this.props.company ? this.props.company._id : undefined);
    };

    checkJustAddedObject = () => {
        if(this.props.justAdded && !this.props.company) { //new person added to not exists yet company
            const person = this.props.editedData.person ? [...this.props.editedData.person, this.props.justAdded._id] : this.props.company ? [...this.props.company.person, this.props.justAdded._id] : [this.props.justAdded._id];
            this.props.editItem(this.updateEditedData({person: person}));
        }
        this.props.setJustAddedObject(null);
    }
}