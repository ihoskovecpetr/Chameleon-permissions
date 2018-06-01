import React from 'react';
import {name as APP_NAME}  from '../../package.json';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const ICON_USER = 'user';

export default class AppLayout extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className={'app-layout'}>
                <div className={'app-header'}>
                    {`Minimal "${APP_NAME.toUpperCase()}" App.`}
                    <FontAwesomeIcon icon={ICON_USER}/>
                    <span>{this.props.user.name}</span>
                </div>
                <div className={'app-body'}>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                    <p>AAAAAAAAAA</p>
                </div>
            </div>
        )
    }
}