import React from 'react';
import ReactDOM from 'react-dom';

const title = 'Minimal App!++';

ReactDOM.render(
    <div>{title}</div>,
    document.getElementById('app')
);

module.hot.accept();