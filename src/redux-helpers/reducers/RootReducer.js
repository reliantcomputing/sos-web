import { combineReducers } from "redux";
import { OrdersReducer } from "./OrdersReducer";
import { UserReducer } from "./UserReducer";
import { ChannelReducer } from "./ChannelReducer";
import { UpdateReducer } from "./UpdateReducer";
import { ChatsReducer } from "./ChatsReducer";

export const reducers = combineReducers({
    orders: OrdersReducer,
    user: UserReducer,
    channels: ChannelReducer,
    update: UpdateReducer,
    chats: ChatsReducer,
});
