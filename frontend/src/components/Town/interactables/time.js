import React, { useState, useEffect } from "react";
import styled from "styled-components";
import fetch from 'node-fetch';
//basic timer
import axios from 'axios';

//TODO - add turns to switch countdown, add winner call if a timer hits 0
const theme = {
  blue: {
    default: "#3f51b5",
    hover: "#283593"
  },
};
//buttons design
const Button = styled.button`
  background-color: ${(props) => theme[props.theme].default};
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  outline: 0;
  text-transform: uppercase;
  margin: 10px 0px;
  cursor: pointer;
  box-shadow: 0px 2px 2px lightgray;
  transition: ease background-color 250ms;
  &:hover {
    background-color: ${(props) => theme[props.theme].hover};
  }
  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`;

Button.defaultProps = {
  theme: "blue"
};
//white timer
const TimerW = ({ minutes = 0, seconds = 0 }) => {
  if (minutes === 0 && seconds === 0) {
    console.log('TimerW has reached 0:00');
  }

  return (
    <div>
      {minutes > 10 ? "∞" : `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
    </div>
  );
};
//black timer
const TimerB = ({ minutes = 0, seconds = 0 }) => {
  return (
    <div>
      {minutes > 10 ? "∞" : `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
    </div>
  );
};
//base line timer
const Time = () => {
  const [delayW, setDelayW] = useState(180); // White timer delay
  const [delayB, setDelayB] = useState(180); // Black timer delay
  const [isRunning, setIsRunning] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('w'); // Track the current turn

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(async () => {
        // Fetch the current turn from the server
        const BASEURL = 'http://localhost:5757';
        const turnResponse = await axios.get(`${BASEURL}/turn`);
        if (turnResponse.data.code !== 200) {
          console.error('Error getting turn:', turnResponse.data);
          return false;
        }
        console.log(turnResponse.data.turn);

       
        setCurrentTurn(turnResponse.data);
        currentTurn=turnResponse.data.turn;
       

        // Update the timer based on the current turn
        if (currentTurn === 'w' && delayW > 0) {
          setDelayW(delayW - 1);
        } else if (currentTurn === 'b' && delayB > 0) {
          setDelayB(delayB - 1);
        }
        if (delayW === 0 ) {
          clearInterval(timer);
          setIsRunning(false);
          console.log('Timer has stopped because white time reached 0:00');
          await axios.post(`${BASEURL}/concede/:w`)
        }
        if (delayB === 0 ) {
          clearInterval(timer);
          setIsRunning(false);
          console.log('Timer has stopped because  black time reached 0:00');
          await axios.post(`${BASEURL}/concede/:b`)
        }
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [delayW, delayB, isRunning, currentTurn])
//delay for adding and subtracting minutes
  function add() {
    setDelayW(delayW + 60);
    setDelayB(delayB + 60);

    if( delayW>=600 && delayW< 1000 ){
      setDelayW(delayW + 9999999999999999999)
      setDelayB(delayB + 9999999999999999999)

    }
   else if( delayW>=1000 ){
      setDelayW(60)
      setDelayB(60)

    }
  }

  function minus() {
    setDelayW(delayW - 60);
    setDelayB(delayB - 60);
    if( delayW<=60){
      setDelayW(delayW + 9999999999999999999)
      setDelayB(delayB + 9999999999999999999)
    }
   else if( delayW>=1000 ){
      setDelayW(600)
      setDelayB(600)
    }
  }

  function starttime() {
    setIsRunning(true);
  }

  function pausetime() {
    setIsRunning(false);
  }

  function resettime() {
    setIsRunning(false);
    setDelayW(180);
    setDelayB(180);
  }

  const minutesW = Math.floor(delayW / 60);
  const secondsW = delayW % 60;
  const minutesB = Math.floor(delayB / 60);
  const secondsB = delayB % 60;
//display buttons and times

  return (
    <div>
      <div>
        <Button onClick={starttime}>Start</Button>
        <Button onClick={pausetime}>Pause</Button>
        <Button onClick={resettime}>Reset</Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '0px' , border: '1px solid black', backgroundColor: 'black' }}>
        <div style={{ border: '1px solid black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', padding: '0px' }}>
          <p>White Timer</p>
          <div style={{ height: '1px', width: '100%', backgroundColor: 'black' }} />
          <div>
            <TimerW minutes={minutesW} seconds={secondsW} />
          </div>
        </div>
        <div style={{ border: '1px solid black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', padding: '0px' }}>
          <p>Black Timer</p>
          <div style={{ height: '1px', width: '100%', backgroundColor: 'black' }} />
          <div>
            <TimerB minutes={minutesB} seconds={secondsB} />
          </div>
        </div>
      </div>
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '0px' }}>
  <Button id="minusButton" onClick={minus} disabled={isRunning}>-</Button>
  <Button id="addButton" onClick={add} disabled={isRunning}>+</Button>
</div>
    </div>
  );
};

export default Time;
