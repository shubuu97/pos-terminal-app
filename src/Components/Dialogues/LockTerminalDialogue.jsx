import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty'
/* React Pose */
import { easing, keyframes, styler } from 'popmotion';
/* Redux Imports */
import { connect } from 'react-redux';
/* Material Import */
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
/* Material Icons */
import KeyboardBackspaceOutlined from '@material-ui/icons/KeyboardBackspaceOutlined'
import LockOutlined from '@material-ui/icons/LockOutlined'
import ExitToApp from '@material-ui/icons/ExitToApp';
/* Global Imports */


function Transition(props) {
    return <Slide direction="down" {...props} />;
}

class LockTerminalDialogue extends React.Component {

    constructor() {
        super();
        this.state = {
            Title: '',
            holdedItems: [],
            shake: false,
            EnteredPin: '',
            logout: false
        }
    }

    componentDidMount() {

    }

    clearLockPin = () => {
        if (document.getElementById('lockPin')) {
            const divStyler = styler(document.getElementById('lockPin'));
            keyframes({
                values: [
                    { x: 0 },
                    { x: -15 },
                    { x: 15 },
                    { x: -15 },
                    { x: 0 }
                ],
                duration: 300,
                easings: [easing.easeInOut, easing.easeInOut, easing.easeInOut, easing.easeInOut],
            }).start(divStyler.set);
        }
    }

    handleInputChange = num => event => {
        let EnteredPin = this.state.EnteredPin
        if (num != 'clear' && num != 'backspace') {
            EnteredPin = (EnteredPin || '') + num;
        }
        else if (num == 'clear') {
            EnteredPin = '';
        }
        else {
            EnteredPin = EnteredPin.substring(0, EnteredPin.length - 1)
        }

        let EnteredPinLength = EnteredPin.length
        if (EnteredPinLength < 4) {
            this.setState({
                EnteredPin: EnteredPin
            })
        }
        else if (EnteredPinLength == 4) {
            this.setState({
                EnteredPin: EnteredPin
            }, () => this.handleTestPin())

        }
    }

    handleTestPin = () => {
        let pin = localStorage.getItem('userPin');
        let EnteredPin = this.state.EnteredPin;
        if (pin == EnteredPin) {
            this.setState({
                EnteredPin: ''
            }, () => this.props.handleUnlockTerminal())

        }
        else {
            this.setState({
                EnteredPin: ''
            }, () => this.clearLockPin())
        }
    }

    handleLogout = () => {
        this.setState({
            logout: true
        })
        this.props.handleLogout()
    }

    render() {

        return (
            <div>
                <Dialog
                    open={this.props.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.props.handleCloseAlertCartClear}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                    className='lock-terminal'
                >
                    <DialogContent>
                        {
                            this.state.logout ?
                            <div className="flex-column justify-center align-center pad-20 pt-60 pb-60">
                                <CircularProgress size={30} style={{color: 'white'}} />
                                <div className='pt-15' style={{fontSize: '1.5em'}}>Logging Out</div>
                            </div> 
                            :  
                            <div className='flex-column '>
                                <span className='card-title flex-row justify-center'>
                                    Enter Passcode
                            </span>
                                <div className='flex-row fwidth justify-center' id='lockPin'>
                                    <div className={this.state.EnteredPin.length > 0 ? 'circle filled' : 'circle'} key={1}></div>
                                    <div className={this.state.EnteredPin.length > 1 ? 'circle filled' : 'circle'} key={2}></div>
                                    <div className={this.state.EnteredPin.length > 2 ? 'circle filled' : 'circle'} key={3}></div>
                                    <div className={this.state.EnteredPin.length > 3 ? 'circle filled' : 'circle'} key={4}></div>
                                </div>
                                <div className='card numpad-card'>
                                    <div className='flex-row flex-wrap justify-center pt-15 pb-15'>
                                        <div className='key small-key' onClick={this.handleInputChange('1')}>1</div>
                                        <div className='key small-key' onClick={this.handleInputChange('2')}>2</div>
                                        <div className='key small-key' onClick={this.handleInputChange('3')}>3</div>
                                        <div className='key small-key' onClick={this.handleInputChange('4')}>4</div>
                                        <div className='key small-key' onClick={this.handleInputChange('5')}>5</div>
                                        <div className='key small-key' onClick={this.handleInputChange('6')}>6</div>
                                        <div className='key small-key' onClick={this.handleInputChange('7')}>7</div>
                                        <div className='key small-key' onClick={this.handleInputChange('8')}>8</div>
                                        <div className='key small-key' onClick={this.handleInputChange('9')}>9</div>
                                        <div className='key small-key' onClick={this.handleInputChange('backspace')}><KeyboardBackspaceOutlined /></div>
                                        <div className='key small-key' onClick={this.handleInputChange('0')}>0</div>
                                        <div className='key small-key' onClick={this.handleInputChange('clear')}>clr</div>
                                        <div className=' flex-row justify-center align-center pt-15'><ExitToApp /><span className='card-title ml-10' onClick={this.handleLogout}>Logout</span></div>
                                    </div>
                                </div>
                            </div>
                        }
                    </DialogContent>
                </Dialog>
            </div >
        );
    }
}

export default LockTerminalDialogue;