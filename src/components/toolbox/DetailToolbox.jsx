import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as Icons from "../../constants/Icons";
import React, {Fragment} from "react";
import Tooltip from "rc-tooltip";

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';

import * as KeyboardShortcut from "../../constants/KeyboardShortcuts";
import SearchInputContainer from '../element/SearchInputContainer'

export default class PersonDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            removeArmed: false,
        };
        this.keyboard = [
            {...KeyboardShortcut.CLOSE, command: this.close},
            {...KeyboardShortcut.EDIT, command: this.edit},
            {...KeyboardShortcut.ADD_BOX, command: this.addToBox}
        ];
        this.keyboardHints = this.keyboard.map(key => `${key.keys.map(key => key.description).join(', ')}: ${key.name}`).join('\n');
    }

    // componentDidMount() {
    //     document.addEventListener('keydown', this.handleKeyDown);
    // }

    // componentWillUnmount() {
    //     document.removeEventListener('keydown', this.handleKeyDown);
    // }

    render() {
        return (
            <Grid container style={{backgroundColor: "beige"}} alignItems="center">
            <Container maxWidth="lg">
                <Grid container alignItems="center">
                        {/* <div onClick={this.close} className={'tool-box-button'}>{this.props.editable ? 'Close' : 'Return'}</div> */}
                        {/* {this.props.editable || true ? <div onClick={this.edit} className={`tool-box-button orange`}>{'Edit'}</div> : null}
                        <div onClick={this.addToBox} className={`tool-box-button blue`}>
                            <FontAwesomeIcon icon={Icons.ICON_BOX_ARROW}/>
                            <FontAwesomeIcon icon={Icons.ICON_BOX}/>
                        </div>
                        {this.props.editable ?
                            <Fragment>
                                <div onClick={!this.state.removeArmed ? undefined : this.remove} className={`tool-box-button remove red${!this.state.removeArmed ? ' disabled' : ''}`}>{`Remove ${label}`}</div>
                                <FontAwesomeIcon className={`tool-box-checkbox`} onClick={this.handleRemoveArmed} icon={this.state.removeArmed ? Icons.ICON_CHECKBOX_CHECKED : Icons.ICON_CHECKBOX_UNCHECKED} style={{cursor: 'pointer'}}/>
                            </Fragment>
                        : null} */}
                        <Grid item xs={8} style={{ padding: 8}}>
                            <Grid container justify="center">
                                <SearchInputContainer />
                            </Grid>
                        </Grid>
                        <Grid item xs={1}>
                            <Grid container justify="center">
                                {/* <Tooltip placement={"bottomLeft"} overlay={<span>{this.keyboardHints}</span>}>
                                    <div className={'icon-keyboard'}><FontAwesomeIcon icon={Icons.ICON_KEYBOARD_SHORTCUTS}/></div>
                                </Tooltip> */}
                            </Grid>
                        </Grid>
                        <Grid item xs={5}>
                            <Grid container justify="center" spacing={2}>
                                {/* <Grid item>
                                    <Chip
                                        icon={<FaceIcon />}
                                        label="My own"
                                        onClick={() => {}}
                                        onDelete={() => {}}
                                        variant="outlined"
                                        color="primary"
                                    /> 
                                </Grid>
                                <Grid item>
                                    <Chip
                                        icon={<FaceIcon />}
                                        label="Active"
                                        onClick={() => {}}
                                        onDelete={() => {}}
                                        variant="outlined"
                                        color="secondary"
                                    />  
                                </Grid> */}

                            </Grid>
                        </Grid>
    

                    </Grid>
                    </ Container>
                </Grid>
        );
    }
    // *****************************************************************************************************************
    // CLOSE, EDIT, REMOVE
    // *****************************************************************************************************************
    close = () => {
        this.props.returnToPreviousView();
    };

    edit = () => {
        if(this.props.editable || true) this.props.edit(this.props.selected);
    };

    remove = () => {
        if(this.props.editable) this.props.remove();
        this.close();
    };

    addToBox = () => {
        this.props.addToBox(this.props.selected);
    };
    // *****************************************************************************************************************
    // HELPERS
    // *****************************************************************************************************************
    handleRemoveArmed = () => {
        this.setState({removeArmed: !this.state.removeArmed})
    };

    handleKeyDown = event => {
        for(const shortcut of this.keyboard) {
            for(const key of shortcut.keys) if(event.which === key.keyCode && key.ctrl === event.ctrlKey && key.alt === event.altKey && key.shift === event.shiftKey) shortcut.command();
        }
    }
}