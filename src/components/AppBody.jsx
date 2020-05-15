import React, {useEffect} from 'react';
import moment from 'moment';
import * as logger from 'loglevel';
import Container from '@material-ui/core/Container';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ViewTypes from '../constants/ViewTypes';
import {logout as dbLogout} from '../lib/serverData';

import AppProjectsContainer from './element/AppProjectsContainer';
import * as server from '../lib/serverData';

export default function AppBody(){


        return (
            <Container maxWidth="md" style={{marginTop: 10, height: '100vh', overflow: 'scroll'}}>
                <AppProjectsContainer  />
            </Container>
        )

    refresh = async () => {
        try {
            props.refresh();
        } catch(e) {}
    };

    logout = async () => {
        try {
            await dbLogout();
        } catch (e) {
            document.cookie = "auth_token=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        }
        window.location.assign('/hub');
    };

    home = () => {
        window.location.assign('/hub');
    };
}