import React, {Fragment} from 'react';
import * as PersonProfession from '../../constants/PersonProfession';
import * as CompanyBusiness from '../../constants/CompanyBusiness';
import * as CompanyFlag from '../../constants/CompanyFlag';
import * as PersonFlag from '../../constants/PersonFlag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ProjectStatus from '../../constants/ProjectStatus'
import * as StringFormatter from '../../lib/stringFormatHelper';
import TeamMemberElement from '../element/TeamMemberElement';
import * as TeamRole from '../../constants/TeamRole';
import moment from "moment";
import * as Icons from '../../constants/Icons';
import * as VipTags from '../../constants/VipTag';

import Tooltip  from 'rc-tooltip';

export default function ProjectsForSubject(props) {
    const {projects, id, type, users} = props;
    const projectsForSubject = Object.keys(projects).filter(projectId => {
        const filteredForId = projects[projectId][type].filter(item => item.id === id);
        return filteredForId.length > 0;
    }).map(projectId => {
        const project = projects[projectId];
        const person = project[type].find(item => item.id === id);
        const ballparkFrom = project && project.budget && project.budget.ballpark ? project.budget.ballpark.from : 0;
        const ballparkTo = project && project.budget && project.budget.ballpark ? project.budget.ballpark.to : 0;
        const ballparkCurrency = project && project.budget && project.budget.ballpark && project.budget.ballpark.currency ? project.budget.ballpark.currency : 'eur';
        const statusClass = project && project.status ? project.status.toLowerCase() : '';
        const inquired = project && project.inquired ? moment(project.inquired).format('D.M.YYYY') : '';
        const team = project.team
            .filter(member => member.role.indexOf(TeamRole.PRODUCER.id) >= 0 || member.role.indexOf(TeamRole.MANAGER.id) >= 0 || member.role.indexOf(TeamRole.SUPERVISOR.id) >= 0 )
            .sort((a, b) => Math.min(...a.role.map(role => TeamRole[role].sort)) - Math.min(...b.role.map(role => TeamRole[role].sort)));
        const vipTag = project.vipTag && project.vipTag.length > 0 ? <span>{`${project.vipTag.map(tag => VipTags[tag] ? VipTags[tag].label : tag).join(', ')}\n${project.vipTagNote}`}</span> : null;
        return {
            id: projectId,
            name: project.alias ? <Fragment><span>{project.name}</span><span className={'alias-name'}>{project.alias}</span></Fragment> : project.name,
            flag: <Fragment>{person.flag.map((flag, i) => <div key={i} data-tooltip={getFlagTooltip(flag)} className={`flag-icon${i === 0 ? ' first' : ''}`}><FontAwesomeIcon icon={getFlagIcon(flag)}/></div>)}</Fragment>,
            role: type === 'person' ? person.profession.map(profession => PersonProfession[profession] ? PersonProfession[profession].label : profession) : person.business.map(business => CompanyBusiness[business] ? CompanyBusiness[business].label : business),
            status: project.status && ProjectStatus[project.status] ? ProjectStatus[project.status].label : 'Unknown Status',
            budget: ballparkFrom ? `${ballparkTo ? `${StringFormatter.currencyFormat(ballparkFrom)} - ${StringFormatter.currencyFormat(ballparkTo, ballparkCurrency.toUpperCase())}` : StringFormatter.currencyFormat(ballparkFrom, ballparkCurrency.toUpperCase())}` : null,
            team: team && team.length > 0 ? <Fragment>{team.map((teamMember, i) => <div key={i} className={`team-member`}><TeamMemberElement teamMember={teamMember} users={users} shortName={true}/></div>)}</Fragment> : null,
            statusClass: statusClass,
            inquired: inquired ? <span data-tooltip={`Inquired: ${inquired}`}>{inquired}</span> : '',
            vipTag: vipTag ?
                <Tooltip
                    align={{offset: [10, 0]}}
                    destroyTooltipOnHide={true}
                    overlay={vipTag}
                ><div className={'flag-icon vip'}><FontAwesomeIcon icon={Icons.ICON_VIP_TAG}/></div></Tooltip> : null
        }
    });
    if(projectsForSubject.length > 0) {
        return (
            <div className={'detail-row spacer'}>
                <div className={'detail-group size-12 column'}>
                    <div className={`detail-label column`}>{'UPP projects:'}</div>
                    <div className={'detail-subject-project'}>
                    {projectsForSubject.map((project, i) => {
                        return (
                            <div key={i} className={'project'}>
                                <div className={`name`}>
                                    <div className={'clickable'} onClick={() => props.showProject(project.id, false, true)}>{project.name}</div>
                                    {project.flag}
                                    {project.vipTag}
                                </div>
                                <div className={'role'}>{project.role.join(', ')}</div>
                                <div className={'team'}>{project.team}</div>
                                <div className={'inquired'}>{project.inquired}</div>
                                <div className={'status'}>
                                    <span className={project.statusClass}>{project.status}</span>
                                </div>
                                {project.budget ? <div className={'budget'}>{project.budget}</div> : null}
                            </div>
                        )}
                    )}
                    </div>
                </div>
            </div>
        )
    } else return null;
}

function getFlagTooltip(flag) {
    return CompanyFlag[flag] ? CompanyFlag[flag].label : PersonFlag[flag] ? PersonFlag[flag].label : '???';
}

function getFlagIcon(flag) {
    return CompanyFlag[flag] ? CompanyFlag[flag].icon : PersonFlag[flag] ? PersonFlag[flag].icon : '';
}
