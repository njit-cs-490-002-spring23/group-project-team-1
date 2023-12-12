import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import PropTypes from 'prop-types';

//basic timer`
//TODO - add turns to switch countdown, add winner call if a timer hits 0
const theme = {
  blue: {
    default: '#3f51b5',
    hover: '#283593',
  },
};
//buttons design
const divStyle = styled.button`
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

divStyle.defaultProps = {
  theme: 'blue',
};

//base line timer
function useTimer() {
  function TimerW({ minutes = 0, seconds = 0 }) {
    return <div>{minutes > 10 ? '∞' : `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</div>;
  }
  TimerW.propTypes = {
    minutes: PropTypes.number,
    seconds: PropTypes.number,
  };

  //black timer
  function TimerB({ minutes = 0, seconds = 0 }) {
    return <div>{minutes > 10 ? '∞' : `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</div>;
  }
  TimerB.propTypes = {
    minutes: PropTypes.number,
    seconds: PropTypes.number,
  };
  const [delayW, setDelayW] = useState(180); // White timer delay
  const [delayB, setDelayB] = useState(180); // Black timer delay
  const [isRunning, setIsRunning] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('white'); // Track the current turn

  useEffect(async () => {
    let timer;
    const baseURL = 'http://localhost:5757';
    const fenResponse = await axios.get(`${baseURL}/fen`);
        if (fenResponse.data.code !== 200) {
          console.error('Error getting turn:', fenResponse.data);
          return false;
        }
        console.log(fenResponse.fen)
        if (fenResponse.fen !== "rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR b KQkq - 0"){
        setIsRunning(true);
        }
    if (isRunning) {
      timer = setInterval(async () => {
        // Fetch the current turn from the server
        
        
        const turnResponse = await axios.get(`${baseURL}/turn`);
        if (turnResponse.data.code !== 200) {
          console.error('Error getting turn:', turnResponse.data);
          return false;
        }
        console.log(`Turn: ${turnResponse.data.turn}`);
        setCurrentTurn(turnResponse.data.turn);
        // Update the timer based on the current turn
        if (currentTurn === 'w' && delayW > 0) {
          setDelayW(delayW - 1);
        } else if (currentTurn === 'b' && delayB > 0) {
          setDelayB(delayB - 1);
        }

        if (delayW === 0) {
          clearInterval(timer);
          setIsRunning(false);
          console.log('Timer has stopped because white Time reached 0:00');
          await axios.post(`http://localhost:5757/concede/:w`);
        }
        if (delayB === 0) {
          clearInterval(timer);
          setIsRunning(false);
          console.log('Timer has stopped because  black Time reached 0:00');
          await axios.post('http://localhost:5757/concede/:b');
        }
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [delayW, delayB, isRunning, currentTurn]);
  //delay for adding and subtracting minutes
  function add() {
    setDelayW(delayW + 60);
    setDelayB(delayB + 60);

    if (delayW >= 600 && delayW < 1000) {
      setDelayW(delayW + 999999999);
      setDelayB(delayB + 999999999);
    } else if (delayW >= 1000) {
      setDelayW(60);
      setDelayB(60);
    }
  }

  function minus() {
    setDelayW(delayW - 60);
    setDelayB(delayB - 60);
    if (delayW <= 60) {
      setDelayW(delayW + 999999999);
      setDelayB(delayB + 999999999);
    } else if (delayW >= 1000) {
      setDelayW(600);
      setDelayB(600);
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
  return (
    <div>
      <div style={{ display: 'grid', justifyContent: 'center' }}>
        <table>
          <tr>
            <th style={{ padding: '0' }}>
              <button
                onClick={starttime}
                style={{ border: '2px solid #000000', padding: '10px 20px' }}>
                Start
              </button>
            </th>
            <th style={{ padding: '0' }}>
              <button
                onClick={pausetime}
                style={{ border: '2px solid #000000', padding: '10px 20px' }}>
                Pause
              </button>
            </th>
            <th style={{ padding: '0' }}>
              <button
                onClick={resettime}
                style={{ border: '2px solid #000000', padding: '10px 20px' }}>
                Reset
              </button>
            </th>
          </tr>
        </table>
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
            <TimerW minutes={minutesW} seconds={secondsW} />
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
            <TimerB minutes={minutesB} seconds={secondsB} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '0px' }}>
        {!isRunning && (
          <button
            id='minusButton'
            onClick={minus}
            disabled={isRunning}
            style={{ border: '2px solid #000000', padding: '10px 20px' }}>
            -
          </button>
        )}
        {!isRunning && (
          <button
            id='addButton'
            onClick={add}
            disabled={isRunning}
            style={{ border: '2px solid #000000', padding: '10px 20px' }}>
            +
          </button>
        )}
      </div>
    </div>
  );
}

export default useTimer;
