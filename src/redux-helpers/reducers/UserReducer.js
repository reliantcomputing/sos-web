import {LOG_OUT, SET_USER} from "../Types";

export const UserReducer = (state = {}, action) => {
    switch (action.type) {
        case SET_USER:
            return action.payload
        case LOG_OUT:
            return {}
        default:
            return state
    }
}
