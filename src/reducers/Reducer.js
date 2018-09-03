import { combineReducers } from 'redux';

import appState from './AppStateReducer';
import projects from './ProjectsReducer';
import persons from './PersonsReducer';
import companies from './CompaniesReducer';
import users from './UsersReducer';
import user from './UserReducer';

const rootReducer = combineReducers({
    appState,
    projects,
    persons,
    companies,
    users,
    user
});

export default rootReducer;