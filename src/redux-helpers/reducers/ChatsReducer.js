import { Message } from "react-chat-ui";
import { ADD_CHATS, ADD_MESSAGE, CREATE_PENDING_CHAT } from "../Types";

export const ChatsReducer = (state = [], action) => {
    switch (action.type) {
        case ADD_CHATS:
            let _items;
            if (action.payload.id) {
                _items = state.map((item, index) => {
                    if (item.sit_number === action.payload.sit_number) {
                        return action.payload;
                    } else {
                        return item;
                    }
                });
            } else {
                _items = [...state, action.payload];
            }
            return _items;
        case ADD_MESSAGE:
            console.log("ADDING MESSAGE", action.payload);
            console.log(state);
            const _message = new Message({
                id: action.payload.user._id,
                message: action.payload.text,
            });
            return state.map((_item, index) => {
                console.log("Running the map", _item);
                if (_item.id != action.payload.chatId) {
                    console.log("Not the right one find a chat");
                    // This isn't the _item we care about - keep it as-is
                    return _item;
                }
                console.log("The right one a chat");
                // return {
                //     ..._item,
                //     ..._item.messages.unshift(_message),
                // };
                return {
                    ..._item,
                    messages: new Array(_message),
                };
            });
        default:
            return state;
    }
};
