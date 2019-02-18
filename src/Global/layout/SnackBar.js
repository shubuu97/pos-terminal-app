import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';

const withSnackBar = (WrappedComponent) => {
    return class Enhancer extends Component {

        render() {
            console.log(this.props, 'props is here');
            let { classes } = this.props;

            if (this.props.message.text) {
                return <div> {this.props.message.text && <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    open={true}
                    autoHideDuration={6000}
                    onClose={() => { }}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                        classes: {
                            root: this.props.message.isSuccess ? classes.success : classes.failure
                        }
                    }}
                    message={<span id="message-id">{this.props.message.text}</span>}
                />}
                    <WrappedComponent {...this.props} />
                </div>
            }

            return <WrappedComponent {...this.props} />
        }

    };
};

export default withSnackBar;
