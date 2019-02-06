import React from 'react';
import  Redirect  from "react-router/Redirect";

import "bootstrap/dist/css/bootstrap.css";



class UserOptions extends React.Component {
    constructor(props){
        super(props);
        this.onLogout = this.onLogout.bind(this);
    }

    onLogout() {
        this.props.onLogout();
    }

    render() {   
    
    return (
        <div>
            <ul className="pointer user-logout">
                <li onClick={this.onLogout}>Logout</li>
            </ul>
        </div>
    )

    }

}

export default UserOptions;
