import React, {Fragment} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Scrollbars } from 'react-custom-scrollbars';
import { Input } from 'reactstrap';
import Select from 'react-select';
import areEquivalent from '../../lib/compareObjects';
import * as Constants from '../../constants/Constatnts';

import * as Icons from '../../constants/Icons';

import * as PersonProfession from '../../constants/PersonProfession';
import * as ContactType from '../../constants/ContactType';

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
    }

    componentDidMount() {
        this.checkValidity();
    }

    componentDidUpdate(prevProps) {
        if(this.props.editedData !== prevProps.editedData || this.props.persons !== prevProps.persons) this.checkValidity();
    }

    render() {
        const {selected, editedData, persons} = this.props;

        const name = editedData.name !== undefined ? editedData.name : !selected ? '' : persons[selected] ? persons[selected].name : '';
        const profession = editedData.profession !== undefined ? editedData.profession : !selected ? [] : persons[selected] ? persons[selected].profession : [];
        const contact = editedData.contact !== undefined ? editedData.contact : !selected ? [] : persons[selected] ? persons[selected].contact : [];

        return (
            <div className={'app-body'}>
                {/* ------------------ TOOLBOX ------------------ */}
                <div className={'app-toolbox'}>
                    <div className={'inner-container'}>
                        <div className={'toolbox-group'}>
                            <div onClick={this.close} className={'tool-box-button'}>{'Cancel'}</div>
                            <div onClick={this.state.saveDisabled ? undefined : this.save} className={`tool-box-button green${this.state.saveDisabled ? ' disabled' : ''}`}>{selected ? 'Save' : 'Create'}</div>
                            <div className={'tool-box-validation'}>
                                <FontAwesomeIcon className={`tool-box-validation-icon${Object.keys(this.state.validation).length > 0 ? ' active' : ''}`} icon={Icons.ICON_EDITOR_VALIDATION}/>
                                <div className={'tool-box-validation-container'}>
                                    {Object.keys(this.state.validation).map(validationField => <div key={validationField}>{`${this.state.validation[validationField].field}: ${this.state.validation[validationField].status}`}</div>)}
                                </div>
                            </div>
                            {!selected ? null :
                                <Fragment>
                                    <div onClick={!this.state.removeArmed ? undefined : this.remove} className={`tool-box-button remove red${!this.state.removeArmed ? ' disabled' : ''}`}>{'Remove Person'}</div>
                                    <FontAwesomeIcon className={`tool-box-checkbox`} onClick={this.handleRemoveArmed} icon={this.state.removeArmed ? Icons.ICON_CHECKBOX_CHECKED : Icons.ICON_CHECKBOX_UNCHECKED} style={{cursor: 'pointer'}}/>
                                </Fragment>
                            }
                        </div>
                    </div>
                </div>
                {/* ------------------ FORM ------------------ */}
                <Scrollbars autoHide={true} autoHideTimeout={800} autoHideDuration={200}>
                    <div className={'detail-body'}>
                        {/* ------------------ NAME, PROFESSION ------------------ */}
                        <div className={'detail-row'}>
                            <div className={'detail-group size-5'}>
                                <div className={`detail-label${typeof editedData.name !== 'undefined' && selected  ? ' value-changed' : ''}`}>{'Person name:'}</div>
                                <Input placeholder={'Company name...'} autoFocus={!selected} className={`detail-input${this.state.validation.name ? ' invalid' : ''}`} onChange={this.handleNameChange} value={name}/>
                            </div>
                            <div className={'detail-group size-7'}>
                                <div className={`detail-label${typeof editedData.business !== 'undefined' && selected  ? ' value-changed' : ''}`}>{'Business:'}</div>
                                <Select
                                    options={personProfessionOptions}
                                    value={profession.map(profession => ({value: profession, label: PersonProfession[profession] ? PersonProfession[profession].label : ''}))}
                                    onChange={this.handlePersonProfessionChange}
                                    isSearchable={true}
                                    isMulti={true}
                                    isClearable={true}
                                    className={`control-select${this.state.validation.status ? ' invalid' : ''}`}
                                    classNamePrefix={'control-select'}
                                    placeholder={'Person profession...'}
                                />
                            </div>
                        </div>
                        {/* ------------------ CONTACTS ------------------ */}
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group column size-12'}>
                                <div onClick={() => this.handleContactChange()} className={`detail-label clickable column${editedData.contact !== undefined && selected ? ' value-changed' : ''}`}>{'Contacts'}<FontAwesomeIcon className={'label-icon add'} icon={Icons.ICON_EDITOR_ITEM_ADD}/></div>
                                <div className={'detail-group-wrapper'}>
                                    {contact.map((contactLine, i) =>
                                        <div className={`detail-array-line size-6 spacer`} key={i}>
                                            <FontAwesomeIcon className={'remove-icon'} onClick={() => this.handleContactChange(i)} icon={Icons.ICON_EDITOR_LINE_REMOVE}/>
                                            <div className={'line-content'}>
                                                <Select
                                                    options={contactTypeOptions}
                                                    value={contactLine.type ? {value: contactLine.type, label: ContactType[contactLine.type] ? ContactType[contactLine.type].label : contactLine.type  } : null}
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
        return Object.keys(this.props.persons).filter(id => id !== this.props.selected).map(id => this.props.persons[id].name.toLowerCase()).indexOf(name.toLowerCase()) >= 0;
    };

    handleRemoveArmed = () => {
        this.setState({removeArmed: !this.state.removeArmed})
    };

    updateEditedData = updateData => {
        const newData = {...this.props.editedData, ...updateData};
        const object = this.props.selected ? this.props.persons[this.props.selected] : undefined;
        for(const key of Object.keys(newData)) {
            if(object && object[key] === newData[key])  delete newData[key];
        }
        return newData;
    };

    // *****************************************************************************************************************
    // VALIDATION
    // *****************************************************************************************************************
    setValidation = () => {
        const originalObject = this.props.selected && this.props.persons && this.props.persons[this.props.selected] ? this.props.persons[this.props.selected] : {};
        if(!originalObject._id && this.props.selected) return true; // when refresh, no data fetched yet
        const object = Object.assign({}, originalObject, this.props.editedData);
        let validation = {};

        if(!object.name || !object.name.trim()) validation['name'] = {field: 'Person name', status: 'Is empty'};
        if(this.isNameUsed(object.name)) validation['name'] = {field: 'Person name', status: 'Is not unique'};

        if(object.contact && object.contact.some(contact => contact.type === null)) validation['contact-type'] = {field: 'Contact', status: 'Some contact has not set type'};
        if(object.contact && object.contact.some(contact => !contact.data || !contact.data.trim())) validation['contact-data'] = {field: 'Contact', status: 'Some contact is not set'};

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

    handlePersonProfessionChange = options => {
        this.props.editItem(this.updateEditedData({profession: options.map(option => option.value)}));
    };

    handleContactChange = (index, data) => {
        const emptyItem = {type: null, data: ''};
        const object = this.props.persons[this.props.selected];
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
    }
}