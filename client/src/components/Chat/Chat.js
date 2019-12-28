// useState is for React-Hook
// useEffect is for lifecycle method inside hooks
import React, { useState, useEffect } from "react";
// used for retriving information from query url
import queryString from 'query-string';
import io from "socket.io-client";

import './Chat.css';

// we will pass data inside it
let socket;

const Chat = ({ location }) =>{
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  // in production code, change this to the host address
  const ENDPOINT = 'localhost:5000';

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



  return(
    <h1>Chat</h1>
  )
}

export default Chat;
