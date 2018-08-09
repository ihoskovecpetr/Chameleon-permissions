import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default props => {
        return (
            <div className={`app-message-box ${props.message ? props.message.type : 'hidden'}`}>
                <FontAwesomeIcon onClick={props.close} className={'close-button'} icon={'times'} fixedWidth/>
                <span>{props.message ? props.message.text : '- - -'}</span>
            </div>
        )
}