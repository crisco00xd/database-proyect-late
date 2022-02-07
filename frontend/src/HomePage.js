import React, {Component, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Divider, Form, Grid, Header, Modal, Segment, Tab} from 'semantic-ui-react';
import './HomePage.css'
import setIsAuth from "./UserView"

function HomePage() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    console.log(open);
    
    const handleChange = e => {
        const { name, value } = e.target;
        setValues({
          ...values,
          [name]: value
        });
      };

    const [values, setValues] = useState({
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        email: '',
        rank_id: ''
    });

    const createUser = (e) => {
        window.login = false
        var axios = require('axios');

        values.email = document.getElementById('email').value
        values.password = document.getElementById('password').value
        values.first_name = document.getElementById('first_name').value
        values.last_name = document.getElementById('last_name').value
        values.rank_id = document.getElementById('rank_id').value
        window.values1 = values
        var data = JSON.stringify(values);
        console.log(data)

        var config = {
          method: 'POST',
          url: 'http://localhost:5000/create-user',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : data
        };
        
        axios(config)
        .then(function (response) {
         window.user_info = response.data['user'];
          if(response.data){
              alert("USER CREATED! " +
                  "Please Log In")
              navigate('/');
          }
        })
        .catch(function (error) {
          console.log(error);
        });

    }

    const login = (e) => {
        window.login = false
        var axios = require('axios');

        values.email = document.getElementById('email').value
        values.password = document.getElementById('password').value

        window.values1 = values

        var data = JSON.stringify(values);

        var config = {
          method: 'POST',
          url: 'http://localhost:5000/login',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : data
        };
        
        axios(config)
        .then(function (response) {
          window.user_info = response.data['user'];
          console.log(window.user_info)
          if(response.data['user']['user_id']){
              alert("Your User ID is: " + response.data['user']['user_id'])
              console.log("Logged_in");
              window.login = true
              navigate('/UserView');
          }
        })
        .catch(function (error) {
          console.log(error);
        });

    }


    return (<Segment><Header dividing textAlign="center" size="huge">Welcome UPRM Booking</Header>
            <Modal
                centered={false}
                open={open}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
            >
                <Modal.Header>Needs changing!</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        This is a modal but it serves to show how buttons and functions can be implemented.
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => setOpen(false)}>OK</Button>
                </Modal.Actions>
            </Modal>
            <Segment placeholder>

                <Grid columns={2} relaxed='very' stackable>
                    <Grid.Column>
                        <Form>
                            <Form.Input
                                id = 'email'
                                icon='user'
                                iconPosition='left'
                                label='email'
                                placeholder='email'
                                type='email'
                                onChange = {handleChange}
                            />
                            <Form.Input
                                id = 'password'
                                icon='lock'
                                iconPosition='left'
                                label='Password'
                                type='password'
                                onChange = {handleChange}
                            />
                            <Button className='login-btn' content='Login' primary onClick={login}/>
                        </Form>
                    </Grid.Column>
                    <Grid.Column verticalAlign='middle'>
                    <Form>
                            <Form.Input
                                id = 'first_name'
                                icon='user'
                                iconPosition='left'
                                label='first_name'
                                placeholder='first_name'
                                onChange = {handleChange}
                            />
                            <Form.Input
                                id = 'last_name'
                                icon='lock'
                                iconPosition='left'
                                label='last_name'
                                onChange = {handleChange}
                            />
                            <Form.Input
                                id = 'rank_id'
                                icon='lock'
                                iconPosition='left'
                                label='Rank (0 = admin, 1 = Student, 2 = Professor, 3 = Department_staff)'
                                onChange = {handleChange}
                            />
                        </Form>
                        <Button content='Sign up' icon='signup' size='big' onClick={createUser}/>
                    </Grid.Column>
                </Grid>

                <Divider vertical>Or</Divider>
            </Segment>
        </Segment>
    )
}


export default HomePage;
