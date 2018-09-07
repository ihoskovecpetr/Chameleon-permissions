import React, {Fragment} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Scrollbars } from 'react-custom-scrollbars';
import { Input } from 'reactstrap';

import * as Icons from '../../constants/Icons';

export default class PersonDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            removeArmed: false,
        };
        this.editable = false;
    }

    render() {
        const {selectedPerson, persons} = this.props;

        const person = persons[selectedPerson] ? persons[selectedPerson] : {};


        return (
            <div className={'app-body'}>
                <div className={'app-toolbox'}>
                    <div className={'inner-container'}>
                        <div className={'toolbox-group'}>
                            <div onClick={this.close} className={'tool-box-button'}>{'Close'}</div>
                            {!this.props.editPerson ? null :
                                <div onClick={this.edit} className={`tool-box-button`}>{'Edit'}</div>
                            }
                            <div onClick={this.addToBox} className={`tool-box-button blue`}><FontAwesomeIcon icon={Icons.ICON_BOX_ARROW_RIGHT}/><FontAwesomeIcon icon={Icons.ICON_BOX}/></div>
                            {!this.props.removePerson ? null :
                                <Fragment>
                                    <div onClick={!this.state.removeArmed ? undefined : this.remove} className={`tool-box-button remove red${!this.state.removeArmed ? ' disabled' : ''}`}>{'Remove Person'}</div>
                                    <FontAwesomeIcon className={`tool-box-checkbox`} onClick={this.handleRemoveArmed} icon={this.state.removeArmed ? Icons.ICON_CHECKBOX_CHECKED : Icons.ICON_CHECKBOX_UNCHECKED} style={{cursor: 'pointer'}}/>
                                </Fragment>
                            }
                        </div>
                    </div>
                </div>
                <Scrollbars autoHide={true} autoHideTimeout={800} autoHideDuration={200}>
                    <div className={'detail-body'}>
                        <div className={'detail-row'}>
                            <div className={'detail-group size-7'}>
                                <div className={`detail-label`}>{'Person name:'}</div>
                                <Input disabled={true} className={`detail-input readonly`} value={person.name}/>
                            </div>
                        </div>
                    </div>
                </Scrollbars>
            </div>
        )
    }
    // *****************************************************************************************************************
    // CLOSE, EDIT,  REMOVE
    // *****************************************************************************************************************
    close = () => {
        this.props.returnToPreviousView();
    };

    edit = () => {
        this.props.editPerson();
    };

    remove = () => {
        this.props.removePerson();
        this.close();
    };

    // *****************************************************************************************************************
    // HELPERS
    // *****************************************************************************************************************
    handleRemoveArmed = () => {
        this.setState({removeArmed: !this.state.removeArmed})
    };

    addToBox = () => {
        this.props.addToBox(this.props.selectedPerson);
    };

}