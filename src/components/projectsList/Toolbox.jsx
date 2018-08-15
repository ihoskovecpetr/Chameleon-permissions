import React, {Fragment} from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Toolbox extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className={'app-toolbox'}>
                <div className={'toolbox-group'}>
                    <FontAwesomeIcon onClick={this.props.create} className={'tool-box-icon'} icon={'plus-circle'}/>
                    {this.props.selectedProject ? <Fragment>
                        <div onClick={() => this.props.detail()} style={{marginLeft: '1rem', cursor: 'pointer'}}>{'Detail'}</div>
                        <div onClick={() => this.props.edit()} style={{marginLeft: '1rem', cursor: 'pointer'}}>{'Edit'}</div>
                    </Fragment> : null}
                </div>
                <div className={'toolbox-group clear'}/>
            </div>
        )
    }
}