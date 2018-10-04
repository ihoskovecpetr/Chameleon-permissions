import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Toolbox from '../toolbox/DetailToolbox';
import {TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT, TABLE_SCROLLBARS_AUTO_HIDE_DURATION} from '../../constants/Constatnts';
import * as PersonProfession from '../../constants/PersonProfession';
import ContactElement from '../element/ContactElement';
import ProjectsForSubject from '../element/ProjectsForSubject';

export default class PersonDetail extends React.PureComponent {
    render() {
        const {projects, companies, person} = this.props;

        const name = person.name ? person.name : '';
        const profession = person.profession ? person.profession.map(profession => PersonProfession[profession] ? PersonProfession[profession].label : `<${profession()}>`)  : [];
        const contact = person.contact ? person.contact : [];
        const company = person.company ? person.company : [];

        return (
            <div className={'app-body'}>
                <Toolbox
                    returnToPreviousView = {this.props.returnToPreviousView}
                    edit = {this.props.edit}
                    remove = {this.props.remove}
                    addToBox = {this.props.addToBox}
                    selected = {person._id}
                    label = {'Person'}
                    editable={this.props.editable}
                />
                <Scrollbars autoHide={true} autoHideTimeout={TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT} autoHideDuration={TABLE_SCROLLBARS_AUTO_HIDE_DURATION}>
                    <div className={'detail-body'}>
                        <div className={'detail-row'}>
                            <div className={'detail-group size-5'}>
                                <div className={`detail-label`}>{'Person name:'}</div>
                                <div className={`detail-value selectable`}>{name}</div>
                            </div>
                            <div className={'detail-group size-7'}>
                                <div className={`detail-label`}>{'Profession:'}</div>
                                <div className={`detail-value group wrap`}>
                                    {profession.map((profession, i) => <div key={i} className={'value-item comma'}>{profession}</div> )}
                                </div>
                            </div>
                        </div>
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group size-12'}>
                                <div className={`detail-label`}>{'Companies:'}</div>
                                <div className={'detail-value group wrap'}>
                                    {company.map((company, i) => companies[company] ? <div onClick={() => this.props.showCompany(company, false, true)} key={i} className={'value-item clickable underline comma'}><span>{companies[company].name}</span></div> : null)}
                                </div>
                            </div>
                        </div>
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group size-12'}>
                                <div className={`detail-label`}>{'Contacts:'}</div>
                                <div className={'detail-value group wrap'}>
                                    {contact.map((contactItem, i) => <div key={i} className={'value-item selectable'}><ContactElement contact={contactItem}/></div>)}
                                </div>
                            </div>
                        </div>
                        <ProjectsForSubject
                            projects={projects}
                            id={person._id}
                            showProject={this.props.showProject}
                            type={'person'}
                        />
                    </div>
                </Scrollbars>
            </div>
        )
    }
}