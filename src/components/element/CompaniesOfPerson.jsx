import React from 'react';
import * as CompanyBusiness from '../../constants/CompanyBusiness';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '../../constants/Icons';

export default function CompaniesOfPerson(props) {
    const {companies, members} = props;

    if(members.length > 0) {
        return (
            <div className={'detail-row spacer'}>
                <div className={'detail-group size-12 column'}>
                    <div className={`detail-label column`}>{'Companies of Person:'}</div>
                    <div className={'detail-subject-person'}>
                    {members.map((company, i) => {
                        return (companies[company] ?
                            <div key={i} className={'company'}>
                                <div className={'name clickable'} onClick={() => props.showCompany(company, false, true)}><FontAwesomeIcon className={'prefix-icon'} icon={Icons.ICON_EDITOR_COMPANY}/>{companies[company].name}</div>
                                <div className={'role'}>{companies[company].business.map(business => CompanyBusiness[business] ? CompanyBusiness[business].label : business).join(', ')}</div>
                            </div>
                        : null)}
                    )}
                    </div>
                </div>
            </div>
        )
    } else return null;
}
