const Constants = {
    BASE_URL: "http://192.168.43.10:4000/",
    SOCKET_URL: "ws://192.168.43.10:4000/socket",
    ORDER_STATUS: {
        REJECTED: "REJECTED",
        PLACED: "PLACED",
        APPROVED: "APPROVED",
        PAID: "PAID",
    },
    UPDATE: {
        ORDER_ADDED: "ORDER_ADDED",
        ORDER_LOADED: "ORDER_LOADED",
    },
    ROLES: {
        MANAGER: "MANAGER",
        WAITER: "WAITER",
        KITCHEN: "KITCHEN",
    },
};

export default Constants;
