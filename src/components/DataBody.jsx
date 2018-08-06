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
        return (
            <Scrollbars
                className={'data-body'}
                autoHide={true}
                autoHideTimeout={800}
                autoHideDuration={200}
            >
                <Table>
                    <tbody>
                    {this.props.projects.map(project => <tr onClick = {() => this.props.edit(project.id)} key={project.projectId}>
                        {tableLayout[this.props.layout ? this.props.layout : 'full'].map((column, i) => <td key={i} className={column.className}>{project[column.field]}</td>)}
                    </tr>)}
                    </tbody>
                </Table>
            </Scrollbars>
        )
    }
}