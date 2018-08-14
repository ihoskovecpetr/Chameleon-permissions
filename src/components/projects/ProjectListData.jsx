import React, {Fragment} from 'react';
import { Table } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ICON_SORT = 'sort';
const ICON_SORT_UP = 'sort-up';
const ICON_SORT_DOWN = 'sort-down';

export default class ProjectListData extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            sortName: 0,
            sortStatus: 0,
            sortManager: 0
        };
        this.handleSortName = this.handleSortName.bind(this);
        this.handleSortManager = this.handleSortManager.bind(this);
        this.handleSortStatus = this.handleSortStatus.bind(this);
    }

    render() {
        const {projects, users} = this.props;
        return (
            <Fragment>
                <Table className={'table-header'} borderless={true}>
                    <thead>
                        <tr>
                            <th className={'projects-name'}><FontAwesomeIcon onClick={this.handleSortName} className={`sort-icon${this.state.sortName === 0 ? ' not-set' : ''}`} icon={this.state.sortName === 1 ? ICON_SORT_DOWN : this.state.sortName === 2 ? ICON_SORT_UP : ICON_SORT}/>{'Project Name'}</th>
                            <th className={'projects-manager'}><FontAwesomeIcon onClick={this.handleSortManager} className={`sort-icon${this.state.sortManager === 0 ? ' not-set' : ''}`} icon={this.state.sortManager === 1 ? ICON_SORT_DOWN : this.state.sortManager === 2 ? ICON_SORT_UP : ICON_SORT}/>{'Project Manager'}</th>
                            <th className={'projects-status'}><FontAwesomeIcon onClick={this.handleSortStatus} className={`sort-icon${this.state.sortStatus === 0 ? ' not-set' : ''}`} icon={this.state.sortStatus === 1 ? ICON_SORT_DOWN : this.state.sortStatus === 2 ? ICON_SORT_UP : ICON_SORT}/>{'Status'}</th>
                        </tr>
                    </thead>
                </Table>
                <Scrollbars autoHide={true} autoHideTimeout={800} autoHideDuration={200}>
                    <Table className={'table-body'}>
                        <tbody style={{borderBottom: '1px solid #dee2e6'}}>
                        {Object.keys(projects).map(projectId => <tr onClick = {() => this.props.edit(projectId)} key={projectId}>
                            <td className={'projects-name'}>{projects[projectId].name}</td>
                            <td className={'projects-manager'}>{this.getManager(projects[projectId], users)}</td>
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
        if(sort > 0) this.setState({sortName: sort, sortManager: 0, sortStatus: 0});
        else this.setState({sortName: sort});
    }

    handleSortManager() {
        let sort = this.state.sortManager + 1;
        if(sort > 2) sort = 0;
        if(sort > 0) this.setState({sortName: 0, sortManager: sort, sortStatus: 0});
        else this.setState({sortManager: sort});
    }

    handleSortStatus() {
        let sort = this.state.sortStatus + 1;
        if(sort > 2) sort = 0;
        if(sort > 0) this.setState({sortName: 0, sortManager: 0, sortStatus: sort});
        else this.setState({sortStatus: sort});
    }

    getManager(project, users) {
        if(!project || !project.team) return '---';
        const manager = project.team.find(person => users[person.id] && users[person.id].role.indexOf('manager') <= 0);
        if(manager) return users[manager.id].name;
        else return '---';
    }
}