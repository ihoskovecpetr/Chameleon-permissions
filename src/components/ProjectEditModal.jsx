import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class ProjectEditModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }



    render() {
        return (
                <Modal isOpen={this.props.isOpen} centered={true} size={'lg'} fade={false}>
                    <ModalHeader toggle={this.props.close}>{`Edit Project: ${name}`}</ModalHeader>
                    <ModalBody style={{whiteSpace: 'pre'}}>
                        {JSON.stringify(this.props.project, null, 2)}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.props.save(this.props.project)}>Save</Button>{' '}
                        <Button color="secondary" onClick={this.props.close}>Cancel</Button>
                    </ModalFooter>
                </Modal>
        );
    }
}
