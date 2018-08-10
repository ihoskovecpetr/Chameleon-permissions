function PeopleReducer (state = [], action = null) {
    if(action && action.type) {
        switch(action.type) {
            case 'AAAA':
                return state;
            default:
                return state;
        }
    } else return state;
}

export default PeopleReducer;