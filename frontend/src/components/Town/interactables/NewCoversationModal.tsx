import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useInteractable } from '../../../classes/TownController';
import useTownController from '../../../hooks/useTownController';
import Time from './time'; //
import { Chessboard } from 'react-chessboard'; //https://medium.com/@ryangregorydev/creating-a-chessboard-app-in-react-3fd9e2b2f6a6
import {Chess, validateFen} from 'chess.js';
import axios from 'axios';
export default function NewConversationModal(): Promise<JSX.Element> {
 

const BASEURL = 'http://localhost:5757';
const STOCKFISHFLAG: boolean = false;

  // const currentleaderboard: { [username: string]: any } = leaderboardElo;
  const coveyTownController = useTownController();
  const newConversation = useInteractable('conversationArea');
  const [topic, setTopic] = useState<string>('');
  const [showTimer, setShowTimer] = useState(false);
  const [showChess, setShowChess] = useState(false);
  const [currentleaderboard, setLeaderboard] = useState({});
  // const [currentFen, setFen] = useState({});
  let chess = new Chess(); // <- 1
  const [fen, setFen] = useState("start"); // <- 2
  const [over, setOver] = useState('Not Over');
  const [inputFen, setInputFen] = useState('');
  let turn;

useEffect(() => {
  fetch('http://localhost:5757/initialize/?player1=1&player2=2', {
    method: 'POST',
  })
  .then(res => res.json())
  .catch(error => {
    console.error('Error initializing game:', error);
  });
  
}, []);

  function matchMove(piece: string, move: string, moveList: string[], moveFrom: string, moveTo: string, fen: string, color: string): string {
    if (moveList.includes(move)) 
      return move;
    else if (piece === 'K') {
      const fenArray = fen.split(' ');
      const castlingRights = fenArray[2];

      if (color === 'w') {
        if (moveTo === 'c1' && castlingRights.includes('Q') && moveList.includes('O-O-O')) {
          return 'O-O-O';
        }
        if (moveTo === 'g1' && castlingRights.includes('K') && moveList.includes('O-O')) {
          return 'O-O';
        }
      }
      else if (color === 'b') {
        if (moveTo === 'c8' && castlingRights.includes('q') && moveList.includes('O-O-O')) {
          return 'O-O-O';
        }
        if (moveTo === 'g8' && castlingRights.includes('k') && moveList.includes('O-O')) {
          return 'O-O';
        }
      }
    }
    
    if (piece !== 'P') {
      console.log(`${move}`);
      for (let i = 0; i < moveList.length; i++) {
        const tempMove = moveList[i];

        if (tempMove.match(`^${piece}x?${moveTo}[+#]?`)) {
          console.log(`Found! ${move}`);
          console.log(`Found! ${tempMove}`);
          return tempMove;
        }
      }
    }
    else if (piece === 'P') {
      console.log('Pawn');
      console.log(`${move}`);
      for (let i = 0; i < moveList.length; i++) {
        const tempMove = moveList[i];

        if (tempMove.match(`^${moveFrom.slice(0,1)}?x?${moveTo}(\=Q)?[+#]?`)) {
          console.log(`Found! ${move}`);
          console.log(`Found! ${tempMove}`);
          if (tempMove.includes('='))
            return tempMove.replace('N', 'Q');
          return tempMove;
        }
      }
    }
    return move;
  }

  async function stockfishMove(currfen: string) {
    const initResponse = (await axios.post(`${BASEURL}/stockfishinit/3000`)).data;
    if (initResponse.status !== 200) 
      console.log('Error!');

    console.log(`Init Response (83): ${initResponse}`);

    // let {move} = (await axios.get(`${BASEURL}/stockfishmove`, {data: {fen: currfen} })).data;
    // console.log(move);
    //let moveResponse = await axios.get(`${BASEURL}/stockfishmove`, {fen: currfen} );

    let newFen: string;
    newFen = 'abc';

    await axios
    // eslint-disable-next-line object-shorthand
    .post(`${BASEURL}/stockfishmove`, { data: { fen: currfen } })
    .then(response => response.data)
    // eslint-disable-next-line no-return-assign
    .then(data => (newFen = data.move))
    .catch(e => console.log(e));

    console.log(`This is newFen (100): ${newFen}`);

    await axios
    // eslint-disable-next-line object-shorthand
    .post(`${BASEURL}/load`,  { fen: newFen } )
    .then(response => response.data)
    // eslint-disable-next-line no-return-assign
    .then(data => (console.log(`Loaded ${newFen}`)))
    .catch(e => console.log(e));
    //const moveResponse = await axios.post(`${BASEURL}/move/${move}/?color=b`);

    setFen(newFen);
  }

  async function onDrop(sourceSquare: any, targetSquare: any) {
    if (over !== 'Not Over') {
      console.log(over);
      return;
    }
    console.log(fen);
    const moveData = {
      from: sourceSquare,
      to: targetSquare,
      color: chess.turn(),
      promotion: "q", // promote to queen where possible
    };
    console.log(moveData.color, "move data color");
    //const move = makeAMove(moveData);
    const pieceResponse = await axios.get(`${BASEURL}/piece/${moveData.from}`);
    const pieceData = pieceResponse.data;
    const piece = pieceData.piece.toUpperCase();

    const { moves } = (await axios.get(`${BASEURL}/moves`)).data;
    console.log(`MOVES!!!!!!!!!!!!!!!! ${moves}`);

    let move = piece === 'P' ? `${moveData.to}` : `${piece}${moveData.to}`;

    console.log(`Before ${move}`);
    move = matchMove(piece, move, moves, moveData.from, moveData.to, fen, pieceData.color);
    console.log(`After ${move}`);

    //const move = `${moveData.to}`;
    // illegal move
    if (move === null) return false;
    
    //setFen(chess.fen());
    if (!STOCKFISHFLAG) {
      const turnResponse = await axios.get(`${BASEURL}/turn`);
      if (turnResponse.data.code !== 200) {
        console.error('Error getting turn:', turnResponse.data);
        return false;
      }
      turn = turnResponse.data.turn;
    } else {
      turn = 'w';
    }
    console.log(turn);
    console.log(move);
    if (move.match('.+#$')) {
      console.log('Edited');
      move = move.slice(0,move.length - 1);
    }
    console.log(move);

    const turnResponse = await axios.get(`${BASEURL}/turn`);
      if (turnResponse.data.code !== 200) {
        console.error('Error getting turn:', turnResponse.data);
        return false;
      }
    console.log(`Turn: ${turnResponse.data.turn}`);
  
    const moveResponse = await axios.post(`${BASEURL}/move/${move}/?color=${turn}`);

    console.log(moveResponse);
    if (moveResponse.data.code !== 200) {
      console.error('Error making move:', moveData.color);
      return false;
    }

    let newFen = await axios.get(`${BASEURL}/fen`);
    console.log(newFen.data.fen);
    setFen(newFen.data.fen);
    //let newFen = chess.fen();
    //setFen(newFen);    
    //fen=newFen;
    //console.log(`NEW FEN for real: ${newFen}`);
    
    if (STOCKFISHFLAG) {
      await stockfishMove(newFen.data.fen);
    }

    let isOver = (await axios.get(`${BASEURL}/reason`)).data;
    setOver(isOver.reason);
    console.log(`Over: ${over}`);

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

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    console.log(validateFen(inputFen).ok);
    if (!validateFen(inputFen).ok)
      return;

    await axios
    // eslint-disable-next-line object-shorthand
    .post(`${BASEURL}/load`,  { fen: inputFen } )
    .then(response => response.data)
    // eslint-disable-next-line no-return-assign
    .then(data => (console.log(`Loaded ${inputFen}`)))
    .catch(e => console.log(e));
    //const moveResponse = await axios.post(`${BASEURL}/move/${move}/?color=b`);

    setFen(inputFen);
  }

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
    <Chessboard position={fen} onPieceDrop={onDrop} autoPromoteToQueen={true}/>
      <form onSubmit={handleSubmit}>
      <input type='text' placeholder='Enter FEN String' value={inputFen} onChange={(e) => setInputFen(e.target.value)}/>
      </form>
      </ModalContent>
    </Modal>
  );  
}
