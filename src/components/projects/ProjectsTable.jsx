import React, {Fragment} from 'react';
import { Table } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ICON_SORT = 'sort';
const ICON_SORT_UP = 'sort-up';
const ICON_SORT_DOWN = 'sort-down';

export default class ProjectsTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            sortName: 1
        };
        this.handleSortName = this.handleSortName.bind(this);
    }

    render() {
        const {projects} = this.props;
        return (
            <Fragment>
                <Table className={'table-header'} borderless={true}>
                    <thead>
                        <tr>
                            <th className={'projects-name'}><FontAwesomeIcon onClick={this.handleSortName} className={'sort-icon'} icon={this.state.sortName === 1 ? ICON_SORT_UP : this.state.sortName === 2 ? ICON_SORT_DOWN : ICON_SORT}/>{'Project Name'}</th>
                            <th className={'projects-manager'}>{'Project Manager'}</th>
                            <th className={'projects-status'}>{'Status'}</th>
                        </tr>
                    </thead>
                </Table>
                <Scrollbars autoHide={true} autoHideTimeout={800} autoHideDuration={200}>
                    <Table className={'table-body'}>
                        <tbody style={{borderBottom: '1px solid #dee2e6'}}>
                        {Object.keys(projects).map(projectId => <tr onClick = {() => this.props.edit(project)} key={projectId}>
                            <td className={'projects-name'}>{projects[projectId].name}</td>
                            <td className={'projects-manager'}>{projects[projectId].manager}</td>
                            <td className={'projects-status'}>{projects[projectId].status}</td>
                        </tr>)}
                        </tbody>
                    </Table>
                </Scrollbars>
            </Fragment>
        )
    }
    handleSortName() {
        let sort = this.state.sortName + 1;
        if(sort > 2) sort = 0;
        this.setState({sortName: sort});
    }
}