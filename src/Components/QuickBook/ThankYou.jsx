import React from 'react';
/* Lodash Imports */
import _get from 'lodash/get';
import Button from '@material-ui/core/Button'
/* Material import */

/* Redux Imports */

/* Component Imports */
import SuccessGif from '../../assets/images/success.gif'
import HomeContainer from '../../xBoilerplate/pos';
class ThankYou extends React.Component {

    constructor() {
        super();
        this.state = {

        }
    }

    render() {
        return (
            <div className="flex flex-column justify-center align-center">
                <div><img height={200} src={SuccessGif} /></div>
                <div><span> Succesfully Synched From Quick Book.</span></div>
                <Button onClick={()=>this.props.history.push('/')} variant="contained" color="primary" >Go Back To Home</Button>
            </div>
        );
    }
}

export default ThankYou;