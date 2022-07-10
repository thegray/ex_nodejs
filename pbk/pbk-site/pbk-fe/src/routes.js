import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './App';
import LoginPage from './LoginPage/LoginPage';
import Login from './LoginPage/Login/Login';
import TabContent from './components/TabContent';
import LoginForm from './components/LoginPage/LoginForm';
//import Register from './LoginPage/Register/Register';
//import './App.css';

const Routes = () => (
    <Switch>
        <Route exact path='/' component={App} />
        <Route path='/tab' component={TabContent} />
        <Route path='/login' component={LoginForm} />
        <Route path='/register' component={LoginPage} />
        <Route path='/tes' component={Login} />
    </Switch>
)

export default Routes;