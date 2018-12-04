import React, {Fragment} from 'react';
import * as TeamRole from "../../constants/TeamRole";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as StringFormatter from '../../lib/stringFormatHelper';

export default function TeamMemberElement(props) {
    const {teamMember, users, shortName} = props;
    if(!teamMember) return null;
    return (
        <Fragment>
            {teamMember.role.map((role, i) => <span className={'team-member-icon'} key={i} data-tooltip={TeamRole[role].label}><FontAwesomeIcon icon={TeamRole[role].icon}/></span>)}
            <span className={'team-member-name'}>{getName(teamMember.id, users, shortName)}</span>
        </Fragment>
    )
}

function getName(id, users, short) {
    if(users[id]) {
        const name = users[id].name;
        if(short) {
            return StringFormatter.getSurrname(name);
        } else return name;
    } else return `<${id}>`;
}