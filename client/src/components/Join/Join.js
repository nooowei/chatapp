import React, { useState } from 'react';
import { Link } from "react-router-dom";

const Join = () =>{
  // use React-Hook to set initial state of form fields to blank
  // these function coorespond to the values user input
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  // monitors text box change, and set values dynamically
  // Link bottom sends user to the chat page using a query string
  // if either no name or no room, prevent user from doing anything
  return(
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Join</h1>
        <div>
          <input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <input placeholder="Room" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)} />
        </div>
        <Link onClick={event => (!name || !room) ? event.preventDefault() : null} to={`/chat?name=${name}&room=${room}`}>
          <button className={'button mt-20'} type="submit">Sign In</button>
        </Link>
      </div>
    </div>
  )
}

export default Join;
