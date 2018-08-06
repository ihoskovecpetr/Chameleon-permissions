import React from 'react';
import { Table } from 'reactstrap';

import tableLayout from '../constants/DataLayout.json';

export default class DataHeader extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div className={'data-header'}>
                <Table borderless={true}>
                    <thead>
                        <tr>
                            {tableLayout[this.props.layout ? this.props.layout : 'full'].map((column, i) => <th key={i} className={column.className}>{column.label}</th>)}
                        </tr>
                    </thead>
                </Table>
            </div>
        )
    }
}