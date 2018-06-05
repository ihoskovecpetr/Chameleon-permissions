import React from 'react';
import {name as APP_NAME, version as APP_VERSION}  from '../../package.json';

import AppHeader from './AppHeader';
import AppBody from './AppBody';
import AppToolbox from './AppToolbox';

export default class AppLayout extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};

        this.refresh = this.refresh.bind(this);
        this.logout = this.logout.bind(this);
        this.home = this.home.bind(this);

        this.appName = `${APP_NAME.charAt(0).toUpperCase()}${APP_NAME.substr(1)}`;
    }

    render() {
        return (
            <div className={'app-layout'}>
                <AppHeader
                    appName = {this.appName}
                    appVersion = {APP_VERSION}
                    user = {this.props.user}
                    refresh = {this.refresh}
                    logout = {this.logout}
                    home = {this.home}
                    width = {this.state.width}
                />
                <AppToolbox
                    visible = {true}
                />
                <AppBody
                    data = {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50]}
                />
            </div>
        )
    }

    refresh() {
        console.log('REFRESH')
    }

    logout() {
        console.log('LOGOUT')
    }

    home() {
        console.log('HOME')
    }
}