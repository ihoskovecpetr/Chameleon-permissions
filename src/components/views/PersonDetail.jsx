import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Toolbox from '../toolbox/DetailToolbox';
import {TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT, TABLE_SCROLLBARS_AUTO_HIDE_DURATION} from '../../constants/Constatnts';
import * as PersonProfession from '../../constants/PersonProfession';
import ContactElement from '../element/ContactElement';

export default class PersonDetail extends React.PureComponent {
    render() {
        const {selected, persons} = this.props;
        const person = persons[selected] ? persons[selected] : {};

        const name = person.name ? person.name : '';
        const profession = person.profession ? person.profession.map(profession => PersonProfession[profession] ? PersonProfession[profession].label : `<${profession()}>`)  : [];
        const contact = person.contact ? person.contact : [];

        return (
            <div className={'app-body'}>
                <Toolbox
                    returnToPreviousView = {this.props.returnToPreviousView}
                    edit = {this.props.edit}
                    remove = {this.props.remove}
                    addToBox = {this.props.addToBox}
                    selected = {this.props.selected}
                    label = {'Person'}
                    isNext={this.props.isNext}
                />
                <Scrollbars autoHide={true} autoHideTimeout={TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT} autoHideDuration={TABLE_SCROLLBARS_AUTO_HIDE_DURATION}>
                    <div className={'detail-body'}>
                        <div className={'detail-row'}>
                            <div className={'detail-group size-5'}>
                                <div className={`detail-label`}>{'Person name:'}</div>
                                <div className={`detail-value selectable`}>{name}</div>
                            </div>
                            <div className={'detail-group size-7'}>
                                <div className={`detail-label`}>{'Profession:'}</div>
                                <div className={`detail-value group wrap`}>
                                    {profession.map((profession, i) => <div key={i} className={'value-item comma'}>{profession}</div> )}
                                </div>
                            </div>
                        </div>
                        <div className={'detail-row spacer'}>
                            <div className={'detail-group size-12'}>
                                <div className={`detail-label`}>{'Contacts:'}</div>
                                <div className={'detail-value group wrap'}>
                                    {contact.map((contactItem, i) => <div key={i} className={'value-item selectable'}><ContactElement contact={contactItem}/></div>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </Scrollbars>
            </div>
        )
    }
}