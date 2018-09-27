import React, {Fragment} from 'react';
import * as ContactType from "../../constants/ContactType";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function getContactElement(props) {
    const {contact} = props;
    if(!contact || !contact.type || !contact.data) return null;
    const icon = ContactType[contact.type] ? ContactType[contact.type].icon : null;
    let element;
    switch (contact.type) {
        case 'WWW':
            const url = contact.data.trim().indexOf('http') === 0 ? contact.data : `http://${contact.data}`;
            element = <a href={url} target='_blank'>{contact.data}</a>;
            break;
        case 'EMAIL':
            element = <a href={`mailto:${contact.data}`}>{contact.data}</a>;
            break;
        default:
            element = <span>{contact.data}</span>;
    }

    return (
        <Fragment>
            {icon ? <FontAwesomeIcon icon={ContactType[contact.type].icon}/> : null}
            {element}
        </Fragment>
    )
}