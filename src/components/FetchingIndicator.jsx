import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as Icons from '../constants/Icons';

export default class FetchingIndicator extends React.PureComponent {
    render() {
        return (
            <div className={`fetching-indicator${this.props.open ? '' : ' hidden'}`}>
                <FontAwesomeIcon icon={Icons.ICON_LOADING} pulse/>
            </div>
        )
    }
}