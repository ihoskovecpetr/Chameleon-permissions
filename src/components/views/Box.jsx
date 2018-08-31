import React, {Fragment} from 'react';
import { Table } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import * as ViewTypes from '../../constants/ViewTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ICON_TRASH = 'trash-alt';

export default class Box extends React.PureComponent {

    render() {
        const {projects, people, companies, box} = this.props;

        return (
            <div className={'app-body'}>
                <div className={'app-toolbox'}>
                    <div className={'inner-container'}>
                        <div className={'toolbox-group'}>
                            <div onClick={box.length > 0 ? this.props.emptyBox : undefined} className={`tool-box-button red${box.length > 0 ? '' : ' disabled'}`}><FontAwesomeIcon icon={ICON_TRASH}/>{'Empty Box'}</div>
                        </div>
                    </div>
                </div>
                <Scrollbars autoHide={true} autoHideTimeout={800} autoHideDuration={200}>
                    <Table className={'table-body'}>
                        <tbody style={{borderBottom: '1px solid #dee2e6'}}>
                        {box.map(id => {
                            let type = 'unknown';
                            if(projects[id]) type = 'project';
                            else if(people[id]) type = 'person';
                            else if(companies[id]) type = 'company';
                            return (
                            <tr key={id} style={{cursor: 'default'}}>
                                <td className={'projects-name'}><FontAwesomeIcon style={{cursor: 'pointer', marginRight: '0.5rem'}} onClick={() => this.removeFromBox(id)} icon={ICON_TRASH}/>{`${type} id: ${id}`}</td>
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

    close = () => {

    };

    removeFromBox = id => {
        this.props.removeFromBox(id);
    };
}