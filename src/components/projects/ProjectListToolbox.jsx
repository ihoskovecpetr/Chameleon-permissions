import React from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class ProjectListToolbox extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className={'app-toolbox'}>
                <div className={'toolbox-group'}>
                    <FontAwesomeIcon onClick={this.props.create} className={'tool-box-icon'} icon={'plus-circle'}/>
                </div>
                <div className={'toolbox-group clear'}/>
            </div>
        )
    }
}