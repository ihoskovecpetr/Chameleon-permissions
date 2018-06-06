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
                {this.props.projects.map(project => <div onClick = {() => this.props.updateProject({id: project.id, value: project.value + 1})} key={project.id}>{project.value}</div>)}
            </div>
        )
    }
}