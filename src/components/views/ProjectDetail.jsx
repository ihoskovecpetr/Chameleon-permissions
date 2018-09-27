import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Toolbox from '../toolbox/DetailToolbox';
import {TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT, TABLE_SCROLLBARS_AUTO_HIDE_DURATION} from '../../constants/Constatnts';
import TeamMemberElement from '../element/TeamMemberElement';
import * as ProjectStatus from '../../constants/ProjectStatus';
import * as CompanyBusiness from '../../constants/CompanyBusiness';
import * as PersonProfession from '../../constants/PersonProfession';
import * as CompanyFlag from '../../constants/CompanyFlag';
import * as PersonFlag from '../../constants/PersonFlag';
import moment from "moment";
import * as TeamRole from "../../constants/TeamRole";

export default class ProjectDetail extends React.PureComponent {
    render() {
        const {selected, projects} = this.props;
        const project = projects[selected] ? projects[selected] : {};

        const name = project.name ? project.name : '';
        const status = ProjectStatus[project.status] ? ProjectStatus[project.status].label : project.status;
        const statusNote = project.statusNote ? project.statusNote : '';
        const lastContact = project.lastContact ? moment(project.lastContact).format('D.M.YYYY') : 'Not set';
        const team =  project.team ? project.team : [];
        team.sort((a, b) => (a.role.map(role => TeamRole[role] ? TeamRole[role].sort : 100).reduce((a, b) => Math.min(a, b), 100)) - (b.role.map(role => TeamRole[role] ? TeamRole[role].sort : 100).reduce((a, b) => Math.min(a, b), 100)));
        let client = {};

        if(project.company) {
            for(const company of project.company) {
                if (!client[company.id]) client[company.id] = {};
                client[company.id] = {
                    name: this.props.companies[company.id] ? this.props.companies[company.id].name : `<${company.id}>`,
                    uppClient: company.flag && company.flag.indexOf(CompanyFlag.UPP_CLIENT) >= 0,
                    business: company.business ? this.props.companies[company.id].business.map(business => ({
                        label: CompanyBusiness[business] ? CompanyBusiness[business].label : business,
                        active: company.business.indexOf(business) >= 0
                    })) : [],
                    people: []
                }
            }
        }

        if(project.person) {
            for(const person of project.person) {
                const companyId = person.company && client[person.company] ? person.company : 'noCompany';
                if(companyId === 'noCompany' && !client[companyId]) client[companyId] = {
                    name: 'No company group',
                    virtual: true,
                    business: [],
                    people: []
                };
                client[companyId].people.push({
                    name: this.props.persons[person.id] ? this.props.persons[person.id].name : `<${person.id}>`,
                    profession: person.profession ? this.props.persons[person.id].profession.map(profession => ({
                        label: PersonProfession[profession] ? PersonProfession[profession].label : profession,
                        businessRole: person.flag && person.flag.indexOf(PersonFlag.BUSINESS) >= 0,
                        creativityRole: person.flag && person.flag.indexOf(PersonFlag.CREATIVITY) >= 0,
                        organisationRole: person.flag && person.flag.indexOf(PersonFlag.ORGANIZATION) >= 0,
                        active: person.profession.indexOf(profession) >= 0
                    })) : []
                })
            }
        }

        client = Object.keys(client).map(companyId => client[companyId]);

        console.log(client);

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
                            <div className={'detail-group size-6'}>
                                <div className={`detail-label`}>{'Project name:'}</div>
                                <div className={`detail-value selectable`}>{name}</div>
                            </div>
                            <div className={'detail-group size-3'}>
                                <div className={`detail-label`}>{'Project status:'}</div>
                                <div className={`detail-value`}>{status}</div>
                            </div>
                            <div className={'detail-group size-3'}>
                                <div className={`detail-label`}>{'Last Contact:'}</div>
                                <div className={`detail-value selectable`}>{lastContact}</div>
                            </div>
                        </div>
                        {statusNote ?
                        <div className={'detail-row'}>
                            <div className={'detail-group size-12'}>
                                <div className={`detail-label`}>{'Status note:'}</div>
                                <div className={`detail-value`}>{statusNote}</div>
                            </div>
                        </div>
                        : null}
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group size-12'}>
                                <div className={`detail-label`}>{'UPP Team:'}</div>
                                <div className={'detail-value group wrap'}>
                                    {team.map((teamMember, i) => <div key={i} className={`value-item selectable${teamMember.id === this.props.user.id ? ' highlighted' : ''}`}><TeamMemberElement teamMember={teamMember} users={this.props.users}/></div>)}
                                </div>
                            </div>
                        </div>
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group size-12'}>
                                <div className={`detail-label column`}>{'Companies/People:'}</div>
                            </div>
                        </div>
                    </div>
                </Scrollbars>
            </div>
        )
    }
}