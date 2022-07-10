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
                    <form className="col-12">
                        <div className="form-group">
                            <label htmlFor="formGroupExampleInput">Example label</label>
                            <input type="text" className="form-control" id="formGroupExampleInput" placeholder="Example input" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="formGroupExampleInput2">Another label</label>
                            <input type="text" className="form-control" id="formGroupExampleInput2" placeholder="Another input" />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Login;