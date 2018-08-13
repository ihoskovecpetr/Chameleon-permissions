import React, {Fragment} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Input, Col,  Row } from 'reactstrap';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as ProjectStatus from '../../constants/ProjectStatus';

const statusOptions = Object.keys(ProjectStatus).map(key => {return {value: ProjectStatus[key], label: ProjectStatus[key]}});

export default class ProjectDetailData extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            status: !props.project ? ProjectStatus.PREBID : undefined
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);

        this.sendCurrentProject = this.sendCurrentProject.bind(this);
        this.getCurrentState = this.getCurrentState.bind(this);

    }

    render() {
        const name = this.state.name !== undefined ? this.state.name : !this.props.project ? '' : this.props.projects[this.props.project] ? this.props.projects[this.props.project].name : '';
        const status = this.state.status !== undefined ? this.state.status : this.props.projects[this.props.project] ? this.props.projects[this.props.project].status : null;
        console.log(this.props.validation)
        return (
            <Scrollbars autoHide={true} autoHideTimeout={800} autoHideDuration={200}>
                <div className={'detail-body'}>
                    <Row>
                        <Col sm={12} md={6} lg={4}>
                            <Input onChange={this.handleNameChange} value={name} style={{backgroundColor: this.props.validation.name ? '#ffaaaa' : '#eeeeee'}}/>
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                            <Select
                                options={statusOptions}
                                value={{value: status, label: status}}
                                onChange={this.handleStatusChange}
                                isSearchable={false}
                                //styles={statusSelectStyles}
                            />
                        </Col>
                    </Row>
                </div>
            </Scrollbars>
        )
    }

    handleNameChange(event) {
        if(!this.props.project) this.setState({ name: event.target.value }, this.sendCurrentProject);
        else {
            if(event.target.value !== this.props.projects[this.props.project].name) this.setState({ name: event.target.value }, this.sendCurrentProject);
            else this.setState({ name: undefined }, this.sendCurrentProject);
        }
    }

    handleStatusChange(option) {
        if(!this.props.project) this.setState({ status: option.value }, this.sendCurrentProject);
        else {
            if(option.value !== this.props.projects[this.props.project].status) this.setState({ status: option.value }, this.sendCurrentProject);
            else this.setState({ status: undefined }, this.sendCurrentProject);
        }
    }

    sendCurrentProject() {
        this.props.currentProject(this.getCurrentState());
    }

    getCurrentState() {
        const state = {...this.state};
        for(const key of Object.keys(state)) if(state[key] === undefined) delete state[key];
        return state;
    }
}