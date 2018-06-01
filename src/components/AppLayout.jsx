import React from 'react';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const ICON_USER = 'user';

export default class AppLayout extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <div className={'test'}>
            {'Minimal App!'}
            <FontAwesomeIcon icon={ICON_USER}/>
        </div>
    }
}