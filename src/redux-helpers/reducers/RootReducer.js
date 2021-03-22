import { combineReducers } from "redux";
import { OrdersReducer } from "./OrdersReducer";
import { UserReducer } from "./UserReducer";
import { ChannelReducer } from "./ChannelReducer";
import { UpdateReducer } from "./UpdateReducer";

export const reducers = combineReducers({
    orders: OrdersReducer,
    user: UserReducer,
    channels: ChannelReducer,
    update: UpdateReducer,
});
