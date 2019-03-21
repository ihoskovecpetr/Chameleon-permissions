import * as ActionTypes from '../actions/ActionTypes';

function ProjectsReducer (state = null, action = null) {
    if(action && action.type) {
        switch(action.type) {
            case ActionTypes.RESET_STORE:
                return {};

            case ActionTypes.SET_DATA:
                if(action.data.projects) return action.data.projects.reduce((object, project) => {object[project._id] = project; return object}, {});
                return state;

            case ActionTypes.UPDATE_PROJECT:
            case ActionTypes.CREATE_PROJECT:
                if(action.project && action.project._id) return {...state, [action.project._id]: action.project};
                else return state;

            case ActionTypes.REMOVE_PROJECT:
                if(action.project && state[action.project]) {
                    const projects = {...state};
                    delete projects[action.project];
                    return projects;
                } else return state;

            case ActionTypes.REMOVE_PERSON:
                const newProjectsPerson = {...state};
                let hasChangedPerson = false;
                for(const projectId of Object.keys(newProjectsPerson)) {
                    const indexPerson = newProjectsPerson[projectId].person.findIndex(person => person.id === action.person);
                    if(indexPerson >= 0) {
                        hasChangedPerson = true;
                        newProjectsPerson[projectId] = {...newProjectsPerson[projectId], person: [...newProjectsPerson[projectId].person].splice(indexPerson, 1)};
                    }
                }
                if(hasChangedPerson) return newProjectsPerson;
                else return state;

            case ActionTypes.REMOVE_COMPANY:
                const newProjectCompany = {...state};
                let hasChangedCompany = false;
                for(const projectId of Object.keys(newProjectCompany)) {
                    const indexCompany = newProjectCompany[projectId].company.findIndex(company => company.id === action.company);
                    if(indexCompany >= 0) {
                        hasChangedCompany = true;
                        newProjectCompany[projectId] = {...newProjectCompany[projectId], company: [...newProjectCompany[projectId].company].splice(indexCompany, 1)};
                    }
                    const indexCompanyPerson =  newProjectCompany[projectId].person.findIndex(person => person.company === action.company);
                    if(indexCompanyPerson >= 0) {
                        hasChangedCompany = true;
                        const newPerson = [...newProjectCompany[projectId].person];
                        newPerson[indexCompanyPerson] = {...newPerson[indexCompanyPerson], company: null};
                        newProjectCompany[projectId] = {...newProjectCompany[projectId], person: newPerson};
                    }
                }
                if(hasChangedCompany) return newProjectCompany;
                else return state;

            default:
                return state;
        }
    } else return state;
}

export default ProjectsReducer;