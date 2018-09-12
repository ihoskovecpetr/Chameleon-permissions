import React, {Fragment} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Scrollbars } from 'react-custom-scrollbars';
import { Input } from 'reactstrap';
import Select from 'react-select';
import * as Constants from '../../constants/Constatnts';

import * as Icons from '../../constants/Icons';

import * as CompanyBusiness from '../../constants/CompanyBusiness';
import * as ContactType from '../../constants/ContactType';

const companyBusinessOptions = Object.keys(CompanyBusiness).map(key => ({value: CompanyBusiness[key].id, label: CompanyBusiness[key].label}));
const contactTypeOptions = Object.keys(ContactType).map(key => ({value: ContactType[key].id, label: ContactType[key].label}));

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
    }

    componentDidMount() {
        this.checkCompany();
    }

    componentDidUpdate(prevProps) {
        if(this.props.editedData !== prevProps.editedData || this.props.companies !== prevProps.companies) this.checkCompany();
    }

    render() {
        const {selectedCompany, editedData, companies} = this.props;

        const name = editedData.name !== undefined ? editedData.name : !selectedCompany ? '' : companies[selectedCompany] ? companies[selectedCompany].name : '';
        const business = editedData.business !== undefined ? editedData.business : !selectedCompany ? '' : companies[selectedCompany] ? companies[selectedCompany].business : [];
        const contact = editedData.contact !== undefined ? editedData.contact : !selectedCompany ? '' : companies[selectedCompany] ? companies[selectedCompany].contact : [];

        return (
            <div className={'app-body'}>
                <div className={'app-toolbox'}>
                    <div className={'inner-container'}>
                        <div className={'toolbox-group'}>
                            <div onClick={this.close} className={'tool-box-button'}>{'Cancel'}</div>
                            <div onClick={this.state.saveDisabled ? undefined : this.save} className={`tool-box-button green${this.state.saveDisabled ? ' disabled' : ''}`}>{selectedCompany ? 'Save' : 'Create'}</div>
                            <div className={'tool-box-validation'}>
                                <FontAwesomeIcon className={`tool-box-validation-icon${Object.keys(this.state.validation).length > 0 ? ' active' : ''}`} icon={Icons.ICON_EDITOR_VALIDATION}/>
                                <div className={'tool-box-validation-container'}>
                                    {Object.keys(this.state.validation).map(validationField => <div key={validationField}>{`${this.state.validation[validationField].field}: ${this.state.validation[validationField].status}`}</div>)}
                                </div>
                            </div>
                            {!selectedCompany ? null :
                                <Fragment>
                                    <div onClick={!this.state.removeArmed ? undefined : this.remove} className={`tool-box-button remove red${!this.state.removeArmed ? ' disabled' : ''}`}>{'Remove Company'}</div>
                                    <FontAwesomeIcon className={`tool-box-checkbox`} onClick={this.handleRemoveArmed} icon={this.state.removeArmed ? Icons.ICON_CHECKBOX_CHECKED : Icons.ICON_CHECKBOX_UNCHECKED} style={{cursor: 'pointer'}}/>
                                </Fragment>
                            }
                        </div>
                    </div>
                </div>
                <Scrollbars autoHide={true} autoHideTimeout={800} autoHideDuration={200}>
                    <div className={'detail-body'}>
                        <div className={'detail-row'}>
                            <div className={'detail-group size-6'}>
                                <div className={`detail-label${typeof editedData.name !== 'undefined' && selectedCompany  ? ' value-changed' : ''}`}>{'Company name:'}</div>
                                <Input placeholder={'Company name...'} autoFocus={!selectedCompany} className={`detail-input${this.state.validation.name ? ' invalid' : ''}`} onChange={this.handleNameChange} value={name}/>
                            </div>
                            <div className={'detail-group size-6'}>
                                <div className={`detail-label${typeof editedData.business !== 'undefined' && selectedCompany  ? ' value-changed' : ''}`}>{'Business:'}</div>
                                <Select
                                    options={companyBusinessOptions}
                                    value={business.map(business => ({value: business, label: CompanyBusiness[business] ? CompanyBusiness[business].label : ''}))}
                                    onChange={this.handleCompanyBusinessChange}
                                    isSearchable={true}
                                    isMulti={true}
                                    isClearable={true}
                                    className={`control-select${this.state.validation.status ? ' invalid' : ''}`}
                                    classNamePrefix={'control-select'}
                                    placeholder={'Company business...'}
                                />
                            </div>
                        </div>
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group column size-12'}>
                                <div onClick={() => this.handleContactChange()} className={`detail-label clickable column${editedData.contact !== undefined && selectedCompany ? ' value-changed' : ''}`}>{'Contacts'}<FontAwesomeIcon className={'label-icon add'} icon={Icons.ICON_EDITOR_ITEM_ADD}/></div>
                                {contact.map((contactLine, i) =>
                                    <div className={`detail-array-line`} key={i}>
                                        <FontAwesomeIcon className={'remove-icon'} onClick={() => this.handleContactChange(i)} icon={Icons.ICON_EDITOR_LINE_REMOVE}/>
                                        <div className={'line-content'}>
                                            <Select
                                                options={contactTypeOptions}
                                                value={contactLine.type ? {value: contactLine.type, label: ContactType[contactLine.type] ? ContactType[contactLine.type].label : contactLine.type  } : null}
                                                onChange={option => this.handleContactChange(i, {id: !option || !option.value ? null : option.value})}
                                                isSearchable={true}
                                                isMulti={false}
                                                isClearable={true}
                                                className={`control-select company-contact-type${contactLine.type === null ? ' invalid' : ''}`}
                                                classNamePrefix={'control-select'}
                                                placeholder={'Contact type...'}
                                            />
                                            <Input
                                                className={`detail-input company-contact-data`}
                                                onChange={event => this.handleContactChange(i, {note: event.target.value})} value={contactLine.data}
                                                placeholder={'Contact...'}
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
    // CLOSE, SAVE, REMOVE
    // *****************************************************************************************************************
    close = () => {
        this.props.returnToPreviousView();
    };

    save = () => {
        if(this.props.selectedCompany) this.props.updateCompany();
        else this.props.createCompany();
        this.close();
    };

    remove = () => {
        this.props.removeCompany();
        this.close();
    };

    // *****************************************************************************************************************
    // HELPERS
    // *****************************************************************************************************************
    checkCompany() {
        if(this.validationTimer) return;
        const time = +new Date() - this.lastValidation;
        if(time > Constants.VALIDATION_DELAY_MS) this.setValidation();
        else this.validationTimer = setTimeout(this.setValidation, Constants.VALIDATION_DELAY_MS - time);
    }

    isCompanyNameUsed = name => {
        if(!name) return false;
        return Object.keys(this.props.companies).filter(companyId => companyId !== this.props.selectedCompany).map(companyId => this.props.companies[companyId].name.toLowerCase()).indexOf(name.toLowerCase()) >= 0;
    };

    handleRemoveArmed = () => {
        this.setState({removeArmed: !this.state.removeArmed})
    };

    updateEditedData = updateData => {
        const newData = {...this.props.editedData, ...updateData};
        const company = this.props.selectedCompany ? this.props.companies[this.props.selectedCompany] : undefined;
        for(const key of Object.keys(newData)) {
            if(company && company[key] === newData[key])  delete newData[key];
        }
        return newData;
    };

    areEquivalent = (a, b) => { //TODO do better check
        return JSON.stringify(a) === JSON.stringify(b);
    };

    // *****************************************************************************************************************
    // VALIDATION
    // *****************************************************************************************************************
    setValidation = () => {
        const origCompany = this.props.selectedCompany && this.props.companies && this.props.companies[this.props.selectedCompany] ? this.props.companies[this.props.selectedCompany] : {};
        if(!origCompany._id && this.props.selectedCompany) return true; // when refresh, no data fetched yet
        const company = Object.assign({}, origCompany, this.props.editedData);
        let validation = {};

        if(!company.name || !company.name.trim()) validation['name'] = {field: 'Company name', status: 'Is empty'};
        if(this.isCompanyNameUsed(company.name)) validation['name'] = {field: 'Company name', status: 'Is not unique'};

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

    handleCompanyBusinessChange = options => {
        this.props.editItem(this.updateEditedData({business: options.map(option => option.value)}));
    };

    handleContactChange = (index, data) => {

    }
}