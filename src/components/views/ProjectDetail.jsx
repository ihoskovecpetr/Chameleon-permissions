import React, {Fragment} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Scrollbars } from 'react-custom-scrollbars';
import { Input } from 'reactstrap';

import * as ProjectStatus from '../../constants/ProjectStatus';
import * as Icons from "../../constants/Icons";

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
                        <div onClick={this.addToBox} className={`tool-box-button blue`}><FontAwesomeIcon icon={Icons.ICON_BOX_ARROW_RIGHT}/><FontAwesomeIcon icon={Icons.ICON_BOX}/></div>
                        {!this.props.removeProject ? null :
                            <Fragment>
                                <div onClick={!this.state.removeArmed ? undefined : this.remove} className={`tool-box-button remove red${!this.state.removeArmed ? ' disabled' : ''}`}>{'Remove Project'}</div>
                                <FontAwesomeIcon className={`tool-box-checkbox`} onClick={this.handleRemoveArmed} icon={this.state.removeArmed ? Icons.ICON_CHECKBOX_CHECKED : Icons.ICON_CHECKBOX_UNCHECKED} style={{cursor: 'pointer'}}/>
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
                                <Input disabled={true} className={'detail-input readonly'} value={ProjectStatus[project.status] ? ProjectStatus[project.status].label : project.status}/>
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