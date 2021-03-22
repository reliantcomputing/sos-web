import {LOAD_CHANNELS} from "../Types";

export const ChannelReducer = (state = {}, action) =>{
    switch (action.type){
        case LOAD_CHANNELS:
            console.log("Payload", action.payload)
            return action.payload
        default:
            return state;
    }
}
