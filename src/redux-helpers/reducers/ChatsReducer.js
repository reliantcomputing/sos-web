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
            return state.map((_item, index) => {
                if (_item.id !== action.payload.chatId) {
                    // This isn't the _item we care about - keep it as-is
                    return _item;
                }
                return {
                    ..._item,
                    ..._item.messages.push(action.payload),
                };
            });
        default:
            return state;
    }
};
