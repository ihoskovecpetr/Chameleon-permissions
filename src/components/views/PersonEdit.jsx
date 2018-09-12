import React, {Fragment} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Scrollbars } from 'react-custom-scrollbars';
import { Input } from 'reactstrap';
import Select from 'react-select';
import * as Constants from '../../constants/Constatnts';

import * as Icons from '../../constants/Icons';

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
        this.checkPerson();
    }

    componentDidUpdate(prevProps) {
        if(this.props.editedData !== prevProps.editedData || this.props.persons !== prevProps.persons) this.checkPerson();
    }

    render() {
        const {selectedPerson, editedData, persons} = this.props;

        const name = editedData.name !== undefined ? editedData.name : !selectedPerson ? '' : persons[selectedPerson] ? persons[selectedPerson].name : '';

        return (
            <div className={'app-body'}>
                <div className={'app-toolbox'}>
                    <div className={'inner-container'}>
                        <div className={'toolbox-group'}>
                            <div onClick={this.close} className={'tool-box-button'}>{'Cancel'}</div>
                            <div onClick={this.state.saveDisabled ? undefined : this.save} className={`tool-box-button green${this.state.saveDisabled ? ' disabled' : ''}`}>{selectedPerson ? 'Save' : 'Create'}</div>
                            <div className={'tool-box-validation'}>
                                <FontAwesomeIcon className={`tool-box-validation-icon${Object.keys(this.state.validation).length > 0 ? ' active' : ''}`} icon={Icons.ICON_EDITOR_VALIDATION}/>
                                <div className={'tool-box-validation-container'}>
                                    {Object.keys(this.state.validation).map(validationField => <div key={validationField}>{`${this.state.validation[validationField].field}: ${this.state.validation[validationField].status}`}</div>)}
                                </div>
                            </div>
                            {!selectedPerson ? null :
                                <Fragment>
                                    <div onClick={!this.state.removeArmed ? undefined : this.remove} className={`tool-box-button remove red${!this.state.removeArmed ? ' disabled' : ''}`}>{'Remove Person'}</div>
                                    <FontAwesomeIcon className={`tool-box-checkbox`} onClick={this.handleRemoveArmed} icon={this.state.removeArmed ? Icons.ICON_CHECKBOX_CHECKED : Icons.ICON_CHECKBOX_UNCHECKED} style={{cursor: 'pointer'}}/>
                                </Fragment>
                            }
                        </div>
                    </div>
                </div>
                <Scrollbars autoHide={true} autoHideTimeout={800} autoHideDuration={200}>
                    <div className={'detail-body'}>
                        <div className={'detail-row'}>
                            <div className={'detail-group size-7'}>
                                <div className={`detail-label${typeof editedData.name !== 'undefined' && selectedPerson  ? ' value-changed' : ''}`}>{'Person name:'}</div>
                                <Input autoFocus={!selectedPerson} className={`detail-input${this.state.validation.name ? ' invalid' : ''}`} onChange={this.handleNameChange} value={name}/>
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
        if(this.props.selectedPerson) this.props.updatePerson();
        else this.props.createPerson();
        this.close();
    };

    remove = () => {
        this.props.removePerson();
        this.close();
    };

    // *****************************************************************************************************************
    // HELPERS
    // *****************************************************************************************************************
    checkPerson() {
        if(this.validationTimer) return;
        const time = +new Date() - this.lastValidation;
        if(time > Constants.VALIDATION_DELAY_MS) this.setValidation();
        else this.validationTimer = setTimeout(this.setValidation, Constants.VALIDATION_DELAY_MS - time);
    }

    isPersonNameUsed = name => {
        if(!name) return false;
        return Object.keys(this.props.persons).filter(personId => personId !== this.props.selectedPerson).map(personId => this.props.persons[personId].name.toLowerCase()).indexOf(name.toLowerCase()) >= 0;
    };

    handleRemoveArmed = () => {
        this.setState({removeArmed: !this.state.removeArmed})
    };

    updateEditedData = updateData => {
        const newData = {...this.props.editedData, ...updateData};
        const person = this.props.selectedPerson ? this.props.persons[this.props.selectedPerson] : undefined;
        for(const key of Object.keys(newData)) {
            if(person && person[key] === newData[key])  delete newData[key];
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
        const origPerson = this.props.selectedPerson && this.props.persons && this.props.persons[this.props.selectedPerson] ? this.props.persons[this.props.selectedPerson] : {};
        if(!origPerson._id && this.props.selectedPerson) return true; // when refresh, no data fetched yet
        const person = Object.assign({}, origPerson, this.props.editedData);
        let validation = {};

        if(!person.name || !person.name.trim()) validation['name'] = {field: 'Person name', status: 'Is empty'};
        if(this.isPersonNameUsed(person.name)) validation['name'] = {field: 'Person name', status: 'Is not unique'};

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
}