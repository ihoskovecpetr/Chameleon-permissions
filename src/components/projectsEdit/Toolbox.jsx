import React, {Fragment} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ICON_REMOVE = 'trash';
const ICON_CHECKBOX_CHECKED = ['far','check-square'];
const ICON_CHECKBOX_UNCHECKED = ['far', 'square'];

export default class Toolbox extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            removeArmed: false
        };
        this.handleRemoveArmed = this.handleRemoveArmed.bind(this);
    }

    render() {
        return (
            <div className={'app-toolbox'}>
                <div className={'toolbox-group'}>
                    <div onClick={this.props.close} className={'tool-box-button'}>{'Cancel'}</div>
                    <div onClick={this.props.saveDisabled ? undefined : this.props.save} className={`tool-box-button green${this.props.saveDisabled ? ' disabled' : ''}`}>{this.props.create ? 'Create' : 'Save'}</div>
                    {this.props.create ? null :
                        <Fragment>
                            <div onClick={!this.state.removeArmed ? undefined : this.props.remove} className={`tool-box-button remove red${!this.state.removeArmed ? ' disabled' : ''}`}>{'Remove Project'}</div>
                            <FontAwesomeIcon className={`tool-box-checkbox`} onClick={this.handleRemoveArmed} icon={this.state.removeArmed ? ICON_CHECKBOX_CHECKED : ICON_CHECKBOX_UNCHECKED} style={{cursor: 'pointer'}}/>
                        </Fragment>
                    }
                </div>
                {this.props.id ? <div className={'toolbox-id'}>{this.props.id}</div> : null}
                <div className={'toolbox-group clear'}/>
            </div>
        )
    }

    handleRemoveArmed() {
        this.setState({removeArmed: !this.state.removeArmed})
    }
}