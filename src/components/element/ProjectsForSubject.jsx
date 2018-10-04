import React from 'react';
import * as PersonProfession from '../../constants/PersonProfession';
import * as CompanyBusiness from '../../constants/CompanyBusiness';

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
            flag: person.flag,
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
                                <div onClick={() => props.showProject(project.id, false, true)} className={`name`}>
                                    {project.name}
                                    <div className={``}>{project.flag.join(', ')}</div>
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
