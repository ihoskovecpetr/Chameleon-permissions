import * as ActionTypes from '../actions/ActionTypes';

function PersonsReducer (state = null, action = null) {
    if(action && action.type) {
        switch(action.type) {
            case ActionTypes.RESET_STORE:
                return {};

            case ActionTypes.SET_DATA:
                if(action.data.persons) return action.data.persons.reduce((object, person) => {object[person._id] = person; return object}, {});
                return state;

            case ActionTypes.UPDATE_PERSON:
            case ActionTypes.CREATE_PERSON:
                if(action.person && action.person._id) return {...state, [action.person._id]: action.person};
                else return state;

            case ActionTypes.REMOVE_PERSON:
                if(action.person && state[action.person]) {
                    const projects = {...state};
                    delete projects[action.person];
                    return projects;
                } else return state;

            case ActionTypes.REMOVE_COMPANY:
                const newPersonsRemove = {...state};
                let hasChangedRemove = false;
                for(const personId of Object.keys(newPersonsRemove)) {
                    const index = newPersonsRemove[personId].company ? newPersonsRemove[personId].company.indexOf(action.company) : -1;
                    if(index >= 0) {
                        hasChangedRemove = true;
                        const newCompany = [...newPersonsRemove[personId].company];
                        newCompany.splice(index, 1);
                        newPersonsRemove[personId] = {...newPersonsRemove[personId], company: newCompany};
                    }
                }
                if(hasChangedRemove) return newPersonsRemove;
                else return state;

            case ActionTypes.UPDATE_COMPANY:
            case ActionTypes.CREATE_COMPANY:
                const newPersonsUpdate = {...state};
                let hasChangedUpdate = false;
                for(const personId of Object.keys(newPersonsUpdate)) {
                    const companyShouldBeInPerson = action.company.person.indexOf(personId) >= 0;
                    const companyInPersonIndex = newPersonsUpdate[personId].company ? newPersonsUpdate[personId].company.indexOf(action.company._id) : -1;
                    if(companyShouldBeInPerson && companyInPersonIndex < 0) {
                        hasChangedUpdate = true;
                        newPersonsUpdate[personId] = {...newPersonsUpdate[personId], company: newPersonsUpdate[personId].company ? [...newPersonsUpdate[personId].company, action.company._id] : [action.company._id]}
                    } else if(!companyShouldBeInPerson && companyInPersonIndex >= 0) {
                        hasChangedUpdate = true;
                        const newCompany = [...newPersonsUpdate[personId].company];
                        newCompany.splice(companyInPersonIndex, 1);
                        newPersonsUpdate[personId] = {...newPersonsUpdate[personId], company: newCompany};
                    }
                }
                if(hasChangedUpdate) return newPersonsUpdate;
                else return state;

            default:
                return state;
        }
    } else return state;
}

export default PersonsReducer;