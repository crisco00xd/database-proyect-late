import React, {Component, useState} from 'react';
import {Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import {Button, Card, Container, Modal} from "semantic-ui-react";
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from "recharts";
import axios from "axios";


function BookMeeting(){
    const [refresh, doRefresh] = useState([]);
    const [data, setData] = useState([]);
    let count = 0;
    const findMostUsedRoom = (e) => {
        var axios = require('axios');

        var config = {
          method: 'post',
          url: 'http://localhost:5000/statistics/used-room',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        axios(config)
        .then(function (response) {
            setData([{"name": 'Room ' + response.data['Available'][0]['room_id'], "Counts": response.data['Available'][0]['count']}]);
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
          url: 'http://localhost:5000/statistics/busy-hours',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        axios(config)
        .then(function (response) {
            setData([{"name": response.data['Available'][0]['most_appointed_starting_time'] + ' - ' + response.data['Available'][0]['most_appointed_ending_time'], "Counts": response.data['Available'][0]['amount_of_appointments']},
            {"name": response.data['Available'][1]['most_appointed_starting_time'] + ' - ' + response.data['Available'][1]['most_appointed_ending_time'], "Counts": response.data['Available'][1]['amount_of_appointments']},
            {"name": response.data['Available'][2]['most_appointed_starting_time'] + ' - ' + response.data['Available'][2]['most_appointed_ending_time'], "Counts": response.data['Available'][2]['amount_of_appointments']},
            {"name": response.data['Available'][3]['most_appointed_starting_time'] + ' - ' + response.data['Available'][3]['most_appointed_ending_time'], "Counts": response.data['Available'][3]['amount_of_appointments']},
            {"name": response.data['Available'][4]['most_appointed_starting_time'] + ' - ' + response.data['Available'][4]['most_appointed_ending_time'], "Counts": response.data['Available'][4]['amount_of_appointments']}]);
            return
        })
        .catch(function (error) {
          console.log(error);
        });

    }

    const findMostBookedUsers = (e) => {
        var axios = require('axios');

        var config = {
          method: 'post',
          url: 'http://localhost:5000/statistics/busy-users',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        axios(config)
        .then(function (response) {
            let i = 0;
            doRefresh([]);
            while(response.data['Available'][i]){
                refresh.push({"name": 'User ' + response.data['Available'][i]['user_id'], "Counts": response.data['Available'][i]['count']});
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
          url: 'http://localhost:5000/statistics/busy-rooms',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        axios(config)
        .then(function (response) {
            let i = 0;
            doRefresh([]);
            while(response.data['Available'][i]){
                refresh.push({"name": 'Room ' + response.data['Available'][i]['room_id'], "Counts": response.data['Available'][i]['count']});
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
            <br/><h1> GLOBAL STATISTICS </h1>
        <br/>
        <BarChart width={730} height={250} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Counts" fill="#8884d8" />
        </BarChart>
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
        </center>
    </Container>

}
export default BookMeeting;
