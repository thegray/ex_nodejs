import React, { Component } from 'react';
import axios from 'axios';

const divNone = {
    display: 'none'
};

const divProg = {
    display: 'block'
}

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: ''
        };
    }

    async submit() {
        await axios.post('http://localhost:5000', {
            email: this.state.email
        }, {
                headers: {
                    //'Authorization': `Token ${still_none}`
                    'Authorization': `Token hai`
                }
            });
    }

    render() {
        return (
            <div className="container h-100 identifyProb">
                <div className="row h-100 justify-content-center align-items-center">
                    <div className="card col-sm-5 col-md-4 col-lg-3">
                        <div className="card-header text-center"><h1>Sign In</h1></div>
                        <div className="card-body">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="inputEmail">email</label>
                                    <input type="text" className="form-control" id="inputEmail" placeholder="your email" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputPassword">password</label>
                                    <input type="password" className="form-control" id="inputPassword" placeholder="your password" />
                                </div>
                                <hr />
                                <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">sign in</button>
                            </form>
                        </div>
                    </div>
                </div>
                <p className="row justify-content-center fixed-bottom text-muted">
                    <h5>@ PBK 2018</h5>
                </p>
            </div>
        )
    }
}

export default Login;