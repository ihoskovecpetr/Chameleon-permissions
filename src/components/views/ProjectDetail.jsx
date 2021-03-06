import React, {Fragment} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toolbox from '../toolbox/DetailToolbox';
import {TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT, TABLE_SCROLLBARS_AUTO_HIDE_DURATION} from '../../constants/Constatnts';
import TeamMemberElement from '../element/TeamMemberElement';
import * as ProjectStatus from '../../constants/ProjectStatus';
import * as CompanyBusiness from '../../constants/CompanyBusiness';
import * as PersonProfession from '../../constants/PersonProfession';
import * as CompanyFlag from '../../constants/CompanyFlag';
import * as PersonFlag from '../../constants/PersonFlag';
import * as ProjectClientTiming from '../../constants/ProjectClientTiming';
import moment from "moment";
import * as TeamRole from "../../constants/TeamRole";
import * as VipTag from '../../constants/VipTag';
import * as Icons from '../../constants/Icons';
import * as StringFormatter from '../../lib/stringFormatHelper';

export default class ProjectDetail extends React.PureComponent {
    render() {
        const {project, projects} = this.props;

        const name = project.name ? project.name : '';
        const alias = project.alias ? project.alias : '';
        const status = ProjectStatus[project.status] ? ProjectStatus[project.status].label : project.status;
        const statusNote = project.statusNote ? project.statusNote : '';
        const projectNote = project.projectNote ? project.projectNote : '';
        const story = project.story ? project.story : '';
        const lastContact = project.lastContact ? moment(project.lastContact).format('D.M.YYYY') : 'Not set';
        const inquired = project.inquired ? moment(project.inquired).format('D.M.YYYY') : 'Not set';
        const team =  project.team ? project.team : [];
        const ballparkFrom = project.budget && project.budget.ballpark && project.budget.ballpark.from ? project.budget.ballpark.from : null;
        const ballparkTo = project.budget && project.budget.ballpark && project.budget.ballpark.to ? project.budget.ballpark.to : null;
        const ballparkCurrency = project.budget && project.budget.ballpark && project.budget.ballpark.currency ? project.budget.ballpark.currency : 'eur';

        const vipTag = project.vipTag ? project.vipTag : [];
        const vipTagNote = project.vipTagNote ? project.vipTagNote : '';

        const timing = project.timing ? project.timing : [];

        timing.sort((a, b) => 0);

        team.sort((a, b) => (a.role.map(role => TeamRole[role] ? TeamRole[role].sort : 100).reduce((a, b) => Math.min(a, b), 100)) - (b.role.map(role => TeamRole[role] ? TeamRole[role].sort : 100).reduce((a, b) => Math.min(a, b), 100)));
        let client = {};

        if(project.company) {
            for (const company of project.company) {
                if(this.props.companies[company.id]) {
                    if (!client[company.id]) client[company.id] = {};
                    client[company.id] = {
                        id: company.id,
                        name: this.props.companies[company.id].name,
                        uppClient: company.flag && company.flag.indexOf(CompanyFlag.UPP_CLIENT.id) >= 0,
                        business: company.business ? this.props.companies[company.id].business.map(business => ({
                            label: CompanyBusiness[business] ? CompanyBusiness[business].label : business,
                            active: company.business.indexOf(business) >= 0
                        })).sort((a, b) => (a.active ? 0 : 1) - (b.active ? 0 : 1)) : [],
                        people: [],
                        note: company.note
                    }
                }
            }
        }

        if(project.person) {
            for(const person of project.person) {
                if(this.props.persons[person.id]) {
                    const companyId = person.company && client[person.company] ? person.company : 'noCompany';
                    if (companyId === 'noCompany' && !client[companyId]) client[companyId] = {
                        name: 'No company group',
                        virtual: true,
                        business: [],
                        people: []
                    };
                    client[companyId].people.push({
                        id: person.id,
                        name: this.props.persons[person.id].name,
                        profession: person.profession ? this.props.persons[person.id].profession.map(profession => ({
                            label: PersonProfession[profession] ? PersonProfession[profession].label : profession,
                            active: person.profession.indexOf(profession) >= 0
                        })).sort((a, b) => (a.active ? 0 : 1) - (b.active ? 0 : 1)) : [],
                        businessRole: person.flag && person.flag.indexOf(PersonFlag.BUSINESS.id) >= 0,
                        creativityRole: person.flag && person.flag.indexOf(PersonFlag.CREATIVITY.id) >= 0,
                        organisationRole: person.flag && person.flag.indexOf(PersonFlag.ORGANIZATION.id) >= 0,
                        note: person.note
                    })
                }
            }
        }

        client = Object.keys(client).map(companyId => client[companyId]);
        // sort persons inside of company
        for(const company of client) company.people.sort((b, a) => ((a.businessRole ? 4 : 0) + (a.creativityRole ? 2 : 0) + (a.organisationRole ? 1 : 0)) - ((b.businessRole ? 4 : 0) + (b.creativityRole ? 2 : 0) + (b.organisationRole ? 1 : 0)));
        // sort companies
        client.sort((a, b) => {
            return (a.uppClient ? 0 : 1) - (b.uppClient ? 0 : 1);
        });
        return (
            <div className={'app-body'}>
                <Toolbox
                    returnToPreviousView = {this.props.returnToPreviousView}
                    edit = {this.props.edit}
                    remove = {this.props.remove}
                    addToBox = {this.props.addToBox}
                    selected = {project._id}
                    label = {'Project'}
                    id = {projects && project.projectId ? project.projectId : null}
                    editable={this.props.editable}
                />

                <Scrollbars  className={'body-scroll-content projects'} autoHide={true} autoHideTimeout={TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT} autoHideDuration={TABLE_SCROLLBARS_AUTO_HIDE_DURATION}>
                    <div className={'detail-body'}>
                        <div className={'detail-row'}>
                            <div className={'detail-group size-6'}>
                                <div className={`detail-label`}>{'Project Name:'}</div>
                                <div className={`detail-value selectable`}>{alias ? <Fragment><span>{name}</span><span className={'alias-name'}>{alias}</span></Fragment> : name}</div>
                            </div>
                            <div className={'detail-group size-3'}>
                                <div className={`detail-label`}>{'Project Inquired:'}</div>
                                <div className={`detail-value selectable`}>{inquired}</div>
                            </div>
                            <div className={'detail-group size-3'}>
                                <div className={`detail-label`}>{'Last Contact:'}</div>
                                <div className={`detail-value selectable`}>{lastContact}</div>
                            </div>
                        </div>
                        {vipTag.length > 0 ?
                        <div className={'detail-row'}>
                            <div className={'detail-group size-3'}>
                                <div className={`detail-label`}>{'Prestige:'}</div>
                                <div className={`detail-value group with-tooltip`}>
                                    {vipTag.map((tag, i) => <div key={i} className={'tag-icon'} data-tooltip={VipTag[tag].label}><FontAwesomeIcon icon={VipTag[tag].icon}/></div>)}
                                </div>
                            </div>
                            <div className={'detail-group size-9'}>
                                <div className={`detail-label`}>{'Prestige Note:'}</div>
                                <div className={`detail-value selectable`}>{vipTagNote}</div>
                            </div>
                        </div>
                        : null}
                        <div className={'detail-row'}>
                            <div className={'detail-group size-3'}>
                                <div className={`detail-label`}>{'Project Status:'}</div>
                                <div className={`detail-value`}>{status}</div>
                            </div>
                            {statusNote ?
                                <div className={'detail-group size-9'}>
                                    <div className={`detail-label`}>{'Status Note:'}</div>
                                    <div className={`detail-value multi-line`}>{statusNote}</div>
                                </div>
                                : null}
                        </div>
                        {ballparkFrom || ballparkTo?
                            <div className={'detail-row spacer'}>
                                <div className={'detail-group size-6'}>
                                    <div className={`detail-label`}>{'Budget:'}</div>
                                    <div className={`detail-value selectable`}>{`${StringFormatter.currencyFormat(ballparkFrom, ballparkCurrency.toUpperCase())}${ballparkTo ? ` - ${StringFormatter.currencyFormat(ballparkTo, ballparkCurrency.toUpperCase())}` : ''}`}</div>
                                </div>
                            </div>
                        : null}
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group size-12'}>
                                <div className={`detail-label`}>{'Client Timing:'}</div>
                                <div className={'detail-value group wrap'}>
                                    {timing.map((timingLine, i) => <div key={i}>{`${ProjectClientTiming[timingLine.label].label}: ${moment(timingLine.date).format('D.M.YYYY')}`}</div>)}
                                </div>
                            </div>
                        </div>
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group size-12'}>
                                <div className={`detail-label`}>{'UPP Team:'}</div>
                                <div className={'detail-value group wrap'}>
                                    {team.map((teamMember, i) => <div key={i} className={`value-item selectable${teamMember.id === this.props.user._id ? ' highlighted' : ''}`}><TeamMemberElement teamMember={teamMember} users={this.props.users}/></div>)}
                                </div>
                            </div>
                        </div>
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group size-12 column'}>
                                <div className={`detail-label column`}>{'Companies/People:'}</div>
                                {client.map((company, i) =>
                                    <div className={`detail-project-client`} key={i}>
                                        {company.virtual ?
                                            <div className={'company'}>
                                                <div className={'role-icon'}><FontAwesomeIcon icon={Icons.ICON_EDITOR_NO_COMPANY}/></div>
                                            </div> :
                                            <div className={`company${company.people.length === 0 ? ' empty' : ''}`}>
                                                <div className={'field name'}>
                                                    <div className={'clickable flex-center'} onClick={() => this.props.showCompany(company.id, false, true)}><FontAwesomeIcon className={'prefix-icon'} icon={Icons.ICON_EDITOR_COMPANY}/>{company.name}</div>
                                                    {company.uppClient ? <div  data-tooltip={'UPP Client'} className={'role-icon first'}><FontAwesomeIcon icon={Icons.ICON_EDITOR_FLAG_CLIENT}/></div> : null}
                                                </div>
                                                <div className={`field profession-business${company.note ? '' : ' wide'}`}>{company.business.map((business, i) => <span key={i} className={`item${business.active ? ' ' : ' disabled'}`}>{business.label}</span>)}</div>
                                                {company.note ? <div className={'field note'}>{company.note}</div> : null}
                                            </div>
                                        }
                                        {company.people.map((person, i) =>
                                            <div key={i} className={'person'}>
                                                <div className={'field name for-person'}>
                                                    <div className={'clickable flex-center'} onClick={() => this.props.showPerson(person.id, false, true)}><FontAwesomeIcon className={'prefix-icon'} icon={Icons.ICON_EDITOR_PERSON}/>{person.name}</div>
                                                    {person.businessRole ? <div  data-tooltip={'Business'} className={'role-icon first'}><FontAwesomeIcon icon={Icons.ICON_EDITOR_FLAG_BUSINESS}/></div> : null}
                                                    {person.creativityRole ? <div  data-tooltip={'Creativity'} className={'role-icon'}><FontAwesomeIcon icon={Icons.ICON_EDITOR_FLAG_CREATIVITY}/></div> : null}
                                                    {person.organisationRole ? <div  data-tooltip={'Organization'} className={'role-icon'}><FontAwesomeIcon icon={Icons.ICON_EDITOR_FLAG_ORGANIZE}/></div> : null}
                                                </div>
                                                <div className={`field profession-business${person.note ? '' : ' wide'}`}>{person.profession.map((profession, i) => <span key={i} className={`item${profession.active ? '' : ' disabled'}`}>{profession.label}</span>)}</div>
                                                {person.note ? <div className={'field note'}>{person.note}</div> : null}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        {projectNote ?
                            <div className={'detail-row spacer'}>
                                <div className={'detail-group size-12'}>
                                    <div className={`detail-label`}>{'Project note:'}</div>
                                    <div className={`detail-value multi-line`}>{projectNote}</div>
                                </div>
                            </div>
                        : null}
                        {story ?
                            <div className={'detail-row spacer'}>
                                <div className={'detail-group size-12'}>
                                    <div className={`detail-label`}>{'Project story:'}</div>
                                    <div className={`detail-value multi-line`}>{story}</div>
                                </div>
                            </div>
                        : null}
                    </div>
                </Scrollbars>
            </div>
        )
    }
}