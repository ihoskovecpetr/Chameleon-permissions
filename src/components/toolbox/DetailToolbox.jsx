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
    render() {
        const {id, label} = this.props;
        return (
            <div className={'app-toolbox'}>
                <div className={'inner-container'}>
                    <div className={'toolbox-group'}>
                        <div onClick={this.close} className={'tool-box-button'}>{this.props.isNext ? 'Return' : 'Close'}</div>
                        {this.props.isNext ? null : <div onClick={this.edit} className={`tool-box-button`}>{'Edit'}</div>}
                        <div onClick={this.addToBox} className={`tool-box-button blue`}>
                            <FontAwesomeIcon icon={Icons.ICON_BOX_ARROW}/>
                            <FontAwesomeIcon icon={Icons.ICON_BOX}/>
                        </div>
                        {this.props.isNext ? null :
                            <Fragment>
                                <div onClick={!this.state.removeArmed ? undefined : this.remove} className={`tool-box-button remove red${!this.state.removeArmed ? ' disabled' : ''}`}>{`Remove ${label}`}</div>
                                <FontAwesomeIcon className={`tool-box-checkbox`} onClick={this.handleRemoveArmed} icon={this.state.removeArmed ? Icons.ICON_CHECKBOX_CHECKED : Icons.ICON_CHECKBOX_UNCHECKED} style={{cursor: 'pointer'}}/>
                            </Fragment>
                        }
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
        if(!this.props.isNext && this.props.edit) this.props.edit();
    };

    remove = () => {
        if(!this.props.isNext && this.props.remove) this.props.remove();
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
}