import React from 'react';
import moment from 'moment';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const ICON_USER = 'user';
const ICON_RELOAD = 'sync-alt';
const ICON_LOGOUT = 'sign-out-alt';
const ICON_HOME = 'home';

export default class AppHeader extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className={'app-header'}>
                <div className={'header-group'}>
                    <FontAwesomeIcon onClick={this.props.home} className={`fa-icon first clickable`} icon={ICON_HOME} fixedWidth/>
                    <FontAwesomeIcon onClick={this.props.refresh} className={'fa-icon next clickable'} icon={ICON_RELOAD} fixedWidth/>
                    <span>{this.props.appName}</span>
                    <span className={'version'}>{this.props.appVersion}</span>
                    <FontAwesomeIcon className={'fa-icon'} icon={ICON_USER}/>
                    <span>{this.props.user.name}</span>
                    <FontAwesomeIcon onClick={this.props.logout} className={'fa-icon next clickable'} icon={ICON_LOGOUT} fixedWidth/>
                </div>
                {/*this.props.width !== 'small' ?*/}
                    <div className={'header-group right hidden-sm'}>
                        <span>{moment().format('dddd D.M.YYYY')}</span>
                    </div>
                {/*: null*/}
            </div>
        )
    }
}