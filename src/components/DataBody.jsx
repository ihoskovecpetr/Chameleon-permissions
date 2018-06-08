import React from 'react';
import { Table } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';

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
                    {this.props.projects.map(project => <tr onClick = {() => this.edit(project.id)} key={project.id}>
                        <td className={'first'}>{project.id}</td>
                        <td className={'second'}>{project.value}</td>
                        <td className={'third'}>Column 3</td>
                        <td className={'fourth'}>{'A'}</td>
                        <td className={'fifth'}>{'B'}</td>
                        <td className={'sixth'}>{'C'}</td>
                    </tr>)}
                    </tbody>
                </Table>
            </Scrollbars>
        )
    }
}