import React, {Component, useEffect, useState} from 'react';
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
    const [isAuth, setIsAuth] = useState(false)
    let panes = [];
    const [state, setState] = useState({ activeIndex: 1 });

    function logout(){
        window.login = false
        console.log("NOT LOGGED IN")
        navigate('/home');
    }
    useEffect(() => {
      if(window.user_info == undefined) {
          navigate('/home')
      }
      else{
          if(window.user_info['rank_id'] === 0 || window.user_info['rank_id'] === 3){
             setIsAuth(true);
          }
          else{
              setIsAuth(false);
          }
          console.log(isAuth)
      }
    })
    const handleRangeChange = (e) => setState({ activeIndex: e.target.value })
    const handleTabChange = (e, { activeIndex }) => {setState({ activeIndex }); console.log('Index ' + activeIndex); console.log('State ' + activeIndex)}
    const { activeIndex } = state


    if(isAuth){
        panes = [
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
            },
            {
                menuItem: 'LOGOUT', render: () => {logout()}
            }
        ]
    }
    else{
        panes = [
            {
                menuItem: 'Booking', render: () => <BookMeeting/>
            },
            {
                menuItem: 'Schedule', render: () => <Schedule/>
            },
            {
                menuItem: 'Dashboard', render: () => <Dashboard/>
            },
            {
                menuItem: 'Account Settings', render: () => <UserSettings/>
            },
            {
                menuItem: 'LOGOUT', render: () => {logout()}
            }
        ]
    }
    return <Tab panes={panes}
                activeIndex={activeIndex}
                onTabChange={handleTabChange}/>


}
export default UserView;
