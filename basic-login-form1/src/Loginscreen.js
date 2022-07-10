import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import Login from './Login';
import Register from './Register';

class Loginscreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loginscreen: [],
            loginmessage: '',
            buttonLabel: 'Register',
            isLogin: true
        }
    }

    componentWillMount() {
        var loginscreen = [];
        loginscreen.push(
            <Login
                parentContext={this}
                appContext={this.props.parentContext}
            />);
        var loginmessage = "Please register yourself";
        this.setState({
            loginscreen: loginscreen,
            loginmessage: loginmessage
        });
    }

    handleClick(event) {
        var loginmessage;
        var loginscreen = [];
        if (this.state.isLogin) {
            loginscreen.push(<Register parentContext={this} />);
            loginmessage = "Go to Login";
            this.setState({
                loginscreen: loginscreen,
                loginmessage: loginmessage,
                buttonLabel: "Login",
                isLogin: false
            })
        }
        else {
            loginscreen.push(<Login parentContext={this} />);
            loginmessage = "Please register yourself";
            this.setState({
                loginscreen: loginscreen,
                loginmessage: loginmessage,
                buttonLabel: "Register",
                isLogin: true
            })
        }
    }

    render() {
        return (
            <div className="loginscreen">
                {this.state.loginscreen}
                {this.state.loginmessage}
                <MuiThemeProvider>
                    <div>
                        <RaisedButton
                            label={this.state.buttonLabel}
                            primary={true}
                            style={style}
                            onClick={(event) =>
                                this.handleClick(event)
                            }
                        />
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}

const style = {
    margin: 15,
};

export default Loginscreen;