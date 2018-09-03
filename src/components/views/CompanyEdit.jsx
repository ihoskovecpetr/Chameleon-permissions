import React, {Fragment} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Scrollbars } from 'react-custom-scrollbars';
import { Input } from 'reactstrap';
import Select from 'react-select';

const ICON_CHECKBOX_CHECKED = ['far','check-square'];
const ICON_CHECKBOX_UNCHECKED = ['far', 'square'];
const ICON_VALIDATION = 'exclamation-circle';

export default class CompanyEdit extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            saveDisabled: true,
            validation: {},
            removeArmed: false
        };
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

        return (
            <div className={'app-body'}>
                <div className={'app-toolbox'}>
                    <div className={'inner-container'}>
                        <div className={'toolbox-group'}>
                            <div onClick={this.close} className={'tool-box-button'}>{'Cancel'}</div>
                            <div onClick={this.state.saveDisabled ? undefined : this.save} className={`tool-box-button green${this.state.saveDisabled ? ' disabled' : ''}`}>{selectedCompany ? 'Save' : 'Create'}</div>
                            <div className={'tool-box-validation'}>
                                <FontAwesomeIcon className={`tool-box-validation-icon${Object.keys(this.state.validation).length > 0 ? ' active' : ''}`} icon={ICON_VALIDATION}/>
                                <div className={'tool-box-validation-container'}>
                                    {Object.keys(this.state.validation).map(validationField => <div key={validationField}>{`${this.state.validation[validationField].field}: ${this.state.validation[validationField].status}`}</div>)}
                                </div>
                            </div>
                            {!selectedCompany ? null :
                                <Fragment>
                                    <div onClick={!this.state.removeArmed ? undefined : this.remove} className={`tool-box-button remove red${!this.state.removeArmed ? ' disabled' : ''}`}>{'Remove Company'}</div>
                                    <FontAwesomeIcon className={`tool-box-checkbox`} onClick={this.handleRemoveArmed} icon={this.state.removeArmed ? ICON_CHECKBOX_CHECKED : ICON_CHECKBOX_UNCHECKED} style={{cursor: 'pointer'}}/>
                                </Fragment>
                            }
                        </div>
                    </div>
                </div>
                <Scrollbars autoHide={true} autoHideTimeout={800} autoHideDuration={200}>
                    <div className={'detail-body'}>
                        <div className={'detail-row'}>
                            <div className={'detail-group size-7'}>
                                <div className={`detail-label${typeof editedData.name !== 'undefined' && selectedCompany  ? ' value-changed' : ''}`}>{'Company name:'}</div>
                                <Input className={`detail-input${this.state.validation.name ? ' invalid' : ''}`} onChange={this.handleNameChange} value={name}/>
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
        const disable = !this.isCurrentCompanyValid() || Object.keys(this.props.editedData).length === 0;
        if(this.state.saveDisabled !== disable) this.setState({saveDisabled: disable});
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

    // *****************************************************************************************************************
    // VALIDATION
    // *****************************************************************************************************************
    isCurrentCompanyValid = () => {
        const origCompany = this.props.selectedCompany && this.props.companies && this.props.companies[this.props.selectedCompany] ? this.props.companies[this.props.selectedCompany] : {};
        if(!origCompany._id && this.props.selectedCompany) return true; // when refresh, no data fetched yet
        const company = Object.assign({}, origCompany, this.props.editedData);
        const validation = {};

        if(!company.name || !company.name.trim()) validation['name'] = {field: 'Company name', status: 'Is empty'};
        if(this.isCompanyNameUsed(company.name)) validation['name'] = {field: 'Company name', status: 'Is not unique'};

        this.setState({validation: validation});
        return Object.keys(validation).length === 0;
    };

    // *****************************************************************************************************************
    // VALUES CHANGE HANDLERS
    // *****************************************************************************************************************
    handleNameChange = event => {
        this.props.editItem(this.updateEditedData({name: event.target.value}));
    };
}