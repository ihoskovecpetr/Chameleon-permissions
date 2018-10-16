import React from 'react';
import moment from 'moment';
import * as logger from 'loglevel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ViewTypes from '../constants/ViewTypes';

import * as Icons from '../constants/Icons';

export default class AppHeader extends React.PureComponent {
    constructor(props) {
        super(props);
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
            case ViewTypes.PROJECT_EDIT:
                switchesEnabled = this.props.projectNoEditData;
                activeSwitch = 'projects';
                break;
            case ViewTypes.PROJECT_LIST:
            case ViewTypes.PROJECT_DETAIL:
                activeSwitch = 'projects';
                break;
            case ViewTypes.COMPANY_EDIT:
                switchesEnabled = this.props.companyNoEditData;
                activeSwitch = 'companies';
                break;
            case ViewTypes.COMPANY_LIST:
            case ViewTypes.COMPANY_DETAIL:
                activeSwitch = 'companies';
                break;
            case ViewTypes.PERSON_EDIT:
                switchesEnabled = this.props.personNoEditData;
                activeSwitch = 'persons';
                break;
            case ViewTypes.PERSON_LIST:
            case ViewTypes.PERSON_DETAIL:
                activeSwitch = 'persons';
                break;
            case ViewTypes.BOX_LIST:
                activeSwitch = 'box';
                break;
        }

        return (
            <div className={'app-header-outer'}>
                <div className={'app-header'}>
                    <div className={'header-group'}>
                        <FontAwesomeIcon onClick={this.home} className={`fa-icon margin-right clickable`} icon={Icons.ICON_HEADER_HOME} fixedWidth/>
                        <FontAwesomeIcon onClick={this.refresh} className={'fa-icon margin-right clickable'} icon={Icons.ICON_HEADER_RELOAD} fixedWidth/>
                        <span className={'app-name'}>{`${this.props.appName.charAt(0).toUpperCase()}${this.props.appName.substr(1)}`}</span>
                        <span className={'version'}>{` (${this.props.appVersion})`}</span>
                        <div className={'header-divider'}/>
                        <FontAwesomeIcon className={'fa-icon margin-right'} icon={Icons.ICON_HEADER_USER}/>
                        <span className={'header-name long'}>{userName}</span>
                        <span className={'header-name short'}>{userNameShort}</span>
                        <FontAwesomeIcon onClick={this.logout} className={'fa-icon margin-left clickable'} icon={Icons.ICON_HEADER_LOGOUT} fixedWidth/>
                    </div>

                    <div className={'header-group center header-switch'}>
                        <div onClick={() => switchesEnabled && this.props.view !== ViewTypes.PROJECT_LIST ? this.props.setView(ViewTypes.PROJECT_LIST) : undefined} className={`switch${activeSwitch === 'projects' ? ' active' : ''}${switchesEnabled && this.props.view !== ViewTypes.PROJECT_LIST ? ' clickable' : ''}`}>
                            <FontAwesomeIcon icon={Icons.ICON_PROJECTS}/>
                            <span className={'switch-text'}>{'Projects'}</span>
                            {this.props.activeBid ? <FontAwesomeIcon className={'dot'} icon={'circle'}/> : null}
                        </div>
                        <div onClick={() => switchesEnabled && this.props.view !== ViewTypes.COMPANY_LIST ? this.props.setView(ViewTypes.COMPANY_LIST) : undefined} className={`switch${activeSwitch === 'companies' ? ' active' : ''}${switchesEnabled && this.props.view !== ViewTypes.COMPANY_LIST ? ' clickable' : ''}`}>
                            <FontAwesomeIcon icon={Icons.ICON_COMPANIES}/>
                            <span className={'switch-text'}>{'Companies'}</span>
                        </div>
                        <div onClick={() => switchesEnabled && this.props.view !== ViewTypes.PERSON_LIST ? this.props.setView(ViewTypes.PERSON_LIST) : undefined} className={`switch${activeSwitch === 'persons' ? ' active' : ''}${switchesEnabled && this.props.view !== ViewTypes.PERSON_LIST ? ' clickable' : ''}`}>
                            <FontAwesomeIcon icon={Icons.ICON_PERSONS}/>
                            <span className={'switch-text'}>{'People'}</span>
                        </div>
                    </div>

                    <div onClick={switchesEnabled && this.props.view !== ViewTypes.BOX_LIST && this.props.box && this.props.box.length > 0 ? () => this.props.setView(ViewTypes.BOX_LIST) : undefined} className={`header-group box${activeSwitch === 'box' ? ' active' : ''}${switchesEnabled && this.props.view !== ViewTypes.BOX_LIST && this.props.box && this.props.box.length > 0 ? ' clickable' : ''}`}>
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

    refresh = async () => {
        try {
            this.props.refresh();
        } catch(e) {}
    };

    logout = () => {
        window.location.replace('/login');
    };

    home = () => {
        window.location.replace('/hub');
    };
}