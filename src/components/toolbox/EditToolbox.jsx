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
        this.keyboard = [];
        if(props.selected) {
            this.keyboard.push({...KeyboardShortcut.CLOSE, command: this.close});
            //this.keyboard.push({...KeyboardShortcut.CANCEL, command: this.cancel});
            this.keyboard.push({...KeyboardShortcut.SAVE, command: this.save});
        } else {
            this.keyboard.push({...KeyboardShortcut.CANCEL, command: this.cancel});
            this.keyboard.push({...KeyboardShortcut.CREATE, command: this.save});
        }
        if(props.addFromBox) this.keyboard.push({...KeyboardShortcut.ADD_BOX, command: this.addFromBox});
        this.keyboardHints = this.keyboard.map(key => `${key.keys.map(key => key.description).join(', ')}: ${key.name}`).join('\n');
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    render() {
        const {id, label, dataChanged, selected, validation, saveDisabled} = this.props;
        return (
            <div className={'app-toolbox'}>
                <div className={'inner-container'}>
                    <div className={'toolbox-group'}>
                        <div onClick={dataChanged ? this.cancel : this.close} className={`tool-box-button${dataChanged ? ' red' : ''}`}>{dataChanged ? 'Cancel' : 'Close'}</div>
                        <div onClick={saveDisabled ? undefined : this.save} className={`tool-box-button${selected ? ' orange' : ' green'}${saveDisabled ? ' disabled' : ''}`}>{selected ? 'Save' : 'Create'}</div>
                        {this.props.addFromBox ? <div onClick={this.props.box ? this.addFromBox : undefined} className={`tool-box-button blue${!this.props.box  ? ' disabled' : ''}`}><FontAwesomeIcon icon={Icons.ICON_BOX}/><FontAwesomeIcon icon={Icons.ICON_BOX_ARROW}/></div> : null}
                        <div className={'tool-box-validation'}>
                            <FontAwesomeIcon className={`tool-box-validation-icon${Object.keys(validation).length > 0 ? ' active' : ''}`} icon={Icons.ICON_EDITOR_VALIDATION}/>
                            <div className={'tool-box-validation-container'}>
                                {Object.keys(validation).map(validationField => <div key={validationField}>{`${validation[validationField].field}: ${validation[validationField].status}`}</div>)}
                            </div>
                        </div>
                        {!selected ? null :
                            <Fragment>
                                <div onClick={!this.state.removeArmed ? undefined : this.remove} className={`tool-box-button remove red${!this.state.removeArmed ? ' disabled' : ''}`}>{`Remove ${label}`}</div>
                                <FontAwesomeIcon className={`tool-box-checkbox`} onClick={this.handleRemoveArmed} icon={this.state.removeArmed ? Icons.ICON_CHECKBOX_CHECKED : Icons.ICON_CHECKBOX_UNCHECKED} style={{cursor: 'pointer'}}/>
                            </Fragment>
                        }
                        <Tooltip placement={"bottomLeft"} overlay={<span>{this.keyboardHints}</span>}>
                            <div className={'icon-keyboard'}><FontAwesomeIcon icon={Icons.ICON_KEYBOARD_SHORTCUTS}/></div>
                        </Tooltip>
                    </div>
                </div>
                <div className={'inner-container left-auto'}>
                    {selected && id ? <div className={'toolbox-id'}>{id}</div> : null}
                </div>
            </div>
        );
    }
    // *****************************************************************************************************************
    // CLOSE, EDIT, REMOVE
    // *****************************************************************************************************************
    close = () => {
        if(!this.props.dataChanged) this.props.returnToPreviousView();
    };

    cancel = () => {
        this.props.returnToPreviousView();
    };

    save = () => {
        if(!this.props.saveDisabled) this.props.save();
    };

    addFromBox = () => {
        if(this.props.addFromBox) this.props.addFromBox();
    };

    remove = () => {
        if(this.props.editable) this.props.remove();
        //this.cancel();
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