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
        const nameLong = this.props.user.name;
        let nameShort = this.props.user.name ? this.props.user.name.split(' ') : this.props.user.name;
        if(nameShort && Array.isArray(nameShort) && nameShort.length > 1) {
            nameShort = `${nameShort[0].charAt(0)}. ${nameShort.slice(1).join(' ')}`
        } else nameShort = this.props.user.name;
        return (
            <div className={'app-header'}>
                <div className={'header-group'}>
                    <FontAwesomeIcon onClick={this.props.home} className={`fa-icon first clickable`} icon={ICON_HOME} fixedWidth/>
                    <FontAwesomeIcon onClick={this.props.refresh} className={'fa-icon next clickable'} icon={ICON_RELOAD} fixedWidth/>
                    <span>{this.props.appName}</span>
                    <span className={'version'}>{`- ${this.props.appVersion}`}</span>
                    <div className={'header-divider'}/>
                    <FontAwesomeIcon className={'fa-icon first'} icon={ICON_USER}/>
                    <span className={'header-name long'}>{nameLong}</span>
                    <span className={'header-name short'}>{nameShort}</span>
                    <FontAwesomeIcon onClick={this.props.logout} className={'fa-icon next clickable'} icon={ICON_LOGOUT} fixedWidth/>
                </div>

                <div className={'header-group right header-date'}>
                    <span>{moment().format('dddd D.M.YYYY')}</span>
                </div>

            </div>
        )
    }
}