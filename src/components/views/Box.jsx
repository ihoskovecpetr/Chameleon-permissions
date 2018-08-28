import React, {Fragment} from 'react';
import { Table } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import * as ViewTypes from '../../constants/ViewTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ICON_BOX = 'box';

export default class Box extends React.PureComponent {

    render() {
        const {projects, people, companies, box} = this.props;

        return (
            <div className={'app-body'}>
                <div className={'app-toolbox'}>
                    <div className={'inner-container'}>
                        <div className={'toolbox-group'}>
                            <div onClick={this.close} className={'tool-box-button'}>{'Close'}</div>
                            <div onClick={box.length > 0 ? this.props.emptyBox : undefined} className={`tool-box-button icon box blue${box.length > 0 ? '' : ' disabled'}`}><FontAwesomeIcon icon={ICON_BOX}/></div>
                        </div>
                    </div>
                </div>
                <Scrollbars autoHide={true} autoHideTimeout={800} autoHideDuration={200}>
                    <Table className={'table-body'}>
                        <tbody style={{borderBottom: '1px solid #dee2e6'}}>
                        {box.map(id => <tr key={id}>
                            <td className={'projects-name'}><FontAwesomeIcon style={{cursor: 'ponter'}} onClick={() => this.removeFromBox(id)} icon={"trash"}/>{id}</td>
                        </tr>)}
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