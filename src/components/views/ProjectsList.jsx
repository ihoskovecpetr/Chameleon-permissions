import React, {Fragment} from 'react';
import { Table } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import * as ViewTypes from '../../constants/ViewTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ICON_SORT = 'sort';
const ICON_SORT_UP = 'sort-up';
const ICON_SORT_DOWN = 'sort-down';

export default class ProjectsList extends React.PureComponent {
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

        this.detail = this.detail.bind(this);
        this.create = this.create.bind(this);
        this.select = this.select.bind(this);
        this.edit = this.edit.bind(this);
    }

    render() {
        const {selectedProject, projects, users} = this.props;
        return (
            <div className={'app-body'}>
                <div className={'app-toolbox'}>
                    <div className={'toolbox-group'}>
                        <FontAwesomeIcon onClick={this.create} className={'tool-box-icon'} icon={'plus-circle'}/>
                        {this.props.selectedProject ? <Fragment>
                            <div onClick={() => this.detail()} style={{marginLeft: '1rem', cursor: 'pointer'}}>{'Detail'}</div>
                            <div onClick={() => this.edit()} style={{marginLeft: '1rem', cursor: 'pointer'}}>{'Edit'}</div>
                        </Fragment> : null}
                    </div>
                    <div className={'toolbox-group clear'}/>
                </div>
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
                            {Object.keys(projects).map(projectId => <tr className={selectedProject === projectId ? 'selected' : ''} onClick = {() => this.select(projectId)} onDoubleClick={event => event.altKey ? this.edit(projectId) : this.detail(projectId)} key={projectId}>
                                <td className={'projects-name'}>{projects[projectId].name}</td>
                                <td className={'projects-manager'}>{this.getManager(projects[projectId], users)}</td>
                                <td className={'projects-status'}>{projects[projectId].status}</td>
                            </tr>)}
                            </tbody>
                        </Table>
                    </Scrollbars>
                </Fragment>
            </div>
        )
    }

    select(project) {
        //if(this.props.selectedProject === project) this.props.selectProject(null);
        //else this.props.selectProject(project);
        this.props.selectProject(project);
    }

    create() {
        this.props.selectProject(null);
        this.props.setView(ViewTypes.PROJECT_DETAIL); //TODO EDIT_PROJECT
    }

    detail(project) {
        if(project) {
            this.props.selectProject(project);
            this.props.setView(ViewTypes.PROJECT_DETAIL); //TODO EDIT_PROJECT
        } else if(this.props.selectedProject) {
            this.props.setView(ViewTypes.PROJECT_DETAIL); //TODO DETAIL_PROJECT
        }
    }

    edit(project) {
        if(project) {
            this.props.selectProject(project);
            this.props.setView(ViewTypes.PROJECT_DETAIL); //TODO EDIT_PROJECT
        } else if(this.props.selectedProject) {
            this.props.setView(ViewTypes.PROJECT_DETAIL); //TODO DETAIL_PROJECT
        }
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