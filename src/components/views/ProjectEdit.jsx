import React, {Fragment} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Scrollbars } from 'react-custom-scrollbars';
import { Input } from 'reactstrap';
import Select from 'react-select';

import * as ProjectStatus from '../../constants/ProjectStatus';

const statusOptions = Object.keys(ProjectStatus).map(key => {return {value: key, label: ProjectStatus[key].label}});

const ICON_CHECKBOX_CHECKED = ['far','check-square'];
const ICON_CHECKBOX_UNCHECKED = ['far', 'square'];
const ICON_VALIDATION = 'exclamation-circle';

export default class ProjectEdit extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            saveDisabled: true,
            validation: {},
            removeArmed: false
        };
    }

    componentDidMount() {
        this.checkProject();
    }

    componentDidUpdate(prevProps) {
        if(this.props.editedData !== prevProps.editedData || this.props.projects !== prevProps.projects) this.checkProject();
    }

    render() {
        const {selectedProject, editedData, projects} = this.props;

        const name = editedData.name !== undefined ? editedData.name : !selectedProject ? '' : projects[selectedProject] ? projects[selectedProject].name : '';
        const status = editedData.status !== undefined ? editedData.status : projects[selectedProject] ? projects[selectedProject].status : null;
        const statusNote = editedData.statusNote !== undefined ? editedData.statusNote : projects[selectedProject] ? projects[selectedProject].statusNote : '';

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
                                <div className={`detail-label${editedData.name !== undefined && selectedProject  ? ' value-changed' : ''}`}>{'Project name:'}</div>
                                <Input className={`detail-input${this.state.validation.name ? ' invalid' : ''}`} onChange={this.handleNameChange} value={name}/>
                            </div>
                            <div className={'detail-group size-5'}>
                                <div className={`detail-label${editedData.status !== undefined && selectedProject ? ' value-changed' : ''}`}>{'Project status:'}</div>
                                <Select
                                    options={statusOptions}
                                    value={{value: status, label: ProjectStatus[status] ? ProjectStatus[status].label : ''}}
                                    onChange={this.handleStatusChange}
                                    isSearchable={false}
                                    className={`detail-select${this.state.validation.status ? ' invalid' : ''}`}
                                    classNamePrefix={'detail-select'}
                                />
                            </div>
                        </div>
                        <div className={'detail-row'}>
                            <div className={'detail-group size-12'}>
                                <div className={`detail-label${editedData.statusNote !== undefined && selectedProject ? ' value-changed' : ''}`}>{'Status note:'}</div>
                                <Input className={`detail-input`} onChange={this.handleStatusNoteChange} value={statusNote}/>
                            </div>
                        </div>
                        <div className={'detail-spacer'}/>
                        <div className={'detail-row'}>
                            <div className={'detail-group size-6'}>
                                <div className={`detail-label${editedData.statusNote !== undefined && selectedProject ? ' value-changed' : ''}`}>{'Client Company:'}</div>
                            </div>
                            <div className={'detail-group size-6'}>
                                <div className={`detail-label${editedData.statusNote !== undefined && selectedProject ? ' value-changed' : ''}`}>{'Client People:'}</div>
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
        const newData = {...this.props.editedData, ...updateData};
        const project = this.props.selectedProject ? this.props.projects[this.props.selectedProject] : undefined;
        for(const key of Object.keys(newData)) {
            if(project && project[key] === newData[key])  delete newData[key];
        }
        return newData;
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

}