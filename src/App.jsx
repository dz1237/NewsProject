import React from 'react';
import { Provider } from 'react-redux'
import IndexRouter from './router/indexRouter';
import store from './redux/store'
export default function App() {
  return (
    <Provider store={store}>
      <IndexRouter></IndexRouter>
    </Provider>
      
 )
}
