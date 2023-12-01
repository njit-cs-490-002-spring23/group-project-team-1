import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
//basic timer
//TODO - add turns to switch countdown, add winner call if a timer hits 0
//https://codesandbox.io/p/sandbox/react-buttons-and-tabs-forked-7gz6c7?file=%2Fsrc%2FApp.js%3A80%2C1 basic outline for the code
const theme = {
  blue: {
    default: '#3f51b5',
    hover: '#283593',
  },
};
//buttons design
const Button = styled.button`
  background-color: ${props => theme[props.theme].default};
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
    background-color: ${props => theme[props.theme].hover};
  }
  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`;

Button.defaultProps = {
  theme: 'blue',
};
//white timer
const TimerW = ({ minutes = 0, seconds = 0 }) => {
  return <div>{minutes > 10 ? '∞' : `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</div>;
};
//black timer
const TimerB = ({ minutes = 0, seconds = 0 }) => {
  return <div>{minutes > 10 ? '∞' : `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</div>;
};
//base line timer
const Time = () => {
  const [delay, setDelay] = useState(180);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && delay > 0) {
      timer = setInterval(() => {
        setDelay(delay - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [delay, isRunning]);
  //delay for adding and subtracting minutes
  function add() {
    setDelay(delay + 60);
    if (delay >= 600 && delay < 1000) {
      setDelay(delay + 9999999999999999999);
    } else if (delay >= 1000) {
      setDelay(60);
    }
  }

  function minus() {
    setDelay(delay - 60);
    if (delay <= 60) {
      setDelay(delay + 9999999999999999999);
    } else if (delay >= 1000) {
      setDelay(600);
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
    setDelay(180);
  }

  const minutes = Math.floor(delay / 60);
  const seconds = delay % 60;
  //display buttons and times
  return (
    <div>
      <div>
        <Button onClick={starttime}>Start</Button>
        <Button onClick={pausetime}>Pause</Button>
        <Button onClick={resettime}>Reset</Button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridGap: '0px',
          border: '1px solid black',
          backgroundColor: 'black',
        }}>
        <div
          style={{
            border: '1px solid black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            padding: '0px',
          }}>
          <p>White Timer</p>
          <div style={{ height: '1px', width: '100%', backgroundColor: 'black' }} />
          <div>
            <TimerW minutes={minutes} seconds={seconds} />
          </div>
        </div>
        <div
          style={{
            border: '1px solid black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            padding: '0px',
          }}>
          <p>Black Timer</p>
          <div style={{ height: '1px', width: '100%', backgroundColor: 'black' }} />
          <div>
            <TimerB minutes={minutes} seconds={seconds} />
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '0px' }}>
        <Button id='minusButton' onClick={minus} disabled={isRunning}>
          -
        </Button>
        <Button id='addButton' onClick={add} disabled={isRunning}>
          +
        </Button>
      </div>
    </div>
  );
};

export default Time;
