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

const ICON_BOX = 'box-open';

export default class ProjectDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            removeArmed: false,
        };
        this.editable = false;
    }

    render() {
        const {selectedProject, projects} = this.props;

        const project = projects[selectedProject] ? projects[selectedProject] : {};


        return (
            <div className={'app-body'}>
                <div className={'app-toolbox'}>
                    <div className={'inner-container'}>
                    <div className={'toolbox-group'}>
                        <div onClick={this.close} className={'tool-box-button'}>{'Close'}</div>
                        {!this.props.editProject ? null :
                            <div onClick={this.edit} className={`tool-box-button`}>{'Edit'}</div>
                        }
                        <div onClick={this.addToBox} className={`tool-box-button icon box blue`}><FontAwesomeIcon icon={ICON_BOX}/></div>
                        {!this.props.removeProject ? null :
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
                                <div className={`detail-label`}>{'Project name:'}</div>
                                <Input disabled={true} className={`detail-input readonly`} value={project.name}/>
                            </div>
                            <div className={'detail-group size-5'}>
                                <div className={`detail-label`}>{'Project status:'}</div>
                                <Input disabled={true} className={'detail-input readonly'} value={ProjectStatus[project.status].label}/>
                            </div>
                        </div>
                        <div className={'detail-row'}>
                            <div className={'detail-group size-12'}>
                                <div className={`detail-label`}>{'Status note:'}</div>
                                <Input disabled={true} className={`detail-input readonly`} value={project.statusNote}/>
                            </div>
                        </div>
                        <div className={'detail-spacer'}/>
                        <div className={'detail-row'}>
                            <div className={'detail-group size-4'}>
                                <div className={`detail-label`}>{'Team:'}</div>
                            </div>
                            <div className={'detail-group size-4'}>
                                <div className={`detail-label`}>{'Client Companies:'}</div>
                            </div>
                            <div className={'detail-group size-4'}>
                                <div className={`detail-label`}>{'Client Persons:'}</div>
                            </div>
                        </div>
                    </div>
                </Scrollbars>
            </div>
        )
    }
    // *****************************************************************************************************************
    // CLOSE, EDIT,  REMOVE
    // *****************************************************************************************************************
    close = () => {
        this.props.returnToPreviousView();
    };

    edit = () => {
        this.props.editProject();
    };

    remove = () => {
        this.props.removeProject();
        this.close();
    };

    // *****************************************************************************************************************
    // HELPERS
    // *****************************************************************************************************************
    handleRemoveArmed = () => {
        this.setState({removeArmed: !this.state.removeArmed})
    };

    addToBox = () => {
        this.props.addToBox(this.props.selectedProject);
    };

}