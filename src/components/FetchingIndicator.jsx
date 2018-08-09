import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default props => {
        return (
            <div className={`fetching-indicator${props.open ? '' : ' hidden'}`}>
                <FontAwesomeIcon icon={'spinner'} pulse/>
            </div>
        )
}