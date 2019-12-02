import React from 'react';
import logo from './logo.svg';
import './App.css';

import useForceUpdate from 'use-force-update';
import { parsePhoneNumberFromString } from 'libphonenumber-js'

// Ways to change

/*

function to cycle through:
adding classes and removing classes

multiple
color change
relocation

re-styling

input at bottom

draw lines
move lines

invert whole

stripes
background: repeating-linear-gradient(
  45deg,
  #606dbc,
  #606dbc 10px,
  #465298 10px,
  #465298 20px
);

*/
// 
function generator(){
  return
}

function generated(){

  const els = []
  return 
}

function Error () {
  return (<div className="error-message">Something went wrong.</div>)
}

function Success () {
  return (<div className="message">Success. Call soon.</div>)
}

function Space () {
  return (
    <>
    <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />

    </>
    )
}

// @observer
function App() {
  const [pop, setPop] = React.useState("place & sound")
  const [fontSize, setFontSize] = React.useState(100)
  const [number, setNumber] = React.useState('')
  const [complete, setComplete] = React.useState(false)
  const [error, setError] = React.useState(false)
  
  function handleWhy(){
    
  }

  function handleJoin(number){
    // post to server
    if (number.substr(0, 1) != 1){
      number = "1" + number
    }
    // str.substr(1, 4)

    // const phoneNumber = parsePhoneNumberFromString(number)
    // console.log(phoneNumber)
  // if (phoneNumber) {

    // fetch('http://localhost:8080/join', 
    fetch('/join', 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({phoneNumber: number})
    })
    .then(async (res) => {
      setComplete(true)
    }).catch((e) => {
      setError(true)
    })
  }
  
  return (
    <div className="App">
      <header className="App-header">
          {/*<span style={{ }}>{pop}</span>*/}
          <span className={"pop"} style={{fontSize: fontSize, top: '15vh'}}>{pop}</span>
          <span className={"pop"} style={{fontSize: fontSize, top: '30vh'}}>{pop}</span>
          <span className={"pop"} style={{fontSize: fontSize, top: '45vh'}}>{pop}</span>
          <Space />
          <p style={{color: 'black', fontSize: "20px"}}>automated call service for dance spots</p>
          <a className="phoneNumber" href="tel:647-556-5651">call >> +16475565651*</a>
          <p style={{color: 'black', fontSize: "20px"}}>or, we'll call you <b>8pm</b> night of, Friday & Saturday.</p>

          {
            complete ? <Success /> : null
          }

          {
            error ? <Error /> : null
          }
          {
            !(complete || error ) ? 
            <>
              <input placeholder="your number" onChange={(e) => {
                setNumber(e.target.value)
              }}/>
              <br/>
              <button className="button" onClick={() => handleJoin(number)}>join</button>
              <p className="disclaimer">*toronto edition, top picks from Resident Advisor with some DIY mix ins. but, <a style={{color: 'blue'}} href="#" onClick={() => setPop("retro. no socials.")}>why?</a></p>
            </>
            : null
          }
      </header>
    </div>
  );
}

export default App;
