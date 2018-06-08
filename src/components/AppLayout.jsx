import React from 'react';

import AppHeader from './AppHeader';
import AppBody from './AppBody';
import MessageBox from './MessageBox';
import FetchingIndicator from './FetchingIndicator';

export default class AppLayout extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={'app-layout'}>
                <AppHeader
                    appName = {this.props.appName}
                    appVersion = {this.props.appVersion}
                    user = {this.props.user}
                    refresh = {this.props.refresh}
                    logout = {this.props.logout}
                    home = {this.props.home}
                    dataTimestamp = {this.props.dataTimestamp}
                />
                <MessageBox
                    message = {this.props.message}
                    close = {() => this.props.setMessage(null)}
                />
                <AppBody
                    projects = {this.props.projects}
                    updateProject = {this.props.updateProject}
                    addProject = {this.props.addProject}
                />
                <FetchingIndicator open={this.props.isFetching}/>
            </div>
        )
    }


}