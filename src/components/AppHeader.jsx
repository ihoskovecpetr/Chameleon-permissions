import React from 'react';
import moment from 'moment';
import * as logger from 'loglevel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ViewTypes from '../constants/ViewTypes';

import * as Icons from '../constants/Icons';

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

        let activeSwitch;
        let switchesEnabled = true;
        switch(this.props.view) {
            case ViewTypes.PROJECT_NEW:
            case ViewTypes.PROJECT_EDIT:
                switchesEnabled = Object.keys(this.props.projectEditedData).length === 0;
            case ViewTypes.PROJECTS_LIST:
            case ViewTypes.PROJECT_DETAIL:
            case ViewTypes.PROJECT_DETAIL_NEXT:
                activeSwitch = 'projects';
                break;

            case ViewTypes.COMPANY_NEW:
            case ViewTypes.COMPANY_EDIT:
                switchesEnabled = Object.keys(this.props.companyEditedData).length === 0;
            case ViewTypes.COMPANIES_LIST:
            case ViewTypes.COMPANY_DETAIL:
            case ViewTypes.COMPANY_DETAIL_NEXT:
                activeSwitch = 'companies';
                break;

            case ViewTypes.PERSON_NEW:
            case ViewTypes.PERSON_EDIT:
                switchesEnabled = Object.keys(this.props.personEditedData).length === 0;
            case ViewTypes.PERSONS_LIST:
            case ViewTypes.PERSON_DETAIL:
            case ViewTypes.PERSON_DETAIL_NEXT:
                activeSwitch = 'persons';
                break;

            case ViewTypes.BOX:
                activeSwitch = 'box';
                break;
        }

        return (
            <div className={'app-header-outer'}>
                <div className={'app-header'}>
                    <div className={'header-group'}>
                        <FontAwesomeIcon onClick={this.home} className={`fa-icon margin-right clickable`} icon={Icons.ICON_HOME} fixedWidth/>
                        <FontAwesomeIcon onClick={this.refresh} className={'fa-icon margin-right clickable'} icon={Icons.ICON_RELOAD} fixedWidth/>
                        <span className={'app-name'}>{`${this.props.appName.charAt(0).toUpperCase()}${this.props.appName.substr(1)}`}</span>
                        <span className={'version'}>{` (${this.props.appVersion})`}</span>
                        <div className={'header-divider'}/>
                        <FontAwesomeIcon className={'fa-icon margin-right'} icon={Icons.ICON_USER}/>
                        <span className={'header-name long'}>{userName}</span>
                        <span className={'header-name short'}>{userNameShort}</span>
                        <FontAwesomeIcon onClick={this.logout} className={'fa-icon margin-left clickable'} icon={Icons.ICON_LOGOUT} fixedWidth/>
                    </div>

                    <div className={'header-group center header-switch'}>
                        <div onClick={() => switchesEnabled && this.props.view !== ViewTypes.PROJECTS_LIST ? this.props.setView(ViewTypes.PROJECTS_LIST) : undefined} className={`switch${activeSwitch === 'projects' ? ' active' : ''}${switchesEnabled && this.props.view !== ViewTypes.PROJECTS_LIST ? ' clickable' : ''}`}>
                            <FontAwesomeIcon icon={Icons.ICON_PROJECTS}/>
                            <span className={'switch-text'}>{'Projects'}</span>
                            {this.props.activeBid ? <FontAwesomeIcon className={'dot'} icon={'circle'}/> : null}
                        </div>
                        <div onClick={() => switchesEnabled && this.props.view !== ViewTypes.PERSONS_LIST ? this.props.setView(ViewTypes.PERSONS_LIST) : undefined} className={`switch${activeSwitch === 'persons' ? ' active' : ''}${switchesEnabled && this.props.view !== ViewTypes.PERSONS_LIST ? ' clickable' : ''}`}>
                            <FontAwesomeIcon icon={Icons.ICON_PERSONS}/>
                            <span className={'switch-text'}>{'People'}</span>
                        </div>
                        <div onClick={() => switchesEnabled && this.props.view !== ViewTypes.COMPANIES_LIST ? this.props.setView(ViewTypes.COMPANIES_LIST) : undefined} className={`switch${activeSwitch === 'companies' ? ' active' : ''}${switchesEnabled && this.props.view !== ViewTypes.COMPANIES_LIST ? ' clickable' : ''}`}>
                            <FontAwesomeIcon icon={Icons.ICON_COMPANIES}/>
                            <span className={'switch-text'}>{'Companies'}</span>
                        </div>
                    </div>

                    <div onClick={switchesEnabled && this.props.view !== ViewTypes.BOX && this.props.box && this.props.box.length > 0 ? () => this.props.setView(ViewTypes.BOX) : undefined} className={`header-group box${activeSwitch === 'box' ? ' active' : ''}${switchesEnabled && this.props.view !== ViewTypes.BOX && this.props.box && this.props.box.length > 0 ? ' clickable' : ''}`}>
                        <FontAwesomeIcon className={'icon-box'} icon={Icons.ICON_BOX}/>
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