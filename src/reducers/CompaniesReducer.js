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
                const newCompaniesRemove = {...state};
                let hasChangedRemove = false;
                for(const companyId of Object.keys(newCompaniesRemove)) {
                    const index = newCompaniesRemove[companyId].person ? newCompaniesRemove[companyId].person.indexOf(action.person) : -1;
                    if(index >= 0) {
                        hasChangedRemove = true;
                        const newPerson = [...newCompaniesRemove[companyId].person];
                        newPerson.splice(index, 1);
                        newCompaniesRemove[companyId] = {...newCompaniesRemove[companyId], person: newPerson};
                    }
                }
                if(hasChangedRemove) return newCompaniesRemove;
                else return state;

            case ActionTypes.UPDATE_PERSON:
            case ActionTypes.CREATE_PERSON:
                const newCompaniesUpdate = {...state};
                let hasChangedUpdate = false;
                for(const companyId of Object.keys(newCompaniesUpdate)) {
                    const personShouldBeInCompany = action.person.company.indexOf(companyId) >= 0;
                    const personInCompanyIndex =  newCompaniesUpdate[companyId].person ? newCompaniesUpdate[companyId].person.indexOf(action.person._id) : -1;
                    if(personShouldBeInCompany && personInCompanyIndex < 0) {
                        hasChangedUpdate = true;
                        newCompaniesUpdate[companyId] = {...newCompaniesUpdate[companyId], person: newCompaniesUpdate[companyId].person ? [...newCompaniesUpdate[companyId].person, action.person._id] : [action.person._id]}
                    } else if(!personShouldBeInCompany && personInCompanyIndex >= 0) {
                        hasChangedUpdate = true;
                        const newPerson = [...newCompaniesUpdate[companyId].person];
                        newPerson.splice(personInCompanyIndex, 1);
                        newCompaniesUpdate[companyId] = {...newCompaniesUpdate[companyId], person: newPerson};
                    }
                }
                if(hasChangedUpdate) return newCompaniesUpdate;
                else return state;

            default:
                return state;
        }
    } else return state;
}

export default CompaniesReducer;