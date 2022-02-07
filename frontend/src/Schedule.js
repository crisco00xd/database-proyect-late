import React, {Component, useState} from 'react';
import {Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import {Button, Card, Container, Modal} from "semantic-ui-react";
import axios from "axios";
import "./BookMeeting.js";
import {useNavigate} from "react-router-dom";

// Event {
//     title: string,
//         start: Date,
//         end: Date,
//         allDay?: boolean
//     resource?: any,
// }


function Schedule(){
    const navigate = useNavigate();
    if(window.login != true || window.login == undefined){
        alert("NOT LOGGED IN")
        navigate('/home');
    }
    const [dates, setDates] = useState([{}]);
    const [open, setOpen] = useState(false);
    const localizer = momentLocalizer(moment)

    const [values, setValues] = useState({
        user_id: ''
    });
    const getSchedule = (e) => {
        var axios = require('axios');

        console.log(dates)

        values.user_id = window.user_info['user_id']


        var data = JSON.stringify(values);
        console.log(values)
        console.log(data)

        var config = {
          method: 'POST',
          url: 'http://127.0.0.1:5000/user-schedule',
          headers: {
            'Content-Type': 'application/json'
          },
          data : data
        };

        axios(config)
        .then(function (response) {
          for (let i = 0; i < response.data['Appointments'].length; i++) {

              var result = { type:'date', 'start':(new Date(response.data['Appointments'][i]['date_reserved'])), 'end': (new Date(response.data['Appointments'][i]['date_end'])) }

              dates.push({
                'title': 'Meeting',
                'allDay': false,
                'start': result.start,
                'end': result.end
              })}
        })
        .catch(function (error) {
          console.log(error);
        });

    }
    return <Container style={{ height: 800 }}><Calendar
        localizer={localizer}
        startAccessor="start"
        events={dates}
        endAccessor="end"
        views={["month", "day"]}
        defaultDate={Date.now()}
    >

    </Calendar>
     <Button fluid onClick={getSchedule}> Get Schedule
     </Button>
    </Container>


}
export default Schedule;
