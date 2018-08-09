import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Col,  Row} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';

import * as ProjectStatus from '../constants/ProjectStatus';

const Fragment = React.Fragment;

const ICON_REMOVE = 'trash';
const ICON_CHECKBOX_CHECKED = ['far','check-square'];
const ICON_CHECKBOX_UNCHECKED = ['far', 'square'];

const statusOptions = Object.keys(ProjectStatus).map(key => {return {value: ProjectStatus[key], label: ProjectStatus[key]}});
const statusSelectStyles = {
    control: (base) => ({...base, width: '10rem', height: '2rem', minHeight: '2rem'}),
    menu: (base) => ({...base, width: '10rem', marginTop: 0}),
    menuList: (base) => ({...base, padding: 0}),
    option: (base, state) => ({...base, paddingTop: '0.1rem', paddingBottom: '0.1rem'}),
    container: (base) => {console.log(base); return base}}
;

export default class ProjectEditModal extends React.PureComponent {
    constructor(props) {
        super(props);
        if(sessionStorage.projectEdit) {
            this.state = JSON.parse(sessionStorage.projectEdit)
        } else {
            this.state = {
                _id: this.props.project && this.props.project._id ? this.props.project._id : null,
                name: this.props.project && this.props.project._id ? this.props.project.name : '',
                status: this.props.project && this.props.project._id ? this.props.project.status : ProjectStatus.PREBID,
                projectId: this.props.project && this.props.project._id ? this.props.project.projectId : null,
                removeAllowed: false
            };
        }

        this.handleRemoveAllowed = this.handleRemoveAllowed.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.hasBeenChanged = this.hasBeenChanged.bind(this);
        this.save = this.save.bind(this);
        this.remove = this.remove.bind(this);
    }

    render() {
        const nameIsValid = this.state.name && this.state.name.trim() && this.props.isNameUnique(this.state._id, this.state.name);
        const editMode = !!this.state._id;
        return (
                <Modal isOpen={!!this.props.project} centered={true} size={'lg'} fade={false}>
                    <ModalHeader toggle={this.props.close}>{editMode ? `Edit Project: ${this.props.project.name}` : `Create New Project`}</ModalHeader>
                    <ModalBody style={{whiteSpace: 'pre'}}>
                        <Row>
                            <Col sm={12} md={7}>
                                <Input onChange={this.handleNameChange} value={this.state.name} style={{backgroundColor: nameIsValid ? 'inherit' : '#ffe3e4'}}/>
                            </Col>
                            <Col  sm={12} md={3}>
                                <Select
                                    id={`user-access`}
                                    options={statusOptions}
                                    value={{value: this.state.status, label: this.state.status}}
                                    onChange={this.handleStatusChange}
                                    isSearchable={false}
                                    //styles={statusSelectStyles}
                                />
                            </Col>
                            <Col sm={0} md={2}>
                                <Input value={this.state.projectId ? this.state.projectId : '-----'} disabled style={{fontSize: '0.8rem'}}/>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter style={{justifyContent: 'flex-start'}}>
                        {editMode
                         ?  <Fragment>
                                <Button disabled={!this.state.removeAllowed} color="danger" onClick={this.remove}><FontAwesomeIcon icon={ICON_REMOVE} style={{marginRight: '0.4rem'}}/>{'Remove'}</Button>
                                <FontAwesomeIcon onClick={this.handleRemoveAllowed} icon={this.state.removeAllowed ? ICON_CHECKBOX_CHECKED : ICON_CHECKBOX_UNCHECKED} style={{marginLeft: '0.8rem', cursor: 'pointer'}}/>
                            </Fragment>
                         : null}
                        <Button color="primary" style={{marginLeft: 'auto'}} disabled={!nameIsValid || !this.hasBeenChanged()} onClick={this.save}>{editMode ? 'Save' : 'Create'}</Button>{' '}
                        <Button color="secondary" onClick={this.props.close}>{'Cancel'}</Button>
                    </ModalFooter>
                </Modal>
        );
    }

    handleRemoveAllowed() {
        this.setState({removeAllowed: !this.state.removeAllowed})
    }

    handleNameChange(event) {
        this.setState({ name: event.target.value });
        setTimeout(() => sessionStorage.projectEdit = JSON.stringify(this.state), 0);
    };

    handleStatusChange(status) {
        this.setState({ status: status.value });
        setTimeout(() => sessionStorage.projectEdit = JSON.stringify(this.state), 0);
    }

    hasBeenChanged() {
        if(this.props.project) {
            if(this.state.name.trim() !== this.props.project.name) return true;
            if(this.state.status !== this.props.project.status) return true;
        }
        return false;
    }

    save() {
        //TODO trim() strings etc.
        //removeAllowed delete
        const project = {...this.state};
        delete project.removeAllowed;
        project.name = project.name.trim();
        this.props.save(project);
    }

    remove() {
        if(this.state._id) this.props.remove(this.state._id);
    }
}
