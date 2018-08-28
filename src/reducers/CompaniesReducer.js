import * as ActionTypes from '../constants/ActionTypes';

function CompaniesReducer (state = null, action = null) {
    if(action && action.type) {
        switch(action.type) {
            case ActionTypes.RESET_STORE:
                return {};

            case ActionTypes.SET_DATA:
                if(action.data.companies) return action.data.companies.reduce((object, company) => {object[company._id] = company; return object}, {});
                return state;

            default:
                return state;
        }
    } else return state;
}

export default CompaniesReducer;