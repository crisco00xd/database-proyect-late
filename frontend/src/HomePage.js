import React, {Component, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Divider, Form, Grid, Header, Modal, Segment, Tab} from 'semantic-ui-react';
import './HomePage.css'
import setIsAuth from "./UserView"
import validator from 'validator'
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

        values.email = document.getElementById('email1').value
        values.password = document.getElementById('password1').value
        values.first_name = document.getElementById('first_name').value
        values.last_name = document.getElementById('last_name').value
        values.rank_id = document.getElementById('rank_id').value

        if(values.email === '' || values.password === '' || values.first_name === '' || values.last_name === '' || values.rank_id === ''){
            console.log(values)
            alert("Blank Username or Password! \n\n Please Try Again");
            return;
        }

        if(document.getElementById('rank_id').value > 3 || document.getElementById('rank_id').value < 0){
            alert('Rank not valid');
            return;
        }

        if (validator.isEmail(values.email)){}
        else {
            alert('Email is not Valid!');
            return;
        }

        window.values1 = values
        var data = JSON.stringify(values);
        console.log(data)

        var config = {
          method: 'POST',
          url: 'https://cristian-solo-db-proyect.herokuapp.com/create-user',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : data
        };
        
        axios(config)
        .then(function (response) {
         window.user_info = response.data['user'];

         if(response.data['reason'] == 'Email Already Exists'){
             alert("Email Already Exists");
             return;
         }
         else{
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
          url: 'https://cristian-solo-db-proyect.herokuapp.com/login',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : data
        };
        
        axios(config)
        .then(function (response) {
            console.log(response)
            if(response.data['reason'] == 'Incorrect email or password.'){
                alert("Wrong Username Or Password \n\n Please Try Again");
              return;
            }
            if(response.data['reason'] == 'Must fill both username and password fields.'){
                console.log(values)
                alert("Blank Username or Password! \n\n Please Try Again");
              return;
            }
          if(window.user_info = response.data['user']){
              console.log("Logged_in");
              window.login = true
              navigate('/UserView');
          }
          console.log(window.user_info)
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
                                icon='mail'
                                iconPosition='left'
                                label='Email'
                                placeholder='Email'
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
                                id = 'email1'
                                icon='mail'
                                iconPosition='left'
                                label='Email'
                                placeholder='email'
                                onChange = {handleChange}
                            />
                            <Form.Input
                                id = 'password1'
                                icon='lock'
                                iconPosition='left'
                                label='password'
                                type='password'
                                onChange = {handleChange}
                            />
                            <Form.Input
                                id = 'first_name'
                                icon='user'
                                iconPosition='left'
                                label='First Name'
                                placeholder='First Name'
                                onChange = {handleChange}
                            />
                            <Form.Input
                                id = 'last_name'
                                icon='user'
                                iconPosition='left'
                                label='Last Name'
                                placeholder='Last Name'
                                onChange = {handleChange}
                            />
                            <Form.Input
                                id = 'rank_id'
                                icon='lock'
                                iconPosition='left'
                                label='Rank (1 = Student, 2 = Professor, 3 = Department Staff)'
                                placeholder='Rank ID'
                                onChange = {handleChange}
                            />
                        </Form>
                        <br></br>
                        <Button content='Sign up' icon='signup' size='big' onClick={createUser}/>
                    </Grid.Column>
                </Grid>

                <Divider vertical>Or</Divider>
            </Segment>
        </Segment>
    )
}


export default HomePage;
