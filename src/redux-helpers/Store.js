import {createStore} from 'redux';
import {reducers} from "./reducers/RootReducer";

const Store = createStore(reducers)

export default Store
