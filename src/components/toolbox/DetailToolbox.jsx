import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as Icons from "../../constants/Icons";
import React, {Fragment} from "react";

export default class PersonDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            removeArmed: false,
        };
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    render() {
        const {id, label} = this.props;
        return (
            <div className={'app-toolbox'}>
                <div className={'inner-container'}>
                    <div className={'toolbox-group'}>
                        <div onClick={this.close} className={'tool-box-button'}>{this.props.editable ? 'Close' : 'Return'}</div>
                        {this.props.editable || true ? <div onClick={this.edit} className={`tool-box-button orange`}>{'Edit'}</div> : null}
                        <div onClick={this.addToBox} className={`tool-box-button blue`}>
                            <FontAwesomeIcon icon={Icons.ICON_BOX_ARROW}/>
                            <FontAwesomeIcon icon={Icons.ICON_BOX}/>
                        </div>
                        {this.props.editable ?
                            <Fragment>
                                <div onClick={!this.state.removeArmed ? undefined : this.remove} className={`tool-box-button remove red${!this.state.removeArmed ? ' disabled' : ''}`}>{`Remove ${label}`}</div>
                                <FontAwesomeIcon className={`tool-box-checkbox`} onClick={this.handleRemoveArmed} icon={this.state.removeArmed ? Icons.ICON_CHECKBOX_CHECKED : Icons.ICON_CHECKBOX_UNCHECKED} style={{cursor: 'pointer'}}/>
                            </Fragment>
                        : null}
                    </div>
                </div>
                {id ? <div className={'inner-container left-auto'}><div className={'toolbox-id'}>{id}</div></div> : null}
            </div>
        );
    }
    // *****************************************************************************************************************
    // CLOSE, EDIT, REMOVE
    // *****************************************************************************************************************
    close = () => {
        this.props.returnToPreviousView();
    };

    edit = () => {
        if(this.props.editable || true) this.props.edit(this.props.selected);
    };

    remove = () => {
        if(this.props.editable) this.props.remove();
        this.close();
    };

    // *****************************************************************************************************************
    // HELPERS
    // *****************************************************************************************************************
    handleRemoveArmed = () => {
        this.setState({removeArmed: !this.state.removeArmed})
    };

    addToBox = () => {
        this.props.addToBox(this.props.selected);
    };

    handleKeyDown = event => {
        switch(event.which) {
            case 27: //ESC
                this.close();
                break;
            case 81: // 'q'
                if(event.ctrlKey) this.close();
                break;
            case 69: // 'e'
                if(event.ctrlKey) this.edit();
                break;
            case 66: // 'b'
                if(event.ctrlKey) this.addToBox();
                break;
        }
    }
}