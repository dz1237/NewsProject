import {  createStore, combineReducers } from 'redux';
import { CollApsedReducer } from './reducers/CollApsedReducer';
const reducer = combineReducers({
    CollApsedReducer
})
const store = createStore(reducer);

export default store;