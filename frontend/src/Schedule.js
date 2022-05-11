import React, { Component, useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { Button, Card, Container, Form, Modal } from "semantic-ui-react";
import axios from "axios";
import "./BookMeeting.js";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";


// Event {
//     title: string,
//         start: Date,
//         end: Date,
//         allDay?: boolean
//     resource?: any,
// }


function Schedule() {
  const navigate = useNavigate();
  if (window.login != true || window.login == undefined) {
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
  const [open2, setOpen2] = useState(false);
  const [selected, setSelected] = useState();
  const localizer = momentLocalizer(moment)
  const [refresh, setRefresh] = useState([]);

  const [values, setValues] = useState({
    user_id: '',
    members: [],
    deleted_members: []
  });

  const [checked, setChecked] = useState([])



  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  }

  function getMembersList() {
    return (values.members.map((value) => {
      const labelId = `checkbox-list-label-${value}`;

      return (
        <ListItem
          key={value}
          disablePadding
        >
          <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={value} />
          </ListItemButton>
        </ListItem>
      );
    }))
  }

  let membersList = getMembersList();

  useEffect(() => { membersList = getMembersList(); }, [values.members])

  async function getSchedule() {
    var axios = require('axios');

    if (!(window.user_info)) {
      return;
    }
    else {
      values.user_id = window.user_info['user_id']
    }



    var data = JSON.stringify(values);
    console.log(values)
    console.log(data)

    var config = {
      method: 'POST',
      url: 'https://cristian-solo-db-proyect.herokuapp.com/user-schedule',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        setDates1([]);
        for (let i = 0; i < response.data['Appointments'].length; i++) {

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
        getUserBusy();
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  async function getUserBusy() {
    var axios = require('axios');

    console.log(dates)

    values.user_id = window.user_info['user_id']


    var data = JSON.stringify(values);
    console.log(values)
    console.log(data)

    var config = {
      method: 'POST',
      url: 'https://cristian-solo-db-proyect.herokuapp.com/userbusy/user-busy-get',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        for (let i = 0; i < response.data['response'].length; i++) {

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

  async function getMeetingInfo() {
    var axios = require('axios');

    values.user_id = window.user_info['user_id']


    var data = JSON.stringify(values);

    var config = {
      method: 'POST',
      url: 'https://cristian-solo-db-proyect.herokuapp.com/Appointments/get-meeting',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        if (response.data['Appointments'].length > 0) {
          values.members = response.data['Appointments'][0]['members'];
          setOpen(true);
        }
        else {
          alert('No Info Found. Error')
          return
        }

      })
      .catch(function (error) {
        console.log(error);
      });

  }

  async function getOwner() {
    var axios = require('axios');

    var data = JSON.stringify(values);

    var config = {
      method: 'POST',
      url: 'https://cristian-solo-db-proyect.herokuapp.com/Appointments/get-meeting',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        if (response.data['Appointments'] != []) {
          values.owner_id = response.data['Appointments'][0]['owner_id']
          console.log(values.owner_id);
          return;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  async function updateMeeting() {
    var axios = require('axios');

    values.owner_id = window.user_info['user_id']
    values.rank_id = window.user_info['rank_id']
    values.status_id = 1
    values.comment = document.getElementById('comment').value;
    values.date_reserved1 = new Date(document.getElementById('date_reserved1').value);
    values.date_end = new Date(document.getElementById('date_end').value);
    values.total_members = values.members.length

    console.log(values)
    var data = JSON.stringify(values);

    var config = {
      method: 'POST',
      url: 'https://cristian-solo-db-proyect.herokuapp.com/Appointments/update-meeting',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        if (response.data['room'] == 'Success Updating Meeting') {
          alert("Updated Meeting Successfully");
          setRefresh(!(refresh));
        } else {
          alert('Could Not Modify');
        }
      })
      .catch(function (error) {
        console.log(error);
      });

  }


  async function deleteMeeting() {
    if (window.user_info['user_id'] != values.owner_id) {
      alert('Cannot Delete Meeting Because You Are Not The Owner')
      return
    }

    var axios = require('axios');

    values.owner_id = window.user_info['user_id']
    values.rank_id = window.user_info['rank_id']
    values.status_id = 1
    values.comment = document.getElementById('comment').value;
    values.date_end = new Date(document.getElementById('date_end').value);
    values.members = values.members;
    values.total_members = values.members.length;

    console.log(values)
    var data = JSON.stringify(values);

    var config = {
      method: 'POST',
      url: 'https://cristian-solo-db-proyect.herokuapp.com/Appointments/delete-meeting',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        if (response.data['room'] == 'Success Deleting Meeting') {
          alert("Deleted Meeting Successfully");
          setOpen(false);
          setRefresh(!(refresh));
        } else {
          alert('Could Not Delete');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function getRoomByID() {
    var axios = require('axios');

    var data = JSON.stringify(values);

    var config = {
      method: 'POST',
      url: 'https://cristian-solo-db-proyect.herokuapp.com/rooms/room-by-id',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        if (response.data['Room'] != []) {
          window.roomdata = response.data
          values.room_name = response.data['Room'][0]['name'];
          window.room_name = response.data['Room'][0]['name'];
          return;
        }
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  async function deleteUserBusy() {
    var axios = require('axios');

    values.user_id = window.user_info['user_id']


    var data = JSON.stringify(values);

    var config = {
      method: 'POST',
      url: 'https://cristian-solo-db-proyect.herokuapp.com/userbusy/user-busy-delete',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        if (response.data['response'] == 'Success Deleting User Busy Status') {
          alert("Deleted Busy Status Successfully");
          setRefresh(!(refresh));
        } else {
          alert('Could Not Delete Busy Status');
        }
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  async function deleteMembers() {
    var axios = require('axios');


    var data = JSON.stringify(values);

    var config = {
      method: 'POST',
      url: 'https://cristian-solo-db-proyect.herokuapp.com/Appointments/delete-unavailable',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        if (response.data['response'] == 'Success Clearing Unavailable Timestamp') {
          alert("Deleted User Successfully");
          setRefresh(!(refresh));
        } else {
          alert('Could Not Delete User');
        }
      })
      .catch(function (error) {
        console.log(error);
      });

  }
  async function deleteRoomBusy() {
    var axios = require('axios');


    var data = JSON.stringify(values);

    var config = {
      method: 'POST',
      url: 'https://cristian-solo-db-proyect.herokuapp.com/delete-room-busy',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        if (response.data['response'] == 'Success') {
          alert("Deleted Room Busy Successfully");
          setOpen2(false);
          setRefresh(!(refresh));
        } else {
          alert('Could Not Delete Room Busy');
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
    }
    else if (event.title == 'Unavailable Room') {
      values.room_id = event.room_id
      values.date_reserved = event.start
      values.date_end = event.end
      getRoomByID();
      setOpen2(true);
    }

    else {
      values.comment = event.title;
      values.date_reserved = event.start;
      values.date_end = event.end;
      values.room_id = event.room_id
      await getRoomByID();
      await getOwner();
      await getMeetingInfo();
    }

  }

  function colors(event, start, end, isSelected) {
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
    }
    getData();
  }, [refresh])

  function getDate(date_reserved) {
    let date = new Date(date_reserved)
    if (date.getMinutes() == 0) {
      return date.toLocaleDateString() + '  ' + date.getHours() + ':' + date.getMinutes() + date.getMinutes()
    }
    return date.toLocaleDateString() + '  ' + date.getHours() + ':' + date.getMinutes()
  }


  return <Container style={{ height: 800 }}>
    <br></br>
    <center><h2>My Schedule</h2></center>
    <br></br>
    <Calendar
      localizer={localizer}
      startAccessor="start"
      events={dates}
      endAccessor="end"
      views={["month", "day"]}
      defaultDate={Date.now()}
      selected={selected}
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


          if (event.title == 'Busy') {
            newStyle.backgroundColor = "red"
          }
          else if (event.title == 'Unavailable Room') {
            newStyle.backgroundColor = "orange"
          }
          else {
            newStyle.backgroundColor = "blue"
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
            id='date_reserved1'
            icon='lock'
            iconPosition='left'
            label='Start Date'
            placeholder='Start Date'
            type='text'
            defaultValue={getDate(values.date_reserved)}
            onChange={handleChange}
            readOnly='readonly'
          />

          <Form.Input
            id='date_end'
            icon='lock'
            iconPosition='left'
            label='End Date'
            placeholder='end_date'
            type='text'
            defaultValue={getDate(values.date_end)}
            onChange={handleChange}
            readOnly='readonly'
          />
          <Form.Input
            id='room_name'
            icon='lock'
            iconPosition='left'
            label='Room'
            placeholder='Room'
            type='text'
            defaultValue={values.room_name}
            onChange={handleChange}
            readOnly='readonly'
          />
          <br></br>
          {values.members &&
            <div>
              <Modal.Header>Meeting Members</Modal.Header>
              <Modal.Content style={{ maxHeight: 100, overflow: 'auto' }}>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  {membersList}
                </List>

              </Modal.Content>
              <br></br>
              <Button className='appointment-btn' content='Delete Selected Members' primary onClick={
                () => {
                  if (checked.length == 0) {
                    alert('None Selected');
                    return
                  }
                  for (let i = 0; i < checked.length; i++) {
                    const currentIndex = values.members.indexOf(checked[i]);

                    if (currentIndex !== -1) {
                      values.members.splice(currentIndex, 1);
                      values.deleted_members.push(checked[i]);
                      checked.splice(i--, 1);
                    }
                  }
                  updateMeeting();
                  deleteMembers();
                  console.log(values.members)
                  console.log(checked)

                  setChecked([])

                }


              } /><br></br><br></br><br></br>
            </div>
          }

          <Form.Input
            id='comment'
            icon='lock'
            iconPosition='left'
            label='Meeting Name'
            placeholder='Meeting Name'
            type='text'
            defaultValue={values.comment}
            onChange={handleChange}
          />

          <Button className='appointment-btn' content='Update Meeting' primary onClick={updateMeeting} />
          <Button className='appointment-btn' content='Delete Meeting' primary onClick={deleteMeeting} />
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
      <Modal.Header>Busy Status</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input
            id='date_reserved'
            icon='lock'
            iconPosition='left'
            label='Start Date'
            placeholder='Start Date'
            type='text'
            value={getDate(values.date_reserved)}
            onChange={handleChange}
          />

          <Form.Input
            id='date_end'
            icon='lock'
            iconPosition='left'
            label='End Date'
            placeholder='end_date'
            type='text'
            value={getDate(values.date_end)}
            onChange={handleChange}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen1(false)}>Close</Button>
        <Button onClick={deleteUserBusy}>Delete</Button>
      </Modal.Actions>
    </Modal>
    <Modal
      centered={false}
      open={open2}
      onClose={() => setOpen2(false)}
      onOpen={() => setOpen2(true)}
    >
      <Modal.Header>Busy Status</Modal.Header>
      <Modal.Content>
        <Form>
        <Form.Input
            id='room_name'
            icon='lock'
            iconPosition='left'
            label='Unavailable Room'
            placeholder='Unavailable Room'
            type='text'
            value={window.room_name}
            readOnly='readonly'
            onChange={handleChange}
          />
          <Form.Input
            id='date_reserved'
            icon='lock'
            iconPosition='left'
            label='Start Date'
            placeholder='Start Date'
            type='text'
            value={getDate(values.date_reserved)}
            readOnly='readonly'
            onChange={handleChange}
          />

          <Form.Input
            id='date_end'
            icon='lock'
            iconPosition='left'
            label='End Date'
            placeholder='end_date'
            type='text'
            value={getDate(values.date_end)}
            readOnly='readonly'
            onChange={handleChange}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen2(false)}>Close</Button>
        <Button onClick={deleteRoomBusy}>Delete</Button>
      </Modal.Actions>
    </Modal>
  </Container>


}
export default Schedule;
