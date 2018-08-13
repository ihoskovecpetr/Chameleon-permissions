import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class ProjectDetailToolbox extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className={'app-toolbox'}>
                <div className={'toolbox-group'}>
                    <div onClick={this.props.close} className={'tool-box-button'}>{'Cancel'}</div>
                    <div onClick={this.props.save} className={`tool-box-button green${this.props.saveDisabled ? ' disabled' : ''}`}>{this.props.create ? 'Create' : 'Save'}</div>
                </div>
                {this.props.id ? <div className={'toolbox-id'}>{this.props.id}</div> : null}
                <div className={'toolbox-group clear'}/>
            </div>
        )
    }
}