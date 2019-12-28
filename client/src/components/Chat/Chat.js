// useState is for React-Hook
// useEffect is for lifecycle method inside hooks
import React, { useState, useEffect } from "react";
// used for retriving information from query url
import queryString from 'query-string';
import io from "socket.io-client";

import './Chat.css';

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

// we will pass data inside it
let socket;

const Chat = ({ location }) =>{
  // these are states which will carry information
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // in production code, change this to the host address
  const ENDPOINT = 'https://weischatapp.herokuapp.com';
  // const ENDPOINT = 'localhost:5000';

  // with React-Hook, we can have as many useEffect as we want
  useEffect(() => {
    // retrive the data which user entered when joining
    // location comes from React-Router, gives us a prop called 'location'
    // location.search will return query string after the ?
    // queryString.parse(location.search) will return a JSON object containing each parameter
    // { name, room } will return the value of name, room
    const { name, room } = queryString.parse(location.search);


    socket = io(ENDPOINT);

    setRoom(room);
    setName(name);

    // passing the 'join' signal, as well as data of name and room
    //  {name, room} is equivalent of {name:name, room:room}
    socket.emit('join', { name, room }, (error) => {
      // this callback function is activated if server sends back an error
      if(error) {
        alert(error);
      }
    });

    return () => {
      socket.emit('disconnect');

      socket.off();
    }
  }, [ENDPOINT, location.search]);
  // the array is the 2nd parameter in useEffect function
  // effect will only activate if the value in array changes
  // otherwise it will not render again
  // this is to address the problem of making the connection twice

  useEffect(() => {
    socket.on('message', (message) => {
      // ES6 syntax, spreading each item in messages array, and add a new message
      setMessages([...messages, message ]);
    });

    socket.on('roomData', ({ users }) => {
      setUsers(users);
    })

    return () => {
      socket.emit('disconnect');

      socket.off();
    }
  }, [messages]); // useEffect will only activate when messages array changes

  // helper function used to send message, and reset the text box
  const sendMessage = (event) => {
    // this prevents whole page refresh, which is activated on keypress
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  // here we are calling the components, and sending data/functions as proerties
  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users}/>
    </div>
    );
  }

export default Chat;
