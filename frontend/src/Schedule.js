import React, {Component, useEffect, useState} from 'react';
import {Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import {Button, Card, Container, Form, Modal} from "semantic-ui-react";
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
    let selected1 = [];
    const [dates, setDates] = useState([{}]);
    let [dates1, setDates1] = useState([{}]);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState();
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
            setDates1([]);
            for(let i = 0; i < response.data['Appointments'].length; i++) {

                const result = {
                    type: 'date',
                    'start': (new Date(response.data['Appointments'][i]['date_reserved'])),
                    'end': (new Date(response.data['Appointments'][i]['date_end'])),
                    'name': response.data['Appointments'][i]['comment']
                };

                dates1.push({
                'title': result.name,
                'allDay': false,
                'start': result.start,
                'end': result.end
              })
              setDates(dates1);
          }
        })
        .catch(function (error) {
          console.log(error);
        });

    }
    const handleSelected = (event) => {
        setSelected(event);
        selected1 = event;
        setOpen(true);
    }

    function colors (event, start, end, isSelected) {
        let backgroundColor;

        backgroundColor = '#' + 'FF0000';

        const style = {
            backgroundColor: backgroundColor,
            borderRadius: '10px',
            opacity: 0.8,
            color: 'White',
            border: '0px',
            display: 'block'
        };
        return {
            style: style
        };
}
    const handleChange = e => {
        const { name, value } = e.target;
        setValues({
          ...values,
          [name]: value
        });
      };

    return <Container style={{ height: 800 }}><Calendar
        localizer={localizer}
        startAccessor="start"
        events={dates}
        endAccessor="end"
        views={["month", "day"]}
        defaultDate={Date.now()}
        selected = {selected}
        onSelectEvent={handleSelected}
        eventPropGetter={
          (event) => {
            let newStyle = {
            borderRadius: '10px',
            opacity: 0.8,
            color: 'White',
            border: '0px',
            display: 'block'
            };

            if (event.title == 'To test') {
              newStyle.backgroundColor = "red"
            }
            // if (event.is_cancelled) {
            //   newStyle.backgroundColor = "red"
            // }
            // if (event.busy_time_id) {
            //   newStyle.backgroundColor = "orange"
            // }
            return {
              className: "",
              style: newStyle
            };
          }
        }
    >

    </Calendar>
     <Button fluid onClick={getSchedule}> Get Schedule
     </Button>
        <Modal
            centered={false}
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
        >
            <Modal.Header>Modify Event Information</Modal.Header>
            <Modal.Content>
<Form>
                <Form.Input
                                id = 'first_name'
                                icon='lock'
                                iconPosition='left'
                                label='First Name'
                                placeholder='first_name'
                                type='text'
                                value={window.user_info['first_name']}
                                onChange = {handleChange}
                />

                <Form.Input
                                id = 'last_name'
                                icon='lock'
                                iconPosition='left'
                                label='Last Name'
                                placeholder='last_name'
                                type='text'
                                value={window.user_info['last_name']}
                                onChange = {handleChange}
                />

                <Form.Input
                                id = 'email'
                                icon='lock'
                                iconPosition='left'
                                label='Email'
                                placeholder='email'
                                type='text'
                                value={window.user_info['email']}
                                onChange = {handleChange}
                />

                <Form.Input
                                id = 'password'
                                icon='lock'
                                iconPosition='left'
                                label='Password'
                                placeholder='password'
                                type='text'
                                value={window.user_info['password']}
                                onChange = {handleChange}
                />

                <Form.Input
                                id = 'rank_id'
                                icon='lock'
                                iconPosition='left'
                                label='Rank Id'
                                placeholder='rank_id'
                                type='text'
                                value={window.user_info['rank_id']}
                                onChange = {handleChange}
                />

                <Form.Input
                                id = 'user_id'
                                icon='lock'
                                iconPosition='left'
                                label='User Id'
                                placeholder='user_id'
                                type='text'
                                value={window.user_info['user_id']}
                                onChange = {handleChange}
                />
                <Button className='appointment-btn' content='Update User' primary onClick={handleChange}/>
            </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setOpen(false)}>Close</Button>
            </Modal.Actions>
        </Modal>
    </Container>


}
export default Schedule;
