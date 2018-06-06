import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

export default class MessageBox extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        if(this.props.message) {
            console.log(this.props.message)
            return (
                <div className={`app-message-box ${this.props.message.type}`}>
                    <FontAwesomeIcon onClick={this.props.close} className={'close-button'} icon={'times'} fixedWidth/>
                    <span>{this.props.message.text}</span>
                </div>
            )
        } else {
            return null;
        }
    }
}