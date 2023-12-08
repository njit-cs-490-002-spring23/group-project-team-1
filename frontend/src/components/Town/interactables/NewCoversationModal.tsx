import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useInteractable } from '../../../classes/TownController';
import { ConversationArea } from '../../../generated/client';
import useTownController from '../../../hooks/useTownController';
import fetch from 'node-fetch';
import Time from './time'; //
import { Chessboard } from 'react-chessboard'; //https://medium.com/@ryangregorydev/creating-a-chessboard-app-in-react-3fd9e2b2f6a6
import {Chess} from 'chess.js';
//import chessboard from 'chessboardjsx'; // npm install --save chessboardjsx chess.js
//import Chess from '../../../../../townService/src/town/chess/chess_backend/chess_app';
import Database from '../../../../../townService/src/town/chess/database/database';
//const chess = new Chess()
export default function NewConversationModal(): Promise<JSX.Element> {
  // const currentleaderboard: { [username: string]: any } = leaderboardElo;
  const coveyTownController = useTownController();
  const newConversation = useInteractable('conversationArea');
  const [topic, setTopic] = useState<string>('');
  const [showTimer, setShowTimer] = useState(false);
  const [showChess, setShowChess] = useState(false);
  const [currentleaderboard, setLeaderboard] = useState({});
 // const [currentFen, setFen] = useState({});
  const chess = useMemo(() => new Chess(), []); // <- 1
  const [fen, setFen] = useState("start"); // <- 2
  const [over, setOver] = useState("");
  //const db = new Database();
  //const currentleaderboard = db.db_getAllELO();
const [isInitialized, setIsInitialized] = useState(false);

useEffect(() => {
  if (!isInitialized) {
    fetch('http://localhost:5757/initialize/?player1=1&player2=2', {
      method: 'POST',
    })
    .then(res => res.json())
    .then(data => {
      if (typeof data === 'string') { // Replace 'string' with the actual expected type
        setFen(data);
        setIsInitialized(true);
        console.log("game is now initialized!!!")
      } // Set the initial state of the game
      // Mark as initialized
      //setIsInitialized(true);
    });
  }
  const fen = chess.fen();
  setFen(fen); // update fen state to trigger a re-render
  fetch('http://localhost:5757/fen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fen:fen })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    console.log('FEN posted successfully:', data);
  })
  .catch(error => {
    console.error('Error posting FEN:', error);
  });


}, []); 
  function onDrop(sourceSquare: any, targetSquare: any) {

    const moveData = {
      from: sourceSquare,
      to: targetSquare,
      color: chess.turn(),
      promotion: "q", // promote to queen where possible
    };

    const move = makeAMove(moveData);

    // illegal move
    if (move === null) return false;
    
    return true;
  }
  const makeAMove = useCallback(
    (move) => {
      try {
        const result = chess.move(move); // update Chess instance
        const fen = chess.fen();
        setFen(fen); // update fen state to trigger a re-render
        fetch('http://localhost:5757/fen', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ fen:fen })
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          console.log('FEN posted successfully:', data);
        })
        .catch(error => {
          console.error('Error posting FEN:', error);
        });
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
      } // null if the move was illegal, the move object if the move was legal
    },
    [chess, fen] // Include 'fen' in the dependency array
  );
  
  const isOpen = newConversation !== undefined;

  useEffect(() => {
    if (newConversation) {
      coveyTownController.pause();
    } else {
      coveyTownController.unPause();
    }
  }, [coveyTownController, newConversation]);
/*
  useEffect(() => {
    fetch('http://localhost:3001/leaderboard', {
      method: 'GET',
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data);
        //setLeaderboard(data);
      });
  }, []);
  
 
*/

useEffect(() => {
  if (isInitialized) {
    fetch('http://localhost:5757/fen', {
      method: 'GET',
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      // Check if 'data' is an object and stringify it
      if (typeof data === 'object' && data !== null) {
        const dataString = JSON.stringify(data);
        setFen(dataString);
      } else if (typeof data === 'string') {
        setFen(data);
      } else {
        // Handle other types of data or error
        console.error('Data is not an object or string');
      }
    });
  }
}, []);

  const closeModal = useCallback(() => {
    if (newConversation) {
      coveyTownController.interactEnd(newConversation);
    }
  }, [coveyTownController, newConversation]);

  const toast = useToast();


  const createConversation = useCallback(async () => {
    if (topic && newConversation) {
      const conversationToCreate: ConversationArea = {
        topic: 'chess',
        id: newConversation.name,
        occupantsByID: [],
      };
      try {
        await coveyTownController.createConversationArea(conversationToCreate);
        toast({
          title: 'Conversation Created!',
          status: 'success',
        });
        setTopic('chess');
        coveyTownController.unPause();
      } catch (err) {
        if (err instanceof Error) {
          toast({
            title: 'Unable to create conversation',
            description: err.toString(),
            status: 'error',
          });
        } else {
          console.trace(err);
          toast({
            title: 'Unexpected Error',
            status: 'error',
          });
        }
      }
    }
  }, [topic, setTopic, coveyTownController, newConversation, closeModal, toast]);
  // const currentleaderboard = {
  //   'ahmed': 2000,
  //   'deepblue': 300,
  //   'roblox': 3405,
  //   'roblox lover': 1000,
  // };

  // Your routes go here

  
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