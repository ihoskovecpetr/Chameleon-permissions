import React, {useState, useEffect} from 'react';

import { useHistory, NavLink } from "react-router-dom"

import moment from 'moment';
import * as logger from 'loglevel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ViewTypes from '../constants/ViewTypes';
import {logout as dbLogout} from '../lib/serverData';
import * as Icons from '../constants/Icons';

export default function AppHeader(props){
const [name, setName] = useState({
    userName: "",
    userNameShort: ""
})

    useEffect(() => {

        let userN = props.user ? props.user.name : 'Unauthorised';
        let userNShort = userN.split(' ');
        if(userNShort && Array.isArray(userNShort) && userNShort.length > 1) {
            userNShort = `${userNShort[0].charAt(0)}. ${userNShort.slice(1).join(' ')}`
        } else userNShort = userN;

        setName({
            userName: userN,
            userNameShort: userNShort
        })
    }, [props])

    const refresh = async () => {
        try {
            this.props.refresh();
        } catch(e) {}
    };

    const logout = async () => {
        try {
            await dbLogout();
        } catch (e) {
            document.cookie = "auth_token=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        }
        window.location.assign('/hub');
    };

    const home = () => {
        window.location.assign('/hub');
    };

    return (
        <div className={'app-header-outer'}>
            <div className={'app-header'}>
                <div className={'header-group'}>
                    <FontAwesomeIcon onClick={home} className={`fa-icon margin-right clickable`} icon={Icons.ICON_HEADER_HOME} fixedWidth/>
                    <FontAwesomeIcon onClick={refresh} className={'fa-icon margin-right clickable'} icon={Icons.ICON_HEADER_RELOAD} fixedWidth/>
                    <span className={'app-name'}>{`${props.appName.charAt(0).toUpperCase()}${props.appName.substr(1)}`}</span>
                    <span className={'version'}>{` (${props.appVersion})`}</span>
                    <div className={'header-divider'}/>
                    <FontAwesomeIcon className={'fa-icon margin-right'} icon={Icons.ICON_HEADER_USER}/>
                    <span className={'header-name long'}>{name.userName}</span>
                    <span className={'header-name short'}>{name.userNameShort}</span>
                    <FontAwesomeIcon onClick={logout} className={'fa-icon margin-left clickable'} icon={Icons.ICON_HEADER_LOGOUT} fixedWidth/>
                </div>

                <div className={'header-group center header-switch'}>
                    {/* <NavLink to="/">Projects</NavLink> /
                    <NavLink to="/search_people">People</NavLink> */}
                </div>

                <div className={'header-group right header-date'}>
                    <span>{moment().format('dddd D.M.YYYY')}</span>
                </div>
            </div>
        </div>
    )
    }