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
        const {id, label, dataChanged, selected, validation, saveDisabled} = this.props;
        return (
            <div className={'app-toolbox'}>
                <div className={'inner-container'}>
                    <div className={'toolbox-group'}>
                        <div onClick={this.close} className={`tool-box-button${dataChanged ? ' red' : ''}`}>{dataChanged ? 'Cancel' : 'Close'}</div>
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
        this.props.returnToPreviousView();
    };

    save = () => {
        this.props.save();
    };

    addFromBox = () => {
        if(this.props.addFromBox) this.props.addFromBox();
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

    handleKeyDown = event => {
        switch(event.which) {
            case 27: //ESC
                if(!this.props.dataChanged) this.close();
                break;
            case 81: // 'q'
                if(event.ctrlKey && !this.props.dataChanged) this.close();
                break;
            case 83: // 's'
                if(!this.props.saveDisabled) this.save();
                break;
        }
    }
}