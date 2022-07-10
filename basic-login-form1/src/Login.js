import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import UploadScreen from './UploadScreen';
var apiBaseUrl = "http://localhost:4000/api/";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email:'',
            password:''
        };
    }

    componentWillMount() {
        console.log('login componentWillMount')
    }

    handleClick(event) {
        var self = this;
        var payload = {
            "email": this.state.email,
            "password": this.state.password
        }
        axios.post(apiBaseUrl + 'login', payload)
            .then(function (response) {
                console.log(response);
                if (response.data.code === 200) {
                    console.log("Login successfull");
                    var uploadScreen = [];
                    uploadScreen.push(
                        <UploadScreen appContext = {self.props.appContext} />
                    );
                    self.props.appContext.setState({loginPage: [], uploadScreen: uploadScreen})
                } else if (response.data.code === 204) {
                    console.log("email password do not match");
                    alert("email password do not match");
                } else {
                    console.log("email does not exist");
                    alert("email does not exist");
                }
            }).catch(function(error) {
                console.log(error);
            });
    }

    render() {
        return (
            <div>
                <MuiThemeProvider>
                    <AppBar title="Login" />
                    <TextField 
                        hintText = "email" 
                        floatingLabelText = "email"
                        onChange = {(event, newValue) => 
                            this.setState({email:newValue})
                        }
                    />
                    <br />
                    <TextField 
                        type = "password" 
                        hintText = "password"
                        floatingLabelText = "password"
                        onChange = {(event, newValue) => 
                            this.setState({password:newValue})
                        }
                    />
                    <br />
                    <RaisedButton 
                        label = "Submit"
                        primary = {true}
                        style = {style}
                        onClick = {(event) => 
                            this.handleClick(event)    
                        }
                    />
                </MuiThemeProvider>
            </div>
        );
    }
}

const style = {
    margin: 15,
};

export default Login;