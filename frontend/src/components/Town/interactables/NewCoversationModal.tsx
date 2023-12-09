import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useInteractable } from '../../../classes/TownController';
import useTownController from '../../../hooks/useTownController';
import Time from './time'; //
import { Chessboard } from 'react-chessboard'; //https://medium.com/@ryangregorydev/creating-a-chessboard-app-in-react-3fd9e2b2f6a6
import {Chess} from 'chess.js';
import axios from 'axios';
export default function NewConversationModal(): Promise<JSX.Element> {
 

const BASEURL = 'http://localhost:5757';
  // const currentleaderboard: { [username: string]: any } = leaderboardElo;
  const coveyTownController = useTownController();
  const newConversation = useInteractable('conversationArea');
  const [topic, setTopic] = useState<string>('');
  const [showTimer, setShowTimer] = useState(false);
  const [showChess, setShowChess] = useState(false);
  const [currentleaderboard, setLeaderboard] = useState({});
 // const [currentFen, setFen] = useState({});
  let chess = new Chess(); // <- 1
  let [fen, setFen] = useState("start"); // <- 2
  const [over, setOver] = useState("");
  let turn:string;
useEffect(() => {
  fetch('http://localhost:5757/initialize/?player1=1&player2=2', {
    method: 'POST',
  })
  .then(res => res.json())
  .catch(error => {
    console.error('Error initializing game:', error);
  });
  
}, []);
  async function onDrop(sourceSquare: any, targetSquare: any) {

    const moveData = {
      from: sourceSquare,
      to: targetSquare,
      color: chess.turn(),
      promotion: "q", // promote to queen where possible
    };
    console.log(moveData.color, "move data color");
    const move = makeAMove(moveData);

    // illegal move
    if (move === null) return false;
    //let fen:string = chess.fen();
    //setFen(fen);
    setFen(chess.fen());
    const turnResponse = await axios.get(`${BASEURL}/turn`);
    if (turnResponse.data.code !== 200) {
      console.error('Error getting turn:', turnResponse.data);
      return false;
    }
    turn = turnResponse.data;
    console.log(turn);
    const moveResponse = await axios.post(`${BASEURL}/move/${move}/?color=${turn}`);

    if (moveResponse.data.code !== 200) {
      console.error('Error making move:', moveData.color);
      return false;
    }
    //let newFen = chess.fen();
    //setFen(newFen);    
    //fen=newFen;
    //console.log(`NEW FEN for real: ${newFen}`);
    
    return true;
  }
  const makeAMove = useCallback(
     (move) => {
      try {
        const result = chess.move(move);
       //chess.move(move); // update Chess instance
      //fen=chess.fen(); // chess.move(move);
        console.log("over, checkmate", chess.isGameOver(), chess.isCheckmate());
        
        if (chess.isGameOver()) { // check if move led to "game over"
          if (chess.isCheckmate()) { // if reason for game over is a checkmate
            // Set message to checkmate. 
            setOver(
              `Checkmate! ${chess.turn() === "w" ? "black" : "white"} wins!`
            ); 
            // The winner is determined by checking which side made the last move
          } else if (chess.isDraw()) { // if it is a draw
            setOver("Draw"); // set message to "Draw"
          } else {
            setOver("Game over");
          }
        }
  
        return result;
      } catch (e) {
        return null;
      }
       // null if the move was illegal, the move object if the move was legal
    },
    [] // Include 'fen' in the dependency array
  );
  
  const isOpen = newConversation !== undefined;

  useEffect(() => {
    if (newConversation) {
      coveyTownController.pause();
    } else {
      coveyTownController.unPause();
    }
  }, [coveyTownController, newConversation]);

  const closeModal = useCallback(() => {
    if (newConversation) {
      coveyTownController.interactEnd(newConversation);
    }
  }, [coveyTownController, newConversation]);
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        closeModal();
        coveyTownController.unPause();
      }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> LeaderBoard </ModalHeader>
        <ModalCloseButton />
        <table>
          <tr>
            <th style={{textAlign: 'center'}}>Username</th>
            <th style={{textAlign: 'center'}}>Elo</th>
          </tr>
          {Object.entries(currentleaderboard).map(([playerName, elo]) => (
            <tr role='row' key={playerName}>
              <td role='gridcell' style={{textAlign: 'center'}}>{playerName}</td>
              <td role='gridcell' style={{textAlign: 'center'}}>{elo}</td>
            </tr>
          ))}
        </table>
        <Button onClick={() => setShowTimer(!showTimer)}>Toggle Timer</Button>
        {showTimer && <Time />}
    <Button onClick={() => setShowChess(!showChess)}>start chess</Button>
    <Chessboard position={fen} onPieceDrop={onDrop} />;
      </ModalContent>
    </Modal>
  );  
}
