import * as ActionTypes from '../actions/ActionTypes';

function CompaniesReducer (state = null, action = null) {
    if(action && action.type) {
        switch(action.type) {
            case ActionTypes.RESET_STORE:
                return {};

            case ActionTypes.SET_DATA:
                if(action.data.companies) return action.data.companies.reduce((object, company) => {object[company._id] = company; return object}, {});
                return state;

            case ActionTypes.UPDATE_COMPANY:
            case ActionTypes.CREATE_COMPANY:
                if(action.company && action.company._id) return {...state, [action.company._id]: action.company};
                else return state;

            case ActionTypes.REMOVE_COMPANY:
                if(action.company && state[action.company]) {
                    const projects = {...state};
                    delete projects[action.company];
                    return projects;
                } else return state;

            case ActionTypes.REMOVE_PERSON:
                const newCompanies = {...state};
                let hasChanged = false;
                for(const companyId of Object.keys(newCompanies)) {
                    const index = newCompanies[companyId].person.indexOf(action.person);
                    if(index >= 0) {
                        hasChanged = true;
                        newCompanies[companyId] = {...newCompanies[companyId], person: [...newCompanies[companyId].person].splice(index, 1)};
                    }
                }
                if(hasChanged) return newCompanies;
                else return state;

            default:
                return state;
        }
    } else return state;
}

export default CompaniesReducer;