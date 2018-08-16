import React, {Fragment} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Scrollbars } from 'react-custom-scrollbars';
import { Input, Col,  Row, Label, FormGroup } from 'reactstrap';
import Select from 'react-select';
import * as ViewTypes from '../../constants/ViewTypes';
import * as ProjectStatus from '../../constants/ProjectStatus';

const statusOptions = Object.keys(ProjectStatus).map(key => {return {value: ProjectStatus[key].key, label: ProjectStatus[key].label}});

const ICON_REMOVE = 'trash';
const ICON_CHECKBOX_CHECKED = ['far','check-square'];
const ICON_CHECKBOX_UNCHECKED = ['far', 'square'];

export default class ProjectEdit extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            saveDisabled: true,
            project: null,
            validation: {},
            removeArmed: false,
            status: !props.selectedProject ? ProjectStatus.PREBID.key : undefined
        };

        this.handleRemoveArmed = this.handleRemoveArmed.bind(this);

        this.close = this.close.bind(this);
        this.save = this.save.bind(this);
        this.remove = this.remove.bind(this);

        this.currentProject = this.currentProject.bind(this);
        this.setSaveDisabled = this.setSaveDisabled.bind(this);
        this.isCurrentProjectValid = this.isCurrentProjectValid.bind(this);

        this.editable = true;

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);

        this.sendCurrentProject = this.sendCurrentProject.bind(this);
        this.getCurrentState = this.getCurrentState.bind(this);
        this.handleStatusNoteChange = this.handleStatusNoteChange.bind(this);
    }

    render() {

        const name = this.state.name !== undefined ? this.state.name : this.props.create ? '' : this.props.projects[this.props.selectedProject] ? this.props.projects[this.props.selectedProject].name : '';
        const status = this.state.status !== undefined ? this.state.status : this.props.projects[this.props.selectedProject] ? this.props.projects[this.props.selectedProject].status : null;
        const statusNote = this.state.statusNote !== undefined ? this.state.statusNote : this.props.projects[this.props.selectedProject] ? this.props.projects[this.props.selectedProject].statusNote : '';

        return (
            <div className={'app-body'}>
                <div className={'app-toolbox'}>
                    <div className={'toolbox-group'}>
                        <div onClick={this.close} className={'tool-box-button'}>{'Cancel'}</div>
                        <div onClick={this.state.saveDisabled ? undefined : this.save} className={`tool-box-button green${this.state.saveDisabled ? ' disabled' : ''}`}>{this.state.create ? 'Create' : 'Save'}</div>
                        {this.state.create ? null :
                            <Fragment>
                                <div onClick={!this.state.removeArmed ? undefined : this.remove} className={`tool-box-button remove red${!this.state.removeArmed ? ' disabled' : ''}`}>{'Remove Project'}</div>
                                <FontAwesomeIcon className={`tool-box-checkbox`} onClick={this.handleRemoveArmed} icon={this.state.removeArmed ? ICON_CHECKBOX_CHECKED : ICON_CHECKBOX_UNCHECKED} style={{cursor: 'pointer'}}/>
                            </Fragment>
                        }
                    </div>
                    {this.props.id ? <div className={'toolbox-id'}>{this.props.id}</div> : null}
                    <div className={'toolbox-group clear'}/>
                </div>
                <Scrollbars autoHide={true} autoHideTimeout={800} autoHideDuration={200}>
                    <div className={'detail-body'}>
                        <div className={'detail-row'}>
                            <div className={'detail-group size-7'}>
                                <div onClick={() => this.setState({editable: !this.editable})} className={`detail-label${this.state.name !== undefined && this.props.selectedProject  ? ' value-changed' : ''}`}>{'Project name:'}</div>
                                <Input disabled={!this.editable} className={`detail-input${this.state.validation.name ? ' invalid' : ''}`} onChange={this.handleNameChange} value={name}/>
                            </div>
                            <div className={'detail-group size-5'}>
                                <div className={`detail-label${this.state.status !== undefined && this.props.selectedProject ? ' value-changed' : ''}`}>{'Project status:'}</div>
                                {this.editable ? <Select
                                    options={statusOptions}
                                    value={{value: status, label: status}}
                                    onChange={this.handleStatusChange}
                                    isSearchable={false}
                                    className={'detail-select'}
                                    classNamePrefix={'detail-select'}
                                /> : <Input disabled={!this.editable} className={'detail-input'} value={status}/>}
                            </div>
                        </div>
                        <div className={'detail-row'}>
                            <div className={'detail-group size-12'}>
                                <div className={`detail-label${this.state.statusNote !== undefined && this.props.selectedProject ? ' value-changed' : ''}`}>{'Status note:'}</div>
                                <Input disabled={!this.editable} className={`detail-input${this.state.statusNote ? ' invalid' : ''}`} onChange={this.handleStatusNoteChange} value={statusNote}/>
                            </div>
                        </div>
                        <div className={'detail-spacer'}/>
                        <div className={'detail-row'}>
                            <div className={'detail-group size-6'}>
                                <div className={`detail-label${this.state.statusNote !== undefined && this.props.selectedProject ? ' value-changed' : ''}`}>{'Client Company:'}</div>
                            </div>
                            <div className={'detail-group size-6'}>
                                <div className={`detail-label${this.state.statusNote !== undefined && this.props.selectedProject ? ' value-changed' : ''}`}>{'Client People:'}</div>
                            </div>
                        </div>
                    </div>
                </Scrollbars>
            </div>
        )
    }

    close() {
        this.props.setView(ViewTypes.PROJECTS_LIST)
    }

    save() {
        if(this.props.project) {
            this.props.updateProject(this.props.project, this.state.project);
        } else {
            this.props.addProject(this.state.project);
        }

        this.props.setView(ViewTypes.PROJECTS_LIST)
    }

    remove(id) {

    }

    currentProject(project) {
        this.setState({project: project}, this.setSaveDisabled);
    }

    setSaveDisabled() {
        const disabled = this.state.project === null || Object.keys(this.state.project).length === 0 || !this.isCurrentProjectValid();
        if(this.state.saveDisabled !== disabled) this.setState({saveDisabled: disabled});
    }

    isCurrentProjectValid() { //TODO check name is unique, report notValidStatus
        const project = Object.assign({}, this.props.projects && this.props.projects[this.props.project] ? this.props.projects[this.props.project] : {}, this.state.project);
        const validation = {};
        if(!project.name || !project.name.trim()) validation['name'] = {field: 'Project name', status: 'Is empty'};
        if(!project.status) validation['name'] = {field: 'Project status', status: 'Is not set'};
        this.setState({validation: validation});
        return Object.keys(validation).length === 0;
    }

    handleRemoveArmed() {
        this.setState({removeArmed: !this.state.removeArmed})
    }

    handleNameChange(event) {
        if(!this.props.selectedProject) this.setState({ name: event.target.value }, this.sendCurrentProject);
        else {
            if(event.target.value !== this.props.projects[this.props.selectedProject].name) this.setState({ name: event.target.value }, this.sendCurrentProject);
            else this.setState({ name: undefined }, this.sendCurrentProject);
        }
    }

    handleStatusChange(option) {
        if(!this.props.selectedProject) this.setState({ status: option.value }, this.sendCurrentProject);
        else {
            if(option.value !== this.props.projects[this.props.selectedProject].status) this.setState({ status: option.value }, this.sendCurrentProject);
            else this.setState({ status: undefined }, this.sendCurrentProject);
        }
    }

    handleStatusNoteChange(event) {
        if(!this.props.selectedProject) this.setState({ statusNote: event.target.value }, this.sendCurrentProject);
        else {
            if(event.target.value !== this.props.projects[this.props.selectedProject].statusNote) this.setState({ statusNote: event.target.value }, this.sendCurrentProject);
            else this.setState({ statusNote: undefined }, this.sendCurrentProject);
        }
    }

    //**************************

    sendCurrentProject() {
        this.props.currentProject(this.getCurrentState());
    }

    getCurrentState() {
        const state = {...this.state};
        for(const key of Object.keys(state)) if(state[key] === undefined) delete state[key];
        return state;
    }
}