import { combineReducers } from 'redux';

import appState from './AppStateReducer';
import projects from './ProjectsReducer';
import persons from './PersonsReducer';
import companies from './CompaniesReducer';
import users from './UsersReducer';
import user from './UserReducer';

import person_state from '../components/modules/PersonModule';
import project_state from '../components/modules/ProjectModule';
import group_state from '../components/modules/GroupModule';
import group_manager_state from '../components/modules/GroupManagerModule';
import candidate_state from '../components/modules/CandidateModule';


const rootReducer = combineReducers({
    project_state,
    person_state,
    group_state,
    group_manager_state,
    candidate_state,
    appState,
    users,
    user
});

export default rootReducer;