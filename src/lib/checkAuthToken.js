'use strict';

import jwt from "jsonwebtoken";
import {name as app} from '../../package.json';

export default function checkToken() {
    const config = {
        interval: 10000,
        authTokenName: 'auth_token',
        authTokenSecret: 'cham3l30n_Aut43nt1cat10n_53cr3t'
    };
    if(config && config.authTokenName && config.authTokenSecret && config.interval) {
        setInterval(() => {
            if(document.cookie) {
                const authToken = document.cookie.replace(new RegExp(`(?:(?:^|.*;\\s*)${config.authTokenName}\\s*\\=\\s*([^;]*).*$)|^.*$`), "$1");
                const authTokenPayload = jwt.decode(authToken, config.authTokenSecret);
                if(authTokenPayload && (authTokenPayload.exp - Math.round((+new Date()) / 1000) >= 0)) return;
            }
            window.location.assign(`/login${app ? `?app=/${app}` : ''}`);
        }, config.interval);
    }
}