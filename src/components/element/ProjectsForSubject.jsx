import React, {Fragment} from 'react';
import * as PersonProfession from '../../constants/PersonProfession';
import * as CompanyBusiness from '../../constants/CompanyBusiness';
import * as CompanyFlag from '../../constants/CompanyFlag';
import * as PersonFlag from '../../constants/PersonFlag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '../../constants/Icons';

export default function ProjectsForSubject(props) {
    const {projects, id, type} = props;
    const projectsForSubject = Object.keys(projects).filter(projectId => {
        const filteredForId = projects[projectId][type].filter(item => item.id === id);
        return filteredForId.length > 0;
    }).map(projectId => {
        const project = projects[projectId];
        const person = project[type].find(item => item.id === id);
        return {
            id: projectId,
            name: project.name,
            flag: <Fragment>{person.flag.map((flag, i) => <div key={i} data-tooltip={getFlagTooltip(flag)} className={`flag-icon${i === 0 ? ' first' : ''}`}><FontAwesomeIcon icon={getFlagIcon(flag)}/></div>)}</Fragment>,
            role: type === 'person' ? person.profession.map(profession => PersonProfession[profession] ? PersonProfession[profession].label : profession) : person.business.map(business => CompanyBusiness[business] ? CompanyBusiness[business].label : business)
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
                                </div>
                                <div className={'role'}>{project.role.join(', ')}</div>
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
    switch (flag) {
        case CompanyFlag.UPP_CLIENT:
            return 'UPP Client';
        case PersonFlag.BUSINESS:
            return 'Business';
        case PersonFlag.CREATIVITY:
            return 'Creativity';
        case PersonFlag.ORGANIZATION:
            return 'Organization';
        default: return '???';
    }
}

function getFlagIcon(flag) {
    switch (flag) {
        case CompanyFlag.UPP_CLIENT:
            return Icons.ICON_EDITOR_FLAG_CLIENT;
        case PersonFlag.BUSINESS:
            return Icons.ICON_EDITOR_FLAG_BUSINESS;
        case PersonFlag.CREATIVITY:
            return Icons.ICON_EDITOR_FLAG_CREATIVITY;
        case PersonFlag.ORGANIZATION:
            return Icons.ICON_EDITOR_FLAG_ORGANIZE;
        default: return '';
    }
}
