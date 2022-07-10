import React, {Component} from "react";
import { browserHistory } from 'react-router';

export default class Home extends Component {
    componentDidMount() {
        browserHistory.push('/');
    }
    render() {
        return (
            <div>
                This is the home page.
            </div>
        );
    }
}