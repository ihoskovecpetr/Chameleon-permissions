import React from 'react';
import moment from 'moment';

export default class AppBody extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className={'app-body'}>
                {this.props.data.map(project => <div key={project}>{project}</div>)}
            </div>
        )
    }
}