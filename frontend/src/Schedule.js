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
    const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
    let [dates1, setDates1] = useState([{}]);
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [selected, setSelected] = useState();
    const localizer = momentLocalizer(moment)
    const useMountEffect = (fun) => useEffect(fun, [])
    const [refresh, setRefresh] = useState([]);

    const [values, setValues] = useState({
        user_id: ''
    });

    async function getSchedule(){
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
                    'name': response.data['Appointments'][i]['comment'],
                    'room_id': response.data['Appointments'][i]['room_id']
                };

                dates1.push({
                    'title': result.name,
                    'allDay': false,
                    'start': result.start,
                    'end': result.end,
                    'room_id': result.room_id
              })
          }
        })
        .catch(function (error) {
          console.log(error);
        });

    }

    async function getUserBusy(){
        var axios = require('axios');

        console.log(dates)

        values.user_id = window.user_info['user_id']


        var data = JSON.stringify(values);
        console.log(values)
        console.log(data)

        var config = {
          method: 'POST',
          url: 'http://127.0.0.1:5000/userbusy/user-busy-get',
          headers: {
            'Content-Type': 'application/json'
          },
          data : data
        };

        axios(config)
        .then(function (response) {
            for(let i = 0; i < response.data['response'].length; i++) {

                const result = {
                    type: 'date',
                    'start': (new Date(response.data['response'][i]['date_reserved'])),
                    'end': (new Date(response.data['response'][i]['date_end'])),
                    'name': 'Busy'
                };

                dates1.push({
                'title': result.name,
                'allDay': false,
                'start': result.start,
                'end': result.end
              })
          }
            console.log(dates1)
            setDates(dates1);
        })
        .catch(function (error) {
          console.log(error);
        });

    }

    async function getMeetingInfo(){
        var axios = require('axios');

        values.user_id = window.user_info['user_id']


        var data = JSON.stringify(values);

        var config = {
          method: 'POST',
          url: 'http://127.0.0.1:5000/Appointments/get-meeting',
          headers: {
            'Content-Type': 'application/json'
          },
          data : data
        };

        axios(config)
        .then(function (response) {
            if(response.data['Appointments']){
                values.members = response.data['Appointments'][0]['members'];
                setOpen(true);
            }
            else{
                alert('No Info Found. Error')
                return
            }

        })
        .catch(function (error) {
          console.log(error);
        });

    }
    async function deleteUserBusy(){
        var axios = require('axios');

        values.user_id = window.user_info['user_id']


        var data = JSON.stringify(values);

        var config = {
          method: 'POST',
          url: 'http://127.0.0.1:5000/userbusy/user-busy-delete',
          headers: {
            'Content-Type': 'application/json'
          },
          data : data
        };

        axios(config)
        .then(function (response) {
            if (response.data['response'] == 'Success Deleting User Busy Status'){
                alert("Deleted Busy Status Successfully");
                setOpen1(false);
                setRefresh(!(refresh));
            }else{
                alert('Could Not Delete Busy Status');
            }
        })
        .catch(function (error) {
          console.log(error);
        });

    }
    const handleSelected = async (event) => {
        setSelected(event);
        selected1 = event;
        console.log(event)
        if (event.title == 'Busy') {
            values.date_reserved = event.start;
            values.date_end = event.end;
            setOpen1(true);
        } else {
            values.date_reserved = event.start;
            values.date_end = event.end;
            values.room_id = event.room_id
            await getMeetingInfo();
        }

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

    useEffect(() => {
        async function getData() {
            await getSchedule();
            console.log("Loaded meetings");
            await getUserBusy();
            console.log("Loaded User busy");
        }
        getData();
    }, [refresh])

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
              newStyle.backgroundColor = "blue"
            }
            if (event.title == 'Busy') {
              newStyle.backgroundColor = "red"
            }
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
                                id = 'date_reserved'
                                icon='lock'
                                iconPosition='left'
                                label='Start Date'
                                placeholder='Start Date'
                                type='text'
                                value={values.date_reserved}
                                onChange = {handleChange}
                />

                <Form.Input
                                id = 'date_end'
                                icon='lock'
                                iconPosition='left'
                                label='End Date'
                                placeholder='end_date'
                                type='text'
                                value={values.date_end}
                                onChange = {handleChange}
                />

                <Form.Input
                                id = 'members'
                                icon='lock'
                                iconPosition='left'
                                label='Members'
                                placeholder='members'
                                type='text'
                                value={values.members}
                                onChange = {handleChange}
                />

                <Button className='appointment-btn' content='Update Meeting' primary onClick={handleChange}/>
            </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setOpen(false)}>Close</Button>
            </Modal.Actions>
        </Modal>

        <Modal
            centered={false}
            open={open1}
            onClose={() => setOpen1(false)}
            onOpen={() => setOpen1(true)}
        >
            <Modal.Header>Modify Busy Status</Modal.Header>
            <Modal.Content>
        <Form>
                <Form.Input
                                id = 'date_reserved'
                                icon='lock'
                                iconPosition='left'
                                label='Start Date'
                                placeholder='Start Date'
                                type='text'
                                value={values.date_reserved}
                                onChange = {handleChange}
                />

                <Form.Input
                                id = 'date_end'
                                icon='lock'
                                iconPosition='left'
                                label='End Date'
                                placeholder='end_date'
                                type='text'
                                value={values.date_end}
                                onChange = {handleChange}
                />
            </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setOpen1(false)}>Close</Button>
                <Button onClick={deleteUserBusy}>Delete</Button>
            </Modal.Actions>
        </Modal>
    </Container>


}
export default Schedule;
