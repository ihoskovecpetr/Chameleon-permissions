import React, {Fragment} from 'react';
import { Table } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as Icons from '../../constants/Icons';

export default class Box extends React.PureComponent {

    render() {
        const {projects, persons, companies, box} = this.props;

        return (
            <div className={'app-body'}>
                <div className={'app-toolbox'}>
                    <div className={'inner-container'}>
                        <div className={'toolbox-group'}>
                            <div onClick={box.length > 0 ? this.props.emptyBox : undefined} className={`tool-box-button red${box.length > 0 ? '' : ' disabled'}`}><FontAwesomeIcon icon={Icons.ICON_BOX_REMOVE}/>{'Empty Box'}</div>
                        </div>
                    </div>
                </div>
                <Scrollbars autoHide={true} autoHideTimeout={800} autoHideDuration={200}>
                    <Table className={'table-body'}>
                        <tbody style={{borderBottom: '1px solid #dee2e6'}}>
                        {box.map(id => {
                            let type = 'Unknown';
                            let object = {};
                            if(projects[id]) {
                                type = 'Project';
                                object = projects[id];
                            }
                            else if(persons[id]) {
                                type = 'Person';
                                object = persons[id];
                            }
                            else if(companies[id]) {
                                type = 'Company';
                                object = companies[id];
                            }
                            return (
                            <tr key={id} style={{cursor: 'default'}}>
                                <td className={'projects-name'}><FontAwesomeIcon style={{cursor: 'pointer', marginRight: '0.5rem'}} onClick={() => this.remove(id)} icon={Icons.ICON_BOX_REMOVE}/>{`${type} | Name: ${object.name}`}</td>
                            </tr>)
                        })}
                        </tbody>
                    </Table>
                </Scrollbars>
            </div>
        )
    }

    detail = id => {

    };

    remove = id => {
        this.props.remove(id);
    };
}