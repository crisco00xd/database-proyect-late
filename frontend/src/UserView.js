import React, {Component, useState} from 'react';
import {Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import {Button, Card, Container, Modal, Tab} from "semantic-ui-react";
import BookMeeting from "./BookMeeting";
import HomePage from "./HomePage";
import Schedule from "./Schedule";
import BookMeetingAuth from "./BookMeetingAuth";
import {useNavigate} from 'react-router-dom';
import Dashboard from "./Dashboard";
import UserSettings from "./UserSettings";



function UserView(){
    const navigate = useNavigate();

    if(window.login != true || window.login == undefined || window.user_info == undefined){
        navigate('/home');
    }
    let auth;

    if(window.user_info['rank_id'] == 0 || window.user_info['rank_id'] == 3){
        auth = true
    }
    else{
        auth = false
    }

    const [isAuth, setIsAuth] = useState(auth)

    const panes = [
        {
            menuItem: 'Booking', render: () => <BookMeeting/>
        },
        {
            menuItem: 'Schedule', render: () => <Schedule/>
        },
        {
            menuItem: 'Authority Settings', render: () => <Tab.Pane active={isAuth}><BookMeetingAuth/></Tab.Pane>
        }
        ,
        {
            menuItem: 'Dashboard', render: () => <Dashboard/>
        },
        {
            menuItem: 'Account Settings', render: () => <UserSettings/>
        }
    ]

    return <Tab panes={panes}/>


}
export default UserView;
