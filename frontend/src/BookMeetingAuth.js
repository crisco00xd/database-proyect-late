import React, {Component, useState} from 'react';
import {Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import {Button, Card, Container, Modal, Form} from "semantic-ui-react";
import user_info  from "./HomePage";
import axios from "axios";
import {add} from "react-big-calendar/lib/utils/dates";
import {useNavigate} from "react-router-dom";
import setIsAuth from "./UserView"
import reportWebVitals from "./reportWebVitals";
import Select from 'react-select'


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
    const [dates, setDates] = useState([]);
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const [open5, setOpen5] = useState(false);
    const [open6, setOpen6] = useState(false);
    const [open7, setOpen7] = useState(false);
    const [open8, setOpen8] = useState(false);
    const [open9, setOpen9] = useState(false);
    const [open10, setOpen10] = useState(false);
    const [open11, setOpen11] = useState(false);
    const [open12, setOpen12] = useState(false);
    const localizer = momentLocalizer(moment)

    const handleChange = e => {
        const { name, value } = e.target;
        setValues({
          ...values,
          [name]: value
        });
      };

    const [values, setValues] = useState({
        "roomdata" : [],
        "user_info": []
    });
//FINISH ROOM BUSY AND MEETING WITH PEERS
    const timeBusy = (e) => {
        var axios = require('axios');
        let current_info = dates.pop()

        if(current_info == undefined){
            alert("Please Select Dates")
            return
        }
        else{
            values.date_reserved = current_info['start']
            values.date_end = current_info['end']
        }
            values.user_id = window.user_info['user_id']
            values.room_id = document.getElementById('room_id').value
            values.rank_id = window.user_info['rank_id']
            values.comment = 'To test'


        var data = JSON.stringify(values);
        console.log(data)

        var config = {
          method: 'post',
          url: 'http://localhost:5000/make-busy-room',
          headers: {
            'Content-Type': 'application/json'
          },
          data : data
        };

        axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          if(response.data){
              alert("Success Adding TimeFrame Busy")
              setOpen2(false)
          }
        })
        .catch(function (error) {
          console.log(error);
        });

    }

    const create_appointment = (e) => {
            var axios = require('axios');
            let current_info = dates.pop()


            values.owner_id = window.user_info['user_id']
            values.stock = 1
            values.room_id = document.getElementById('room_number').value
            values.rank_id = window.user_info['rank_id']
            values.status_id = 1
            values.date_reserved = values.timeframe1
            values.date_end = values.timeframe_end
            values.members = [1]
            values.total_members = values.members.length
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

    const updateUser = (e) => {
        var axios = require('axios');

        values.first_name = document.getElementById('first_name').value
        values.last_name = document.getElementById('last_name').value
        values.email = document.getElementById('email').value
        values.password = document.getElementById('password').value
        values.rank_id = document.getElementById('rank_id').value
        values.user_id = document.getElementById('user_id').value


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


    const modifyRoom = (e) => {
        var axios = require('axios');

        values.room_name = document.getElementById('room_name1').value
        values.room_id = document.getElementById('room_id').value
        values.dept_id = 1
        values.stock = 1





        var data = JSON.stringify(values);

        var config = {
          method: 'put',
          url: 'http://localhost:5000/rooms',
          headers: {
            'Content-Type': 'application/json'
          },
          data : data
        };

        axios(config)
        .then(function (response) {
          if(response.data['message'] == "Success Updating Room!"){
                alert("Successfully Edited Room Info");
                setOpen4(false);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    const deleteRoom = (e) => {
        var axios = require('axios');

        values.room_id = document.getElementById('room_id').value

        var data = JSON.stringify(values);

        var config = {
          method: 'DELETE',
          url: 'http://localhost:5000/rooms',
          headers: {
            'Content-Type': 'application/json'
          },
          data : data
        };

        axios(config)
        .then(function (response) {
          if(response.data['message'] == "Success Deleting!"){
                alert("Successfully Deleting Room!");
                setOpen3(false);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    const readUser = (e) => {
        var axios = require('axios');

        values.user_id = document.getElementById('user_id1').value
        var data = JSON.stringify(values);

        console.log(data)

        var config = {
          method: 'POST',
          url: 'http://localhost:5000/user/get-user-by-id',
          headers: {
            'Content-Type': 'application/json'
          },
          data : data
        };

        axios(config)
        .then(function (response) {
          if(response.data['User'].length > 0){
                values.user_info= response.data['User']
                setOpen6(false);
                setOpen7(true);
          }else{
              alert("No Info On User Exists! Please Try Again!");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    const createRoom = (e) => {
        var axios = require('axios');

        values.room_name = document.getElementById('room_name1').value
        values.dept_id = 1
        values.stock = 1





        var data = JSON.stringify(values);

        var config = {
          method: 'POST',
          url: 'http://localhost:5000/rooms',
          headers: {
            'Content-Type': 'application/json'
          },
          data : data
        };

        axios(config)
        .then(function (response) {
          if(response.data['message'] == "Success Creating Room!"){
                alert("Successfully Created Room!");
                setOpen3(false);
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

    const getRoomSchedule = (e) => {
        var axios = require('axios');

        values.room_id = document.getElementById('room_id2').value;

        var data = JSON.stringify(values);
        console.log(data)

        var config = {
          method: 'post',
          url: 'http://localhost:5000/rooms-schedule',
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
                  alert("This Room Has No Schedule");
              }else{
                  values.roomdata = window.roomdata
                  setOpen8(false);
                  setOpen9(true);
              }

          }
        })
        .catch(function (error) {
          console.log(error);
        });

    }

    const getOwnerByTimeframe = (e) => {
        var axios = require('axios');

        let current_info = dates.pop()

        if(current_info == undefined){
            alert("Please Select Dates")
            return
        }
        else{
            values.timeframe = current_info['start']
            values.timeframe2 = current_info['end']
        }

        var data = JSON.stringify(values);
        console.log(data)

        var config = {
          method: 'post',
          url: 'http://localhost:5000/Appointments/room/get-owner-by-timeframe',
          headers: {
            'Content-Type': 'application/json'
          },
          data : data
        };
        axios(config)
        .then(function (response) {
          if(response.data['Appointments']){
              window.roomdata = response.data['Appointments']
              console.log(window.roomdata);

              if(Object.keys(window.roomdata).length == 0) {
                  alert("This Timeframe Has No Schedule");
              }else{
                  values.roomdata = window.roomdata;
                  createElements2();
                  setOpen12(true);
              }
          }
        })
        .catch(function (error) {
          console.log(error);
        });

    }

    const getUserSchedule = (e) => {
        var axios = require('axios');

        values.user_id = document.getElementById('user_id2').value;

        var data = JSON.stringify(values);
        console.log(data)

        var config = {
          method: 'post',
          url: 'http://localhost:5000/user-schedule',
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
                  alert("This User Has No Schedule");
              }else{
                  values.roomdata = window.roomdata
                  setOpen10(false);
                  setOpen11(true);
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

    function createElements2(){
        let result = new Map();
        let mySet = new Set();
        let i = 0;

        while(values.roomdata[i]){
            let room_name = values.roomdata[i]['name'];
            mySet.add(room_name);
            if(!result.has(room_name)){
                result.set(room_name, []);
            }
            result.get(room_name).push(
                <div>First Name: {values.roomdata[i]['first_name']}
                <br></br> Last Name: {values.roomdata[i]['last_name']} <br></br>
                Date Reserved: {values.roomdata[i]['date_reserved']} <br></br>
                End Date: {values.roomdata[i]['date_end']}<br></br> Room: {values.roomdata[i]['name']}
                <br></br><br></br></div>);

            i += 1
        }

        let arr = Array.from(mySet);
        for(let i = 0; i < arr.length; i++){
              elements.push({label: arr[i],
                value: result.get(arr[i])});
        }
    }

        function createElements1(){
        let elements = [];
        let i = 0;

        while(values.roomdata[i]){
            elements.push(<div>Room: {values.roomdata[i]['name']} <br></br> Room Number: {values.roomdata[i]['room_id']} <br></br> Date Reserved: {values.roomdata[i]['date_reserved']} <br></br> End Date: {values.roomdata[i]['date_end']}<br></br><br></br></div>);
            i += 1
        }
        return elements;
    }

    function createElementsforUserInfo(){
        let elements = [];
        let i = 0;

        while(values.user_info[i]){
            elements.push(<div>Email: {values.user_info[0]['email']} <br></br>First Name: {values.user_info[0]['first_name']} <br></br> Last Name: {values.user_info[0]['last_name']}<br></br> Rank ID: {values.user_info[0]['rank_id']}<br></br> User ID: {values.user_info[0]['user_id']} </div>);
            i += 1
        }
        return elements;
    }
    function createElementsforUserSchedule(){
        let elements = [];
        let i = 0;

        while(values.roomdata[i]){
            elements.push(<div>Date Reserved: {values.roomdata[i]['date_reserved']} <br></br>Date End: {values.roomdata[i]['date_end']} <br></br> First Name: {values.roomdata[i]['first_name']}<br></br> Last Name: {values.roomdata[i]['last_name']}<br></br><br></br><br></br> </div>);
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
            <Modal.Header>All Available Rooms In Timeframe</Modal.Header>
            <Modal.Content>
                <div> {createElements()} </div>
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
                <Button className='appointment-btn' content='Update User' primary onClick={updateUser}/>
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
            <Modal.Header>Choose a Room!</Modal.Header>
            <Modal.Content>
            <Form>
                <Form.Input
                                id = 'room_id'
                                icon='lock'
                                iconPosition='left'
                                label='Room ID'
                                placeholder='room_id'
                                type='text'
                                onChange = {handleChange}
                />
                <Button className='appointment-btn' content='Mark Busy' primary onClick={timeBusy}/>
            </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setOpen2(false)}>Cancel</Button>
            </Modal.Actions>
        </Modal>

        <Modal
            centered={false}
            open={open3}
            onClose={() => setOpen3(false)}
            onOpen={() => setOpen3(true)}
        >
            <Modal.Header>Add a Room!</Modal.Header>
            <Modal.Content>
            <Form>
                <Form.Input
                                id = 'room_name'
                                icon='lock'
                                iconPosition='left'
                                label='Room Name'
                                placeholder='room_name'
                                type='text'
                                onChange = {handleChange}
                />
                <Button className='appointment-btn' content='Create Room!' primary onClick={createRoom}/>
            </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setOpen3(false)}>Cancel</Button>
            </Modal.Actions>
        </Modal>
        <Modal
            centered={false}
            open={open4}
            onClose={() => setOpen4(false)}
            onOpen={() => setOpen4(true)}
        >
            <Modal.Header>Modify Room Information</Modal.Header>
            <Modal.Content>
            <Form>
                <Form.Input
                                id = 'room_name1'
                                icon='lock'
                                iconPosition='left'
                                label='room_name'
                                placeholder='room_name'
                                type='text'
                                onChange = {handleChange}
                />

                <Form.Input
                                id = 'room_id'
                                icon='lock'
                                iconPosition='left'
                                label='room_id'
                                placeholder='room_id'
                                type='text'
                                onChange = {handleChange}
                />
                <Button className='appointment-btn' content='Update Room' primary onClick={modifyRoom}/>
            </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setOpen4(false)}>Cancel</Button>
            </Modal.Actions>
        </Modal>
        <Modal
            centered={false}
            open={open5}
            onClose={() => setOpen5(false)}
            onOpen={() => setOpen5(true)}
        >
            <Modal.Header>Delete Room</Modal.Header>
            <Modal.Content>
            <Form>
                <Form.Input
                                id = 'room_id'
                                icon='lock'
                                iconPosition='left'
                                label='room_id'
                                placeholder='room_id'
                                type='text'
                                onChange = {handleChange}
                />
                <Button className='appointment-btn' content='Delete Room' primary onClick={deleteRoom}/>
            </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setOpen5(false)}>Cancel</Button>
            </Modal.Actions>
        </Modal>

        <Modal
            centered={false}
            open={open6}
            onClose={() => setOpen6(false)}
            onOpen={() => setOpen6(true)}
        >
            <Modal.Header>Get User Information By ID Search</Modal.Header>
            <Modal.Content>
            <Form>
                <Form.Input
                                id = 'user_id1'
                                icon='lock'
                                iconPosition='left'
                                label='User ID'
                                placeholder='USER ID'
                                type='text'
                                onChange = {handleChange}
                />
                <Button className='appointment-btn' content='Get User Info' primary onClick={readUser}/>
            </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setOpen6(false)}>Cancel</Button>
            </Modal.Actions>
        </Modal>

        <Modal
            centered={false}
            open={open7}
            onClose={() => setOpen7(false)}
            onOpen={() => setOpen7(true)}
        >
            <Modal.Header>Get User Information By ID Search</Modal.Header>
            <Modal.Content>
                <div> {createElementsforUserInfo()} </div>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setOpen7(false)}>Cancel</Button>
            </Modal.Actions>
        </Modal>

        <Modal
            centered={false}
            open={open8}
            onClose={() => setOpen8(false)}
            onOpen={() => setOpen8(true)}
        >
            <Modal.Header>Choose a Room!</Modal.Header>
            <Modal.Content>
            <Form>
                <Form.Input
                                id = 'room_id2'
                                icon='lock'
                                iconPosition='left'
                                label='Room ID'
                                placeholder='room_id'
                                type='text'
                                onChange = {handleChange}
                />
                <Button className='appointment-btn' content='Find Schedule' primary onClick={getRoomSchedule}/>
            </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setOpen8(false)}>Cancel</Button>
            </Modal.Actions>
        </Modal>

        <Modal
            centered={false}
            open={open9}
            onClose={() => setOpen9(false)}
            onOpen={() => setOpen9(true)}
        >
            <Modal.Header>Room Schedule</Modal.Header>
            <Modal.Content>
                <div> {createElements1()} </div>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setOpen9(false)}>Cancel</Button>
            </Modal.Actions>
        </Modal>
        <Modal
            centered={false}
            open={open10}
            onClose={() => setOpen10(false)}
            onOpen={() => setOpen10(true)}
        >
            <Modal.Header>Choose a User!</Modal.Header>
            <Modal.Content>
            <Form>
                <Form.Input
                                id = 'user_id2'
                                icon='lock'
                                iconPosition='left'
                                label='User ID'
                                placeholder={window.user_info['user_id']}
                                type='text'
                                onChange = {handleChange}
                />
                <Button className='appointment-btn' content='Find Schedule' primary onClick={getUserSchedule}/>
            </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setOpen10(false)}>Cancel</Button>
            </Modal.Actions>
        </Modal>

        <Modal
            centered={false}
            open={open11}
            onClose={() => setOpen11(false)}
            onOpen={() => setOpen11(true)}
        >
            <Modal.Header>User Schedule</Modal.Header>
            <Modal.Content>
                <div> {createElementsforUserSchedule()} </div>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setOpen11(false)}>Cancel</Button>
            </Modal.Actions>
        </Modal>

        <Modal
            centered={false}
            open={open12}
            onClose={() => {
                    setOpen12(false);
                    elements = [];
                    setValues(initialstate);
                }}
            onOpen={() => setOpen12(true)}
        >
            <Modal.Header>Room Schedule</Modal.Header>
            <Modal.Content>
                <Select
                        options={elements}
                        placeholder={'Select...'}
                        clearable={false}
                        onChange={((e) => {setValues({ ...values, ...{ ['room_name']: e, ['room_list']: e.value} }); console.log(values.room_name);})}
                        name="room_name"
                        value={values.room_name}
                />
                <br></br>
            <div>{values.room_list}</div>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => {
                    setOpen12(false);
                    elements = [];
                    setValues(initialstate);
                }}>Cancel</Button>
            </Modal.Actions>
        </Modal>

        <Container fluid>
            <br></br>
            <h1>TimeFrame Settings</h1>
        <Button
            fluid
            onClick={getAvailableRoom}
        > Search For Available Rooms In A TimeFrame </Button>
        <Button
            fluid
            onClick={() => setOpen2(true)}
        > Mark TimeFrame as Unavailable</Button>
            <br></br>
            <br></br>
            <h1>Users Settings</h1>
            <Button
            fluid
            onClick={() => setOpen1(true)}
            > Modify User Information</Button>
            <Button
            fluid
            onClick={() => setOpen6(true)}
            > Read User Info By ID</Button>
            <Button
            fluid
            onClick={() => setOpen10(true)}
            > Get All User Schedule</Button>
            <Button
            fluid
            onClick={getOwnerByTimeframe}
            > See Who Appointed A Room At A Certain Time</Button>
            <br></br>
            <br></br>
            <h1>Room Settings</h1>
            <Button
            fluid
            onClick={() => setOpen8(true)}
            > Find A Room Schedule</Button>
            <Button
            fluid
            onClick={() => setOpen3(true)}
            > Add New Room</Button>
            <Button
            fluid
            onClick={() => setOpen4(true)}
            > Modify Room Information</Button>
            <Button
            fluid
            onClick={() => setOpen5(true)}
            > Delete Room</Button>
            <br></br>
            <br></br>
    </Container>
    </Container>

}
export default BookMeeting;
