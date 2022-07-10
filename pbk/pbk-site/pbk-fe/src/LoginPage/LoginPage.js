import React, { Component } from 'react';
import Login from './Login/Login';
import Register from './Register/Register';
import '../App.css';

class LoginPage extends Component {
    render() {
        return (
            <div className="container">
                <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" href="#login" role="tab" data-toggle="tab">Login</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#register" role="tab" data-toggle="tab">Register</a>
                    </li>
                </ul>

                <div className="tab-content">
                    <div role="tabpanel" className="tab-pane fade show active" id="login">
                        <Login />
                    </div>
                    <div role="tabpanel" className="tab-pane fade" id="register">
                        <Register />
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginPage;