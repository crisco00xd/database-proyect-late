import React, {Component, useState, useEffect} from 'react';
import {Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import {Button, Card, Container, Modal, Form} from "semantic-ui-react";
import user_info  from "./HomePage";
import axios from "axios";
import {add} from "react-big-calendar/lib/utils/dates";
import {useNavigate} from "react-router-dom";
import setIsAuth from "./UserView"
import Select from 'react-select'
import UserView from "./UserView";


// Event {
//     title: string,
//         start: Date,
//         end: Date,
//         allDay?: boolean
//     resource?: any,
// }


let elements = [];
function BookMeeting(){



    const navigate = useNavigate();
    if(window.login != true || window.login == undefined){
        alert("NOT LOGGED IN")
        navigate('/home');
    }
    const initialstate = {}
    const [dates, setDates] = useState([]);
    const [open, setOpen] = useState(false);
    const localizer = momentLocalizer(moment);
    const [values, setValues] = useState(initialstate);

    const handleChange = e => {
        const { name, value } = e.target;
        setValues({
          ...values,
          [name]: value
        });
      };

    function createElements(){
        let i = 0;
        let result = [];
        while(values.roomdata[i]){
            result.push(
                {label: values.roomdata[i]['name'],
                value: values.roomdata[i]['room_id']});
            i += 1
        }
        elements = result;
    }

    const create_appointment = (e) => {
            var axios = require('axios');
            let current_info = dates.pop()

            if(document.getElementById('members').value != ""){
                create_appointment_members();
                return;
            }

            values.owner_id = window.user_info['user_id']
            values.stock = 1
            values.rank_id = window.user_info['rank_id']
            values.status_id = 1
            values.date_reserved = values.timeframe1
            values.date_end = values.timeframe_end
            values.members = window.user_info['email']
            values.total_members = 1
            values.comment = document.getElementById('comment').value
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
            values.rank_id = window.user_info['rank_id']
            values.status_id = 1
            values.date_reserved = values.timeframe1
            values.date_end = values.timeframe_end
            let members = window.user_info['email'] + ',' + document.getElementById('members').value
            values.members = members.split(',')
            values.total_members = values.members.length
            values.comment = document.getElementById('comment').value
            window.values1 = values
            console.log(values.members)


        for(let i = 0; i < values.members.length; i++){
            values.members[i] = values.members[i].replace(/ /g,'');
        }
        for(let i = 1; i < values.members.length; i++){
            if(values.members[i] == window.user_info['email']){
                alert('Please Do Not Put Your Email In The Invitees');
                values.members = []
                return;
            }
        }

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

          if(response.data["Appointment"] == "Timeframe Conflicts With Selected Users Schedule"){
              alert("Timeframe Conflicts With Selected Users Schedule")
              return;
          }

          if(response.data["Appointment"] == "Success Creating Meeting"){
              alert("Created Meeting Successfully")
              setOpen(false);
          }
          else{
              alert(response.data["Appointment"])
              return;
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
                  createElements();
                  console.log(elements);
                  setOpen(true)
              }

          }
        })
        .catch(function (error) {
          console.log(error);
        });
        
    }

    const makeUserBusy = (e) => {

        var axios = require('axios');
        let current_info = dates.pop()

        if(current_info == undefined){
            alert("Please Select Dates")
            return
        }
        else{
            values.user_id = window.user_info['user_id']
            values.date_reserved = current_info['start']
            values.date_end = current_info['end']
        }




        var data = JSON.stringify(values);
        console.log(data)

        var config = {
          method: 'POST',
          url: 'http://localhost:5000/userbusy/create-user-busy',
          headers: {
            'Content-Type': 'application/json'
          },
          data : data
        };
        axios(config)
        .then(function (response) {
          if(response.data['response']){
              alert("Mark Timeframe Busy SuccessFully")
          }
          else{
              alert("Timeframe Already Marked")
          }
        })
        .catch(function (error) {
          console.log(error);
        });

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
            onClose={() => {setOpen(false); setValues(initialstate); }}
            onOpen={() => setOpen(true)}
        >
            <Modal.Header>Choose a Room!</Modal.Header>
            <Modal.Content>
                <h5> Available rooms: </h5>
                <Select
                        options={elements}
                        placeholder={'Select...'}
                        clearable={false}
                        onChange={((e) => {setValues({ ...values, ...{ ['room']: e, ['room_id']: e.value} }); console.log(values.room);})}
                        name="room"
                        value={values.room}
                    />
            <Form>
                <br/>
                <h5> Meeting Name: </h5>
                <Form.Input
                                id = 'comment'
                                icon='lock'
                                iconPosition='left'
                                placeholder='comment'
                                type='text'
                                onChange = {handleChange}
                />
                <h5> Invitees: </h5>
                <Form.Input
                                id = 'members'
                                icon='lock'
                                iconPosition='left'
                                placeholder='members'
                                type='text'
                                onChange = {handleChange}
                />


                <h5>*If Leave Blank It Will Assume Your Alone On The Meeting*</h5>
                <br/>
                <Button className='appointment-btn' content='Create Booking' primary onClick={create_appointment}/>
            </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => {setOpen(false); setValues(initialstate);}}>Cancel</Button>
            </Modal.Actions>
        </Modal>
        <Container fluid>
        <Button
            fluid
            onClick={getAvailableRoom}
        > Book Meeting </Button>
            <Button
            fluid
            onClick={makeUserBusy}
        > Make My Time Unavailable </Button>
            <Button
            fluid
            onClick={logout}
            > Log Out</Button>
    </Container>
    </Container>

}
export default BookMeeting;
