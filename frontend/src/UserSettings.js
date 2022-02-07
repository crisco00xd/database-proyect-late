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

function BookMeeting(){
    const navigate = useNavigate();
    if(window.login != true || window.login == undefined){
        alert("NOT LOGGED IN")
        navigate('/home');
    }
    const [dates, setDates] = useState([]);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
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

    const updateUser = (e) => {
        var axios = require('axios');

        values.first_name = document.getElementById('first_name').value
        values.last_name = document.getElementById('last_name').value
        values.email = document.getElementById('email').value
        values.password = document.getElementById('password').value
        values.rank_id = window.user_info['rank_id']
        values.user_id = window.user_info['user_id']

        if(values.email == ''){
            values.email = window.user_info['email']
        }
        if(values.first_name == ''){
            values.first_name = window.user_info['first_name']
        }
        if(values.last_name == ''){
            values.last_name = window.user_info['last_name']
        }
        if(values.password == ''){
            values.password = window.user_info['password']
        }

        var data = JSON.stringify(values);

        var config = {
          method: 'put',
          url: 'http://localhost:5000/update-user',
          headers: {
            'Content-Type': 'application/json'
          },
          data : data
        };

        axios(config)
        .then(function (response) {
          if(response.data['response'] == "Successfully Edited User"){
                alert("Successfully Edited User Info");
                setOpen1(false);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    const deleteUser = (e) => {
        var axios = require('axios');

        values.user_id = window.user_info['user_id']

        var data = JSON.stringify(values);

        var config = {
          method: 'delete',
          url: 'http://localhost:5000/delete-user',
          headers: {
            'Content-Type': 'application/json'
          },
          data : data
        };

        axios(config)
        .then(function (response) {
          if(response.data['message'] == "Success Deleting User"){
                alert("Successfully Deleted User Info");
                setOpen2(false);
                navigate('/home')
          }else{
              alert('Could Not Delete User! \n Make Sure Your Schedule Is Clear');
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    return <Container style={{ height: 800 }}>

        <Modal
            centered={false}
            open={open1}
            onClose={() => setOpen1(false)}
            onOpen={() => setOpen1(true)}
        >
            <Modal.Header>Modify User Information</Modal.Header>
            <Modal.Content>
            <Form>
                <Form.Input
                                id = 'first_name'
                                icon='lock'
                                iconPosition='left'
                                label='First Name'
                                placeholder='first_name'
                                type='text'
                                onChange = {handleChange}
                />

                <Form.Input
                                id = 'last_name'
                                icon='lock'
                                iconPosition='left'
                                label='Last Name'
                                placeholder='last_name'
                                type='text'
                                onChange = {handleChange}
                />

                <Form.Input
                                id = 'email'
                                icon='lock'
                                iconPosition='left'
                                label='Email'
                                placeholder='email'
                                type='text'
                                onChange = {handleChange}
                />

                <Form.Input
                                id = 'password'
                                icon='lock'
                                iconPosition='left'
                                label='Password'
                                placeholder='password'
                                type='text'
                                onChange = {handleChange}
                />
                <Button className='appointment-btn' content='Update Account Details' primary onClick={updateUser}/>
                <h5>*Leave Blank For No Change*</h5>
            </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setOpen1(false)}>Cancel</Button>
            </Modal.Actions>
        </Modal>

        <Modal
            centered={false}
            open={open2}
            onClose={() => setOpen2(false)}
            onOpen={() => setOpen2(true)}
        >
            <Modal.Content>
            <Form>
                <h1>ARE YOU SURE?</h1>
                <Button className='appointment-btn' content='IM SURE PLEASE DELETE MY ACCOUNT' primary onClick={deleteUser}/>

            </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setOpen2(false)}>Cancel</Button>
            </Modal.Actions>
        </Modal>

        <br></br>
        <Button fluid onClick={() => setOpen1(true)}> Change Account Details</Button>
        <Button fluid onClick={() => setOpen2(true)}> Delete Account</Button>
    </Container>

}
export default BookMeeting;
