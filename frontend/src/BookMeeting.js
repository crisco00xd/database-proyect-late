import React, {Component, useState} from 'react';
import {Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import {Button, Card, Container, Modal, Form, Select} from "semantic-ui-react";
import user_info  from "./HomePage";
import axios from "axios";
import {add} from "react-big-calendar/lib/utils/dates";
import {useNavigate} from "react-router-dom";
import setIsAuth from "./UserView"


// Event {
//     title: string,
//         start: Date,
//         end: Date,
//         allDay?: boolean
//     resource?: any,
// }
 


function BookMeeting(){
    const navigate = useNavigate();
    if(window.login != true || window.login == undefined){
        alert("NOT LOGGED IN")
        navigate('/home');
    }
    const [dates, setDates] = useState([]);
    const [open, setOpen] = useState(false);
    const localizer = momentLocalizer(moment)

    const handleChange = e => {
        const { name, value } = e.target;
        setValues({
          ...values,
          [name]: value
        });
      };

    const [values, setValues] = useState({
        "roomdata" : []
    });

        const create_appointment = (e) => {
            var axios = require('axios');
            let current_info = dates.pop()

            if(document.getElementById('members').value != ""){
                alert('Creating meeting with peers')
                create_appointment_members();
                return;
            }

            values.owner_id = window.user_info['user_id']
            values.stock = 1
            values.room_id = document.getElementById('room_number').value
            values.rank_id = window.user_info['rank_id']
            values.status_id = 1
            values.date_reserved = values.timeframe1
            values.date_end = values.timeframe_end
            values.members = [values.owner_id]
            values.total_members = 1
            window.values1 = values




        var data = JSON.stringify(values);
        console.log(data)

        var config = {
          method: 'POST',
          url: 'http://localhost:5000/Appointments',
          headers: {
            'Content-Type': 'application/json'
          },
          data : data
        };

        axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          if(response.data["Appointment"] == "Success Creating Meeting"){
              alert("Created Meeting Successfully")
              setOpen(false)
          }


        })
        .catch(function (error) {
          console.log(error);
        });

    }

    const create_appointment_members = (e) => {
            var axios = require('axios');

            values.owner_id = window.user_info['user_id']
            values.stock = 1
            values.room_id = document.getElementById('room_number').value
            values.rank_id = window.user_info['rank_id']
            values.status_id = 1
            values.date_reserved = values.timeframe1
            values.date_end = values.timeframe_end
            values.members = document.getElementById('members').value.split(',')
            values.total_members = values.members.length
            window.values1 = values




        var data = JSON.stringify(values);
        console.log(data)

        var config = {
          method: 'POST',
          url: 'http://127.0.0.1:5000/Appointments',
          headers: {
            'Content-Type': 'application/json'
          },
          data : data
        };

        axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          if(response.data["Appointment"] == "Success Creating Meeting"){
              alert("Created Meeting Successfully")
              setOpen(false)
          }


        })
        .catch(function (error) {
          console.log(error);
        });

    }

    const getAvailableRoom = (e) => {
        var axios = require('axios');
        let current_info = dates.pop()

        if(current_info == undefined){
            alert("Please Select Dates")
            return
        }
        else{
            values.timeframe1 = current_info['start']
            values.timeframe_end = current_info['end']
        }

        
        
        
        var data = JSON.stringify(values);
        console.log(data)

        var config = {
          method: 'POST',
          url: 'http://localhost:5000/rooms-available-timeframe',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : data
        };
        axios(config)
        .then(function (response) {
          if(response.data['Appointments']){
              window.roomdata = response.data['Appointments']
              console.log(window.roomdata)
              if(Object.keys(window.roomdata).length == 0) {
                  alert("No Rooms Available")
              }else{
                  values.roomdata = window.roomdata
                  setOpen(true)
              }

          }
        })
        .catch(function (error) {
          console.log(error);
        });
        
    }
        function createElements(){
        let elements = [];
        let i = 0;

        while(values.roomdata[i]){
            elements.push(<div>Room: {values.roomdata[i]['name']} Room Number: {values.roomdata[i]['room_id']}</div>);
            i += 1
        }
        return elements;
    }
    function logout(){
        window.login = false
        console.log("NOT LOGGED IN")
        navigate('/home');
    }


        //TODO Add for loop for all rooms
    return <Container style={{ height: 800 }}><Calendar
        selectable
        localizer={localizer}
        startAccessor="start"
        events={dates}
        endAccessor="end"
        views={["month", "day"]}
        defaultDate={Date.now()}
        onSelecting = {(selected) =>{ setDates([{
                        'title': 'Selection',
                        'allDay': false,
                        'start': new Date(selected.start),
                        'end': new Date(selected.end)
                    }] ) } }
    >

    </Calendar>
        <Modal
            centered={false}
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
        >
            <Modal.Header>Choose a Room!</Modal.Header>
            <Modal.Content>
                <div> {createElements()} </div>
            <Form>
                <Form.Input
                                id = 'room_number'
                                icon='lock'
                                iconPosition='left'
                                label='Room Number'
                                placeholder='room_number'
                                type='text'
                                onChange = {handleChange}
                />

                <Form.Input
                                id = 'members'
                                icon='lock'
                                iconPosition='left'
                                label='Members (Include Yourself)'
                                placeholder='members'
                                type='text'
                                onChange = {handleChange}
                />
                <Button className='appointment-btn' content='Create Booking' primary onClick={create_appointment}/>
            </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
            </Modal.Actions>
        </Modal>
        <Container fluid>
        <Button
            fluid
            onClick={getAvailableRoom}
        > Book Meeting </Button>
            <Button
            fluid
            onClick={logout}
            > Log Out</Button>
    </Container>
    </Container>

}
export default BookMeeting;