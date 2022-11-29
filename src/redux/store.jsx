import {  createStore, combineReducers } from 'redux';
import { CollApsedReducer } from './reducers/CollApsedReducer';
import {LoadingReducer} from './reducers/LoadingReducer'
const reducer = combineReducers({
    CollApsedReducer,
    LoadingReducer
})
const store = createStore(reducer);
export default store;