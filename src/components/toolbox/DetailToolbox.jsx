import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as Icons from "../../constants/Icons";
import React, {Fragment} from "react";
import Tooltip from "rc-tooltip";
import * as KeyboardShortcut from "../../constants/KeyboardShortcuts";

export default class PersonDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            removeArmed: false,
        };
        this.keyboard = [
            {...KeyboardShortcut.CLOSE, command: this.close},
            {...KeyboardShortcut.EDIT, command: this.edit},
            {...KeyboardShortcut.ADD_BOX, command: this.addToBox}
        ];
        this.keyboardHints = this.keyboard.map(key => `${key.keys.map(key => key.description).join(', ')}: ${key.name}`).join('\n');
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
                        <Tooltip placement={"bottomLeft"} overlay={<span>{this.keyboardHints}</span>}>
                            <div className={'icon-keyboard'}><FontAwesomeIcon icon={Icons.ICON_KEYBOARD_SHORTCUTS}/></div>
                        </Tooltip>
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

    addToBox = () => {
        this.props.addToBox(this.props.selected);
    };
    // *****************************************************************************************************************
    // HELPERS
    // *****************************************************************************************************************
    handleRemoveArmed = () => {
        this.setState({removeArmed: !this.state.removeArmed})
    };

    handleKeyDown = event => {
        for(const shortcut of this.keyboard) {
            for(const key of shortcut.keys) if(event.which === key.keyCode && key.ctrl === event.ctrlKey && key.alt === event.altKey && key.shift === event.shiftKey) shortcut.command();
        }
    }
}