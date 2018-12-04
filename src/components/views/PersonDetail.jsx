import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Toolbox from '../toolbox/DetailToolbox';
import {TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT, TABLE_SCROLLBARS_AUTO_HIDE_DURATION} from '../../constants/Constatnts';
import * as PersonProfession from '../../constants/PersonProfession';
import ContactElement from '../element/ContactElement';
import ProjectsForSubject from '../element/ProjectsForSubject';
import CompaniesOfPerson from '../element/CompaniesOfPerson';

export default class PersonDetail extends React.PureComponent {
    render() {
        const {projects, companies, person, users} = this.props;

        const name = person.name ? person.name : '';
        const profession = person.profession ? person.profession.map(profession => PersonProfession[profession] ? PersonProfession[profession].label : `<${profession()}>`)  : [];
        const contact = person.contact ? person.contact : [];
        const company = person.company ? person.company : [];
        const note = person.note ? person.note : '';

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
                <Scrollbars  className={'body-scroll-content people'} autoHide={true} autoHideTimeout={TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT} autoHideDuration={TABLE_SCROLLBARS_AUTO_HIDE_DURATION}>
                    <div className={'detail-body'}>
                        <div className={'detail-row'}>
                            <div className={'detail-group size-5'}>
                                <div className={`detail-label`}>{'Person Name:'}</div>
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
                                <div className={`detail-label`}>{'Contacts:'}</div>
                                <div className={'detail-value group wrap'}>
                                    {contact.map((contactItem, i) => <div key={i} className={'value-item selectable'}><ContactElement contact={contactItem}/></div>)}
                                </div>
                            </div>
                        </div>
                        <CompaniesOfPerson
                            companies={companies}
                            members={company}
                            showCompany={this.props.showCompany}
                        />
                        <ProjectsForSubject
                            projects={projects}
                            users={users}
                            id={person._id}
                            showProject={this.props.showProject}
                            type={'person'}
                        />
                        {note ?
                            <div className={'detail-row spacer'}>
                                <div className={'detail-group size-12'}>
                                    <div className={`detail-label`}>{'Person note:'}</div>
                                    <div className={`detail-value multi-line`}>{note}</div>
                                </div>
                            </div>
                        : null}
                    </div>
                </Scrollbars>
            </div>
        )
    }
}