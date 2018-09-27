import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Input } from 'reactstrap';
import Toolbox from '../toolbox/DetailToolbox';

import {TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT, TABLE_SCROLLBARS_AUTO_HIDE_DURATION} from '../../constants/Constatnts';

import * as ProjectStatus from '../../constants/ProjectStatus';

export default class ProjectDetail extends React.PureComponent {
    render() {
        const {selected, projects} = this.props;
        const project = projects[selected] ? projects[selected] : {};

        return (
            <div className={'app-body'}>
                <Toolbox
                    returnToPreviousView = {this.props.returnToPreviousView}
                    edit = {this.props.edit}
                    remove = {this.props.remove}
                    addToBox = {this.props.addToBox}
                    selected = {this.props.selected}
                    label = {'Project'}
                    id = {selected && projects[selected] ? projects[selected].projectId : null}
                />

                <Scrollbars autoHide={true} autoHideTimeout={TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT} autoHideDuration={TABLE_SCROLLBARS_AUTO_HIDE_DURATION}>
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
}