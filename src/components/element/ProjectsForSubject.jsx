import React from 'react';

export default function ProjectsForSubject(props) {
    const {projects, id, type} = props;
    const projectsForSubject = Object.keys(projects).filter(projectId => {
        const aaa = projects[projectId][type].filter(item => item.id === id);
        return aaa.length > 0;
    });
    if(projectsForSubject.length > 0) {
        return (
            <div className={'detail-row spacer'}>
                <div className={'detail-group size-12 column'}>
                    <div className={`detail-label column`}>{'UPP projects:'}</div>
                    {projectsForSubject.map((projectId, i) =>
                        <div key={i} className={''}>
                            {projects[projectId].name}
                        </div>
                    )}
                </div>
            </div>
        )
    } else return null;
}