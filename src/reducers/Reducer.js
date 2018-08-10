import { combineReducers } from 'redux';

import appState from './AppStateReducer';
import projects from './ProjectsReducer';
import people from './PeopleReducer';
import companies from './CompaniesReducer';
import users from './UsersReducer';
import user from './UserReducer';

const rootReducer = combineReducers({
    appState,
    projects,
    people,
    companies,
    users,
    user
});

export default rootReducer;