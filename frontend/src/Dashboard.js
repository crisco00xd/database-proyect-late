import React, {Component, useState} from 'react';
import {Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import {Button, Card, Container, Modal} from "semantic-ui-react";
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from "recharts";
import axios from "axios";
import {useNavigate} from "react-router-dom";


function BookMeeting(){
    const [refresh, doRefresh] = useState([]);
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    if(window.login != true || window.login == undefined){
        alert("NOT LOGGED IN")
        navigate('/home');
    }
    let count = 0;
    const [values, setValues] = useState({});
    const findMostUsedRoom = (e) => {
        var axios = require('axios');

        var config = {
          method: 'post',
          url: 'https://cristian-solo-db-proyect.herokuapp.com/statistics/used-room',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        axios(config)
        .then(function (response) {
            setData([{"name": 'Room: ' + response.data['Available'][0]['name'], "Counts": response.data['Available'][0]['count']}]);
            return
        })
        .catch(function (error) {
          console.log(error);
        });

    }
    const findBusiestHour = (e) => {
        var axios = require('axios');

        var config = {
          method: 'post',
          url: 'https://cristian-solo-db-proyect.herokuapp.com/statistics/busy-hours',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        axios(config)
        .then(function (response) {
            let i = 0;
            doRefresh([]);
            while(response.data['Available'][i]){
                refresh.push({"name": response.data['Available'][i]['most_appointed_starting_time'] + ' - ' + response.data['Available'][i]['most_appointed_ending_time'], "Counts": response.data['Available'][i]['amount_of_appointments']});
                i+=1;
            }
            setData(refresh);
        })
        .catch(function (error) {
          console.log(error);
        });

    }

    const findMostBookedUsers = (e) => {
        var axios = require('axios');

        var config = {
          method: 'post',
          url: 'https://cristian-solo-db-proyect.herokuapp.com/statistics/busy-users',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        axios(config)
        .then(function (response) {
            let i = 0;
            doRefresh([]);
            while(response.data['Available'][i]){
              if(response.data['Available'][i]['first_name'] == 'Busy'){
                i+=1;
                continue;
              }
                refresh.push({"name": response.data['Available'][i]['first_name'] + ' ' + response.data['Available'][i]['last_name'], "Counts": response.data['Available'][i]['count']});
                i+=1;
            }
            setData(refresh);
        })
        .catch(function (error) {
          console.log(error);
        });

    }

    const findMostBookedRooms = (e) => {
        var axios = require('axios');

        var config = {
          method: 'post',
          url: 'https://cristian-solo-db-proyect.herokuapp.com/statistics/busy-rooms',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        axios(config)
        .then(function (response) {
            let i = 0;
            doRefresh([]);
            while(response.data['Available'][i]){
                refresh.push({"name": 'Room: ' + response.data['Available'][i]['name'], "Counts": response.data['Available'][i]['count']});
                i+=1;
            }
            setData(refresh);
        })
        .catch(function (error) {
          console.log(error);
        });

    }

    const UserMostBookedUser = (e) => {
        var axios = require('axios');

        values.user_id = window.user_info['user_id']
        var data = JSON.stringify(values);
        var config = {
          method: 'post',
          url: 'http://127.0.0.1:5000/statistics/user-most-booked-user',
          headers: {
            'Content-Type': 'application/json'
          },
          data : data
        };
        axios(config)
        .then(function (response) {
            let i = 0;
            doRefresh([]);
            while(response.data['result'][i]){
                refresh.push({"name": response.data['result'][0]['first_name'] + ' ' + response.data['result'][0]['last_name'], "Counts": response.data['result'][0]['user_count']});
                i+=1;
            }
            setData(refresh);
        })
        .catch(function (error) {
          console.log(error);
        });

    }

    const MostBookedRoomByUser = (e) => {
        var axios = require('axios');

        values.user_id = window.user_info['user_id']
        var data = JSON.stringify(values);
        var config = {
          method: 'post',
          url: 'http://127.0.0.1:5000/statistics/most-booked-room-by-user',
          headers: {
            'Content-Type': 'application/json'
          },
          data : data
        };
        axios(config)
        .then(function (response) {
            let i = 0;
            doRefresh([]);
            while(response.data['result'][i]){
                refresh.push({"name": "Room: " + response.data['result'][0]['name'], "Counts": response.data['result'][0]['count']});
                i+=1;
            }
            setData(refresh);
        })
        .catch(function (error) {
          console.log(error);
        });

    }

    return <Container style={{ height: 800 }}>
        <center>
            <br/><h1> STATISTICS </h1>
        <br/>
        <BarChart width={730} height={250} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Counts" fill="#8884d8" />
        </BarChart>
            <br/><h1> GLOBAL STATISTICS </h1>
        <Button
            fluid
            onClick={findMostUsedRoom}
            > Find Most Booked Room</Button>
            <Button
            fluid
            onClick={findBusiestHour}
            > Find Busiest Hours</Button>
            <Button
            fluid
            onClick={findMostBookedUsers}
            > Find Most Booked Users</Button>
            <Button
            fluid
            onClick={findMostBookedRooms}
            > Find Most Booked Rooms</Button>
            <br/><h1> USER STATISTICS </h1>
            <Button
            fluid
            onClick={UserMostBookedUser}
            > User Most Booked User</Button>
            <Button
            fluid
            onClick={MostBookedRoomByUser}
            > Most Booked Room By User</Button>
        </center>
    </Container>

}
export default BookMeeting;
