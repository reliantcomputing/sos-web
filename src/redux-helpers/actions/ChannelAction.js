import { Socket } from "phoenix";
import Store from "../Store";
import Constants from "../../helpers/constants";
import { ADD_CHATS, ADD_MENU, ADD_MESSAGE, ADD_ORDER, LOAD_CHANNELS, UPDATES, UPDATE_ORDER } from "../Types";

const url = Constants.SOCKET_URL;

const axios = require("axios");

export const joinChannels = (chats, orders, user) => {
    let socket = new Socket(url, { params: {} });
    socket.connect();
    const orderChannel = socket.channel("order", {});

    const chatChannel = socket.channel("chat", {});

    chatChannel.on("create:chat", (payload) => {
        Store.dispatch({
            type: ADD_CHATS,
            payload: payload,
        });
    });

    chatChannel.on("accept:chat", (payload) => {
        Store.dispatch({
            type: ADD_CHATS,
            payload: payload.chat,
        });
        chatChannel.on("send:message:" + payload.chatId, (payload) => {
            console.log(payload);
            Store.dispatch({
                type: ADD_MESSAGE,
                payload,
            });
        });
    });

    orderChannel.on("place:order", (payload) => {
        console.log("Order has been placed.....");
        axios.get(`${Constants.BASE_URL}/api/orders/${payload.id}`).then((res) => {
            console.log("Adding order.............");
            Store.dispatch({
                type: ADD_ORDER,
                payload: res.data.data,
            });
            Store.dispatch({
                type: UPDATES,
                payload: Constants.UPDATE.ORDER_ADDED,
            });
            orderChannel.on(`reject:order:${res.data.data.id}`, (payload) => {
                axios.get(`${Constants.BASE_URL}/api/orders/${payload.id}`).then((res) => {
                    Store.dispatch({
                        type: UPDATE_ORDER,
                        payload: res.data.data,
                    });
                });
            });
            orderChannel.on(`pay:order:${res.data.data.id}`, (payload) => {
                axios.get(`${Constants.BASE_URL}/api/orders/${payload.id}`).then((res) => {
                    Store.dispatch({
                        type: UPDATE_ORDER,
                        payload: res.data.data,
                    });
                });
            });
            orderChannel.on(`approve:order:${res.data.data.id}`, (payload) => {
                axios.get(`${Constants.BASE_URL}/api/orders/${payload.id}`).then((res) => {
                    Store.dispatch({
                        type: UPDATE_ORDER,
                        payload: res.data.data,
                    });
                });
            });
        });
    });

    orderChannel.on(`add:more:items`, (payload) => {
        axios.get(`${Constants.BASE_URL}/api/orders/${payload.id}`).then((res) => {
            Store.dispatch({
                type: UPDATE_ORDER,
                payload: res.data.data,
            });
        });
    });

    orders.forEach((_order) => {
        orderChannel.on(`reject:order:${_order.id}`, (payload) => {
            axios.get(`${Constants.BASE_URL}/api/orders/${payload.id}`).then((res) => {
                Store.dispatch({
                    type: UPDATE_ORDER,
                    payload: res.data.data,
                });
            });
        });
        orderChannel.on(`approve:order:${_order.id}`, (payload) => {
            axios.get(`${Constants.BASE_URL}/api/orders/${payload.id}`).then((res) => {
                Store.dispatch({
                    type: UPDATE_ORDER,
                    payload: res.data.data,
                });
            });
        });
    });

    chatChannel.join();
    orderChannel.join();

    return {
        type: LOAD_CHANNELS,
        payload: { orderChannel, chatChannel },
    };
};
