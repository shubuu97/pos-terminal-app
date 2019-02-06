import React from "react";
import Button from "react-bootstrap/lib/Button";
import FormGroup from "react-bootstrap/lib/FormGroup";
import FormControl from "react-bootstrap/lib/FormControl";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import Redirect  from "react-router/Redirect";
import "./LoginFormStyle.css";

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            email: "",
            password: "",
            redirect: false,
        };
    }

    isValidEmailAddress() {
        var pattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return pattern.test(this.state.email);
    }

    validateForm() {
        return this.state.email.length > 0 && this.isValidEmailAddress() && this.state.password.length > 0;
    }
    
    handleChange = event => {
        this.setState({
          [event.target.id]: event.target.value
        });
    }
    
    handleSubmit = event => {
        this.setState({redirect: true});
        event.preventDefault();
    }

    getClassName() {
        if(this.validateForm()){
            return "success";
        }else{
            return "warning";
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to="/suppliers/search" />;
        }
        return (
            <div className="login-wrapper">
                <div className="login">
                    <form onSubmit={this.handleSubmit}>
                        <FormGroup controlId="email" bsSize="large">
                            <FormControl
                            autoFocus
                            type="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            placeholder="Email"
                            />
                        </FormGroup>
                        <FormGroup controlId="password" bsSize="large">
                            <FormControl
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                            placeholder="Password"
                            />
                        </FormGroup>
                        <Button
                            bsStyle={this.getClassName()}
                            block
                            bsSize="large"
                            disabled={!this.validateForm()}
                            type="submit"
                        >
                            Login
                        </Button>
                    </form> 
            </div>
          </div>
        );
      }
}