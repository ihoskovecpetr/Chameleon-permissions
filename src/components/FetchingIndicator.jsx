import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class FetchingIndicator extends React.PureComponent {
    render() {
        return (
            <div className={`fetching-indicator${this.props.open ? '' : ' hidden'}`}>
                <FontAwesomeIcon icon={'spinner'} pulse/>
            </div>
        )
    }
}