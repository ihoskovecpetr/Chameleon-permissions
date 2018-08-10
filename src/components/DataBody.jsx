import React from 'react';
import { Table } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';

import tableLayout from '../constants/DataLayout.json';

export default class DataBody extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {projects} = this.props;
        return (
            <Scrollbars
                className={'data-body'}
                autoHide={true}
                autoHideTimeout={800}
                autoHideDuration={200}
            >
                <Table>
                    <tbody style={{borderBottom: '1px solid #dee2e6'}}>
                    {Object.keys(projects).map(projectId => <tr onClick = {() => this.props.edit(project)} key={projectId}>
                        {tableLayout[this.props.layout ? this.props.layout : 'full'].map((column, i) => <td key={i} className={column.className}>{projects[projectId][column.field]}</td>)}
                    </tr>)}
                    </tbody>
                </Table>
            </Scrollbars>
        )
    }
}