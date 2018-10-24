import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Toolbox from '../toolbox/DetailToolbox';
import {TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT, TABLE_SCROLLBARS_AUTO_HIDE_DURATION} from '../../constants/Constatnts';
import * as CompanyBusiness from '../../constants/CompanyBusiness';
import ContactElement from '../element/ContactElement';
import ProjectsForSubject from '../element/ProjectsForSubject';
import PersonsInCompany from '../element/PersonsInCompany';

export default class CompanyDetail extends React.PureComponent {
    render() {
        const {projects, persons, company} = this.props;

        const name = company.name ? company.name : '';
        const business = company.business ? company.business.map(business => CompanyBusiness[business] ? CompanyBusiness[business].label : `<${business()}>`)  : [];
        const contact = company.contact ? company.contact : [];
        const person  = company.person ? company.person : [];
        const note = company.note ? company.note : '';

        return (
            <div className={'app-body'}>
                <Toolbox
                    returnToPreviousView = {this.props.returnToPreviousView}
                    edit = {this.props.edit}
                    remove = {this.props.remove}
                    addToBox = {this.props.addToBox}
                    selected = {company._id}
                    label = {'Company'}
                    editable={this.props.editable}
                />
                <Scrollbars autoHide={true} autoHideTimeout={TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT} autoHideDuration={TABLE_SCROLLBARS_AUTO_HIDE_DURATION}>
                    <div className={'detail-body'}>
                        <div className={'detail-row'}>
                            <div className={'detail-group size-5'}>
                                <div className={`detail-label`}>{'Company Name:'}</div>
                                <div className={`detail-value selectable`}>{name}</div>
                            </div>
                            <div className={'detail-group size-7'}>
                                <div className={`detail-label`}>{'Business:'}</div>
                                <div className={`detail-value group wrap`}>
                                    {business.map((business, i) => <div key={i} className={'value-item comma'}>{business}</div> )}
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
                        <PersonsInCompany
                            persons={persons}
                            members={person}
                            showPerson={this.props.showPerson}
                        />
                        <ProjectsForSubject
                            projects={projects}
                            id={company._id}
                            showProject={this.props.showProject}
                            type={'company'}
                        />
                        {note ?
                            <div className={'detail-row spacer'}>
                                <div className={'detail-group size-12'}>
                                    <div className={`detail-label`}>{'Company note:'}</div>
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