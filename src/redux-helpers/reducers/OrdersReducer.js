import { ADD_ORDER, LOAD_ORDERS, UPDATE_ORDER } from "../Types";

export const OrdersReducer = (state = [], action) => {
    switch (action.type) {
        case LOAD_ORDERS:
            return action.payload;
        case UPDATE_ORDER:
            console.log("updating order..............................");
            const _orders = state.map((order, index) => {
                if (order.id === action.payload.id) {
                    return action.payload;
                }
                return order;
            });
            return _orders;
        case ADD_ORDER:
            console.log("Adding order therapy");
            return [...state, action.payload];
        default:
            return state;
    }
};
