import React from 'react';
/* React Pose */
import posed from 'react-pose';
/* Material Imports */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import CircularProgress from '@material-ui/core/CircularProgress';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class RefundDialogue extends React.Component {
    state = {
        open: false,
        error: false,
        success: false,
        step: 1,
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    showItemList = () => {
        return (
            <React.Fragment>
                <tr>
                    <td>Dummy Cell 1-1</td>
                    <td>Dummy Cell 1-2</td>
                    <td>Dummy Cell 1-2</td>
                </tr>
                <tr>
                    <td>Dummy Cell 1-1</td>
                    <td>Dummy Cell 1-2</td>
                    <td>Dummy Cell 1-2</td>
                </tr>
                <tr>
                    <td>Dummy Cell 1-1</td>
                    <td>Dummy Cell 1-2</td>
                    <td>Dummy Cell 1-2</td>
                </tr>
                <tr>
                    <td>Dummy Cell 1-1</td>
                    <td>Dummy Cell 1-2</td>
                    <td>Dummy Cell 1-2</td>
                </tr>
                <tr>
                    <td>Dummy Cell 1-1</td>
                    <td>Dummy Cell 1-2</td>
                    <td>Dummy Cell 1-2</td>
                </tr>

            </React.Fragment>

        )
    }

    handleProceed = () => {
        this.setState({
            step: this.state.step + 1
        })
    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    TransitionComponent={Transition}
                    keepMounted
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <div className='refund-dialogue'>

                        {/* Step 1 */}

                        {
                            this.state.step == 1 ?
                                <div className='refund-step-1 flex-column '>
                                    <span className='card-title'>Order Details</span>

                                    <div className="refund-items overflow-y mui-row" style={{ paddingLeft: '5%', paddingRight: '6%' }}>
                                        <table className="mui-table mui-table--bordered">
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Returnable Qty</th>
                                                    <th>Return Qty</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.showItemList()}
                                            </tbody>
                                        </table>
                                    </div>
                                </div> : null
                        }

                        {/* Step 2 */}

                        {
                            this.state.step == 2 ?
                                <div className='refund-step-2 flex-column'>
                                    <span className='card-title'>Refund Methods</span>

                                </div> : null
                        }

                        {
                            this.state.step == 3 ?
                                <div className='refund-step-2 flex-column'>
                                    <span className='card-title'>Success</span>

                                </div> : null
                        }


                        {
                            this.state.step == 1 || this.state.step == 2 ?
                            <div className='refund-action-section flex-row'>
                                <div className='action-btn flex-row justify-center align-center' onClick={this.props.handleRefundClose}>Cancel</div>
                                <div className='action-btn flex-row justify-center align-center' onClick={this.handleProceed}>Proceed</div>
                            </div> : null
                        }


                    </div>
                </Dialog>
            </div>
        );
    }
}

export default RefundDialogue;