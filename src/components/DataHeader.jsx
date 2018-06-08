import React from 'react';
import { Table } from 'reactstrap';

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
                            <th className={'first'}>ID</th>
                            <th className={'second'}>Project Data</th>
                            <th className={'third'}>Column 3</th>
                            <th className={'fourth'}>Column 4</th>
                            <th className={'fifth'}>Column 5</th>
                            <th className={'sixth'}>Column 6</th>
                        </tr>
                    </thead>
                </Table>
            </div>
        )
    }
}