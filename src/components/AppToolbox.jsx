import React from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class AppToolbox extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div style={{display: this.props.isOpen ? '' : 'none'}} className={'app-toolbox'}>
                <div onClick={() => this.props.createProject({value: 8888})} className={'toolbox-group'}>
                {'Some tools 1 here'}
                </div>
                <div className={'toolbox-group'}>
                    {'Some tools 2 here'}
                </div>
                <div className={'toolbox-group'}>
                    {'Some tools 3 here'}
                </div>
                <div className={'toolbox-group clear'}/>
            </div>
        )
    }
}