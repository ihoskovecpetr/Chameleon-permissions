import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Toolbox from '../toolbox/DetailToolbox';
import {TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT, TABLE_SCROLLBARS_AUTO_HIDE_DURATION} from '../../constants/Constatnts';
import * as CompanyBusiness from '../../constants/CompanyBusiness';
import ContactElement from '../element/ContactElement';

export default class CompanyDetail extends React.PureComponent {
    render() {
        const {selected, companies} = this.props;
        const company = companies[selected] ? companies[selected] : {};

        const name = company.name ? company.name : '';
        const business = company.business ? company.business.map(business => CompanyBusiness[business] ? CompanyBusiness[business].label : `<${business()}>`)  : [];
        const contact = company.contact ? company.contact : [];

        return (
            <div className={'app-body'}>
                <Toolbox
                    returnToPreviousView = {this.props.returnToPreviousView}
                    edit = {this.props.edit}
                    remove = {this.props.remove}
                    addToBox = {this.props.addToBox}
                    selected = {this.props.selected}
                    label = {'Company'}
                    isNext={this.props.isNext}
                />
                <Scrollbars autoHide={true} autoHideTimeout={TABLE_SCROLLBARS_AUTO_HIDE_TIMEOUT} autoHideDuration={TABLE_SCROLLBARS_AUTO_HIDE_DURATION}>
                    <div className={'detail-body'}>
                        <div className={'detail-row'}>
                            <div className={'detail-group size-5'}>
                                <div className={`detail-label`}>{'Company name:'}</div>
                                <div className={`detail-value selectable`}>{name}</div>
                            </div>
                            <div className={'detail-group size-7'}>
                                <div className={`detail-label`}>{'Profession:'}</div>
                                <div className={`detail-value group wrap`}>
                                    {business.map((business, i) => <div key={i} className={'value-item comma'}>{business}</div> )}
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