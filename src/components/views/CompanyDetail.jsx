import React, {Fragment} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Scrollbars } from 'react-custom-scrollbars';
import { Input } from 'reactstrap';

const ICON_CHECKBOX_CHECKED = ['far','check-square'];
const ICON_CHECKBOX_UNCHECKED = ['far', 'square'];

const ICON_BOX = 'box-open';

export default class CompanyDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            removeArmed: false,
        };
        this.editable = false;
    }

    render() {
        const {selectedCompany, companies} = this.props;

        const company = companies[selectedCompany] ? companies[selectedCompany] : {};


        return (
            <div className={'app-body'}>
                <div className={'app-toolbox'}>
                    <div className={'inner-container'}>
                        <div className={'toolbox-group'}>
                            <div onClick={this.close} className={'tool-box-button'}>{'Close'}</div>
                            {!this.props.editCompany ? null :
                                <div onClick={this.edit} className={`tool-box-button`}>{'Edit'}</div>
                            }
                            <div onClick={this.addToBox} className={`tool-box-button icon box blue`}><FontAwesomeIcon icon={ICON_BOX}/></div>
                            {!this.props.removeCompany ? null :
                                <Fragment>
                                    <div onClick={!this.state.removeArmed ? undefined : this.remove} className={`tool-box-button remove red${!this.state.removeArmed ? ' disabled' : ''}`}>{'Remove Company'}</div>
                                    <FontAwesomeIcon className={`tool-box-checkbox`} onClick={this.handleRemoveArmed} icon={this.state.removeArmed ? ICON_CHECKBOX_CHECKED : ICON_CHECKBOX_UNCHECKED} style={{cursor: 'pointer'}}/>
                                </Fragment>
                            }
                        </div>
                    </div>
                </div>
                <Scrollbars autoHide={true} autoHideTimeout={800} autoHideDuration={200}>
                    <div className={'detail-body'}>
                        <div className={'detail-row'}>
                            <div className={'detail-group size-7'}>
                                <div className={`detail-label`}>{'Company name:'}</div>
                                <Input disabled={true} className={`detail-input readonly`} value={company.name}/>
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
        this.props.editCompany();
    };

    remove = () => {
        this.props.removeCompany();
        this.close();
    };

    // *****************************************************************************************************************
    // HELPERS
    // *****************************************************************************************************************
    handleRemoveArmed = () => {
        this.setState({removeArmed: !this.state.removeArmed})
    };

    addToBox = () => {
        this.props.addToBox(this.props.selectedCompany);
    };

}