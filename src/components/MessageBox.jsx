import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class MessageBox extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            timer: null,
            message: null
        };
    }

    static getDerivedStateFromProps(props, state) {
        if(props.message !== state.message) {
            if(state.timer) clearTimeout(state.timer);
            const timer = props.message && props.message.timeout ? setTimeout(props.close, props.message.timeout) : null;
            return {isOpen: !!props.message, timer: timer, message: props.message}
        }
        return null;
    }

    render() {
        return (
            <div className={`app-message-box ${this.state.message ? this.state.message.type ? this.state.message.type : '' : 'hidden'}`}>
                <FontAwesomeIcon onClick={this.props.close} className={'close-button'} icon={'times'} fixedWidth/>
                <span>{this.state.message ? this.state.message.text ? this.state.message.text : this.state.message : '- - -'}</span>
            </div>
        )
    }
}
