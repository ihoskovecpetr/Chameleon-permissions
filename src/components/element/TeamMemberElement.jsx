import React, {Fragment} from 'react';
import * as TeamRole from "../../constants/TeamRole";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function getTeamMemberElement(props) {
    const {teamMember, users} = props;
    if(!teamMember) return null;
    return (
        <Fragment>
            {teamMember.role.map((role, i) => <span key={i} data-tooltip={TeamRole[role].label}><FontAwesomeIcon icon={TeamRole[role].icon}/></span>)}
            <span>{users[teamMember.id] ? users[teamMember.id].name : `<${teamMember.id}>`}</span>
        </Fragment>
    )
}