import React from 'react';
import moment from 'moment';
import * as logger from 'loglevel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ViewTypes from '../constants/ViewTypes';

const ICON_USER = 'user';
const ICON_RELOAD = 'sync-alt';
const ICON_LOGOUT = 'sign-out-alt';
const ICON_HOME = 'home';

const ICON_PERSONS = 'users';
const ICON_COMPANIES = 'building';
const ICON_PROJECTS = 'tasks';

const ICON_BOX = 'box-open';

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

        const projectsSwitchActive = this.props.view === ViewTypes.PROJECTS_LIST || this.props.view === ViewTypes.PROJECT_DETAIL || this.props.view === ViewTypes.PROJECT_DETAIL_NEXT || this.props.view === ViewTypes.PROJECT_EDIT;
        const personsSwitchActive = this.props.view === ViewTypes.PERSONS_LIST || this.props.view === ViewTypes.PERSON_DETAIL || this.props.view === ViewTypes.PERSON_DETAIL_NEXT || this.props.view === ViewTypes.PERSON_EDIT;
        const companySwitchActive = this.props.view === ViewTypes.COMPANIES_LIST || this.props.view === ViewTypes.COMPANY_DETAIL || this.props.view === ViewTypes.COMPANY_DETAIL_NEXT || this.props.view === ViewTypes.COMPANY_EDIT;
        const boxActive = this.props.view === ViewTypes.BOX;

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
                        <div onClick={() => this.props.switchesEnabled && this.props.view !== ViewTypes.PROJECTS_LIST ? this.props.setView(ViewTypes.PROJECTS_LIST) : undefined} className={`switch${projectsSwitchActive ? ' active' : ''}${this.props.switchesEnabled && this.props.view !== ViewTypes.PROJECTS_LIST ? ' clickable' : ''}`}>
                            <FontAwesomeIcon icon={ICON_PROJECTS}/>
                            <span className={'switch-text'}>{'Projects'}</span>
                            {this.props.activeBid ? <FontAwesomeIcon className={'dot'} icon={'circle'}/> : null}
                        </div>
                        <div onClick={() => this.props.switchesEnabled && this.props.view !== ViewTypes.PERSONS_LIST ? this.props.setView(ViewTypes.PERSONS_LIST) : undefined} className={`switch${personsSwitchActive ? ' active' : ''}${this.props.switchesEnabled && this.props.view !== ViewTypes.PERSONS_LIST ? ' clickable' : ''}`}>
                            <FontAwesomeIcon icon={ICON_PERSONS}/>
                            <span className={'switch-text'}>{'People'}</span>
                        </div>
                        <div onClick={() => this.props.switchesEnabled && this.props.view !== ViewTypes.COMPANIES_LIST ? this.props.setView(ViewTypes.COMPANIES_LIST) : undefined} className={`switch${companySwitchActive ? ' active' : ''}${this.props.switchesEnabled && this.props.view !== ViewTypes.COMPANIES_LIST ? ' clickable' : ''}`}>
                            <FontAwesomeIcon icon={ICON_COMPANIES}/>
                            <span className={'switch-text'}>{'Companies'}</span>
                        </div>
                    </div>

                    <div onClick={this.props.switchesEnabled && this.props.view !== ViewTypes.BOX && this.props.box && this.props.box.length > 0 ? () => this.props.setView(ViewTypes.BOX) : undefined} className={`header-group box${boxActive ? ' active' : ''}${this.props.switchesEnabled && this.props.view !== ViewTypes.BOX && this.props.box && this.props.box.length > 0 ? ' clickable' : ''}`}>
                        <FontAwesomeIcon className={'icon-box'} icon={ICON_BOX}/>
                        {this.props.box && this.props.box.length > 0 ? <span className="badge">{this.props.box.length}</span> : null}
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