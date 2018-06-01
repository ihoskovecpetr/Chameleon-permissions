import React from 'react';
import ReactDOM from 'react-dom';

import AppLayout from './components/AppLayout';

import '@fortawesome/fontawesome-free-solid'
//import '@fortawesome/fontawesome-free-regular'
import './app.scss';

//fontAwesome.library.add(faCoffee, faUser);

ReactDOM.render(<AppLayout/>, document.getElementById('app'));

if (module.hot) {
    module.hot.accept();
}