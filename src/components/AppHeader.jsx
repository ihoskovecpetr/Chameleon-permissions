import React from 'react';
import moment from 'moment';
import * as logger from 'loglevel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as LayoutTypes from '../constants/LayoutTypes';

const ICON_USER = 'user';
const ICON_RELOAD = 'sync-alt';
const ICON_LOGOUT = 'sign-out-alt';
const ICON_HOME = 'home';

const ICON_PEOPLE = 'users';
const ICON_COMPANY = 'building';
const ICON_PROJECTS = 'tasks';
const ICON_ACTIVE_BID = 'hand-holding-usd';

export default class AppHeader extends React.PureComponent {
    constructor(props) {
        super(props);

        this.refresh = this.refresh.bind(this);
        this.logout = this.logout.bind(this);
        this.home = this.home.bind(this);
    }

    render() {
        const userName = this.props.user ? this.props.user.name : 'Unauthorised';
        let userNameShort = userName.split(' ');
        if(userNameShort && Array.isArray(userNameShort) && userNameShort.length > 1) {
            userNameShort = `${userNameShort[0].charAt(0)}. ${userNameShort.slice(1).join(' ')}`
        } else userNameShort = userName;

        const switchEnabled = this.props.layout === LayoutTypes.PROJECTS || this.props.layout === LayoutTypes.ACTIVE_BID || this.props.layout === LayoutTypes.PEOPLE || this.props.layout === LayoutTypes.COMPANY;
        const projectsSwitchActive = this.props.layout === LayoutTypes.PROJECTS || this.props.layout === LayoutTypes.PROJECT_DETAIL;
        const activeBidSwitchActive = this.props.layout === LayoutTypes.ACTIVE_BID || this.props.layout === LayoutTypes.ACTIVE_BID_DETAIL;
        const peopleSwitchActive = this.props.layout === LayoutTypes.PEOPLE || this.props.layout === LayoutTypes.PEOPLE_DETAIL;
        const companySwitchActive = this.props.layout === LayoutTypes.COMPANY || this.props.layout === LayoutTypes.COMPANY_DETAIL;

        return (
            <div className={'app-header-outer'}>
                <div className={'app-header'}>
                    <div className={'header-group'}>
                        <FontAwesomeIcon onClick={this.home} className={`fa-icon margin-right clickable`} icon={ICON_HOME} fixedWidth/>
                        <FontAwesomeIcon onClick={this.refresh} className={'fa-icon margin-right clickable'} icon={ICON_RELOAD} fixedWidth/>
                        <span className={'app-name'}>{`${this.props.appName.charAt(0).toUpperCase()}${this.props.appName.substr(1)}`}</span>
                        <span className={'version'}>{` (${this.props.appVersion})`}</span>
                        <div className={'header-divider'}/>
                        <FontAwesomeIcon className={'fa-icon margin-right'} icon={ICON_USER}/>
                        <span className={'header-name long'}>{userName}</span>
                        <span className={'header-name short'}>{userNameShort}</span>
                        <FontAwesomeIcon onClick={this.logout} className={'fa-icon margin-left clickable'} icon={ICON_LOGOUT} fixedWidth/>
                    </div>

                    <div className={'header-group center header-switch'}>
                        <div onClick={() => switchEnabled && !projectsSwitchActive ? this.props.setLayout(LayoutTypes.PROJECTS) : undefined} className={`switch${projectsSwitchActive ? ' active' : switchEnabled ? ' clickable' : ''}`}>
                            <FontAwesomeIcon className={'fa-layout-icon'} icon={ICON_PROJECTS}/>
                            <span className={'switch-text'}>{'Projects'}</span>
                        </div>
                        <div onClick={() => switchEnabled && !activeBidSwitchActive ? this.props.setLayout(LayoutTypes.ACTIVE_BID) : undefined} className={`switch${activeBidSwitchActive ? ' active' : switchEnabled ? ' clickable' : ''}`}>
                            <FontAwesomeIcon className={'fa-layout-icon'} icon={ICON_ACTIVE_BID}/>
                            <span className={'switch-text'}>{'Active Bids'}</span>
                        </div>
                        <div onClick={() => switchEnabled && !peopleSwitchActive ? this.props.setLayout(LayoutTypes.PEOPLE) : undefined} className={`switch${peopleSwitchActive ? ' active' : switchEnabled ? ' clickable' : ''}`}>
                            <FontAwesomeIcon className={'fa-layout-icon'} icon={ICON_PEOPLE}/>
                            <span className={'switch-text'}>{'People'}</span>
                        </div>
                        <div onClick={() => switchEnabled && !companySwitchActive ? this.props.setLayout(LayoutTypes.COMPANY) : undefined} className={`switch${companySwitchActive ? ' active' : switchEnabled ? ' clickable' : ''}`}>
                            <FontAwesomeIcon className={'fa-layout-icon'} icon={ICON_COMPANY}/>
                            <span className={'switch-text'}>{'Companies'}</span>
                        </div>
                    </div>

                    <div className={'header-group right header-date'}>
                        <span>{moment().format('dddd D.M.YYYY')}</span>
                    </div>
                </div>
            </div>
        )
    }

    refresh() {
        logger.info('Refresh data');
        this.props.refresh();
    }

    logout() {
        logger.info('Logout');
    }

    home() {
        logger.info('Go home');
    }
}