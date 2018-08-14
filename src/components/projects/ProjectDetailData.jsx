import React, {Fragment} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Input, Col,  Row, Label, FormGroup } from 'reactstrap';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as ProjectStatus from '../../constants/ProjectStatus';

const statusOptions = Object.keys(ProjectStatus).map(key => {return {value: ProjectStatus[key], label: ProjectStatus[key]}});

export default class ProjectDetailData extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            status: !props.project ? ProjectStatus.PREBID : undefined
        };

        this.editable = true;

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);

        this.sendCurrentProject = this.sendCurrentProject.bind(this);
        this.getCurrentState = this.getCurrentState.bind(this);
        this.handleStatusNoteChange = this.handleStatusNoteChange.bind(this);
    }

    render() {
        const name = this.state.name !== undefined ? this.state.name : !this.props.project ? '' : this.props.projects[this.props.project] ? this.props.projects[this.props.project].name : '';
        const status = this.state.status !== undefined ? this.state.status : this.props.projects[this.props.project] ? this.props.projects[this.props.project].status : null;
        const statusNote = this.state.statusNote !== undefined ? this.state.statusNote : this.props.projects[this.props.project] ? this.props.projects[this.props.project].statusNote : '';

        return (
            <Scrollbars autoHide={true} autoHideTimeout={800} autoHideDuration={200}>
                <div className={'detail-body'}>
                    <div className={'detail-row'}>
                        <div className={'detail-group size-7'}>
                            <div onClick={() => this.setState({editable: !this.editable})} className={`detail-label${this.state.name !== undefined && this.props.project  ? ' value-changed' : ''}`}>{'Project name:'}</div>
                            <Input disabled={!this.editable} className={`detail-input${this.props.validation.name ? ' invalid' : ''}`} onChange={this.handleNameChange} value={name}/>
                        </div>
                        <div className={'detail-group size-5'}>
                            <div className={`detail-label${this.state.status !== undefined && this.props.project ? ' value-changed' : ''}`}>{'Project status:'}</div>
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
                            <div className={`detail-label${this.state.statusNote !== undefined && this.props.project ? ' value-changed' : ''}`}>{'Status note:'}</div>
                            <Input disabled={!this.editable} className={`detail-input${this.props.validation.statusNote ? ' invalid' : ''}`} onChange={this.handleStatusNoteChange} value={statusNote}/>
                        </div>
                    </div>
                    <div className={'detail-spacer'}/>
                    <div className={'detail-row'}>
                        <div className={'detail-group size-6'}>
                            <div className={`detail-label${this.state.statusNote !== undefined && this.props.project ? ' value-changed' : ''}`}>{'Client Company:'}</div>
                        </div>
                        <div className={'detail-group size-6'}>
                            <div className={`detail-label${this.state.statusNote !== undefined && this.props.project ? ' value-changed' : ''}`}>{'Client People:'}</div>
                        </div>
                    </div>
                </div>
            </Scrollbars>
        )
    }

    handleNameChange(event) {
        if(!this.props.project) this.setState({ name: event.target.value }, this.sendCurrentProject);
        else {
            if(event.target.value !== this.props.projects[this.props.project].name) this.setState({ name: event.target.value }, this.sendCurrentProject);
            else this.setState({ name: undefined }, this.sendCurrentProject);
        }
    }

    handleStatusChange(option) {
        if(!this.props.project) this.setState({ status: option.value }, this.sendCurrentProject);
        else {
            if(option.value !== this.props.projects[this.props.project].status) this.setState({ status: option.value }, this.sendCurrentProject);
            else this.setState({ status: undefined }, this.sendCurrentProject);
        }
    }

    handleStatusNoteChange(event) {
        if(!this.props.project) this.setState({ statusNote: event.target.value }, this.sendCurrentProject);
        else {
            if(event.target.value !== this.props.projects[this.props.project].statusNote) this.setState({ statusNote: event.target.value }, this.sendCurrentProject);
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