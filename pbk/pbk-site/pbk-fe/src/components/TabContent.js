import React, { Component } from 'react';
import TabList from './Tabs/TabList';
import Login from '../LoginPage/Login/Login';
import Register from '../LoginPage/Register/Register';

import '../Tab.css';

export default class TabContent extends Component {
    render() {
        return (
            <div className="container up">
                <TabList>
                    <div label="Log" className="tab-content fade">
                        <Login />
                    </div>
                    <div label="Reg" className="tab-content fade">
                        <Register />
                    </div>
                    <div label="Mon" className="tab-content fade">
                        Ad pariatur nostrud pariatur exercitation ipsum ipsum culpa mollit commodo mollit ex. Aute sunt incididunt amet commodo est sint nisi deserunt pariatur do. Aliquip ex eiusmod voluptate exercitation cillum id incididunt elit sunt. Qui minim sit magna Lorem id et dolore velit Lorem amet exercitation duis deserunt. Anim id labore elit adipisicing ut in id occaecat pariatur ut ullamco ea tempor duis.
                    </div>
                    <div label="Tue" className="tab-content fade">
                        Est quis nulla laborum officia ad nisi ex nostrud culpa Lorem excepteur aliquip dolor aliqua irure ex. Nulla ut duis ipsum nisi elit fugiat commodo sunt reprehenderit laborum veniam eu veniam. Eiusmod minim exercitation fugiat irure ex labore incididunt do fugiat commodo aliquip sit id deserunt reprehenderit aliquip nostrud. Amet ex cupidatat excepteur aute veniam incididunt mollit cupidatat esse irure officia elit do ipsum ullamco Lorem. Ullamco ut ad minim do mollit labore ipsum laboris ipsum commodo sunt tempor enim incididunt. Commodo quis sunt dolore aliquip aute tempor irure magna enim minim reprehenderit. Ullamco consectetur culpa veniam sint cillum aliqua incididunt velit ullamco sunt ullamco quis quis commodo voluptate. Mollit nulla nostrud adipisicing aliqua cupidatat aliqua pariatur mollit voluptate voluptate consequat non.
                    </div>
                </TabList>
            </div>
        );
    }
}