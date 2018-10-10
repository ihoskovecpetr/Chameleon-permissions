import React from 'react';
import * as PersonProfession from '../../constants/PersonProfession';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '../../constants/Icons';

export default function PersonsInCompany(props) {
    const {persons, members} = props;

    if(members.length > 0) {
        return (
            <div className={'detail-row spacer'}>
                <div className={'detail-group size-12 column'}>
                    <div className={`detail-label column`}>{'Company People:'}</div>
                    <div className={'detail-subject-company'}>
                    {members.map((person, i) => {
                        return (persons[person] ?
                            <div key={i} className={'person'}>
                                <div className={'name clickable'} onClick={() => props.showPerson(person, false, true)}><FontAwesomeIcon className={'prefix-icon'} icon={Icons.ICON_EDITOR_PERSON}/>{persons[person].name}</div>
                                <div className={'role'}>{persons[person].profession.map(profession => PersonProfession[profession] ? PersonProfession[profession].label : profession).join(', ')}</div>
                            </div>
                        : null)}
                    )}
                    </div>
                </div>
            </div>
        )
    } else return null;
}
