import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { Chess, validateFen } from 'chess.js';
import React, { useCallback, useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import ReactSlider from 'react-slider';
import { useInteractable } from '../../../classes/TownController';
import useTownController from '../../../hooks/useTownController';
import Time from './time';

export default function NewGameModal(): JSX.Element {
  const baseURL = 'http://localhost:5757';
  const [sliderValue, setSliderValue] = useState(300); // Initialize with the minimum value
  const handleSliderChange = (value: React.SetStateAction<number>) => {
    setSliderValue(value);
  };
  // const currentleaderboard: { [username: string]: any } = leaderboardElo;
  const coveyTownController = useTownController();
  const newGameModal = useInteractable('gameArea');
  const [showTimer, setShowTimer] = useState(false);
  const [showChess, setShowChess] = useState(false);
  const [currentleaderboard, setLeaderboard] = useState({});
  // const [currentFen, setFen] = useState({});
  const chess = new Chess(); // <- 1
  const [fen, setFen] = useState('start'); // <- 2
  const [stockfishFlag, setstockfishFlag] = useState(false); // <- 2
  const [over, setOver] = useState('Not Over');
  const [inputFen, setInputFen] = useState('');
  const [history, setHistory] = useState({});
  const [list, setList] = useState();
  const [inHistory, setInHistory] = useState(false);
  const [winner, setWinner] = useState('');

  let turn;
  const saveSliderValue = () => {
    // Assuming you have a state variable to hold the slider value
    console.log('Saving slider value:', sliderValue);
    // Implement the logic to save the slider value
    setstockfishFlag(true);
  };
  const disableStock = () => {
    // Assuming you have a state variable to hold the slider value
    console.log('stockfish is off');
    // Implement the logic to save the slider value
    setstockfishFlag(false);
  };

  useEffect(() => {
    fetch(
      `http://localhost:5757/initialize/?player1=${coveyTownController.ourPlayer.id}&player2=2`,
      {
        method: 'POST',
      },
    )
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(error => {
        console.error('Error initializing game:', error);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(async () => {
      fetch(`${baseURL}/fen`)
        .then(res => res.json())
        .then(data => {
          if (data.fen !== fen) setFen(data.fen);
          console.log(data.fen);
        })
        .catch(error => {
          console.error('Error fen:', error);
        });

      if (over === 'Not Over') {
        const isOver = (await axios.get(`${baseURL}/reason`)).data;
        setOver(isOver.reason);
        console.log(`Over: ${over}`);
      }
      if (winner === '' || !winner) {
        const getWinner = (await axios.get(`${baseURL}/winner`)).data;
        setWinner(getWinner.winner);
        console.log(getWinner);
        console.log(`WINNER IN PER SECOND CALL: ${winner}`);
      }
    }, 1000);
  }, []);

  function matchMove(
    piece: string,
    move: string,
    moveList: string[],
    moveFrom: string,
    moveTo: string,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    fen: string,
    color: string,
  ): string {
    if (moveList.includes(move)) return move;
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
      } else if (color === 'b') {
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
    } else if (piece === 'P') {
      console.log('Pawn');
      console.log(`${move}`);
      for (let i = 0; i < moveList.length; i++) {
        const tempMove = moveList[i];

        // eslint-disable-next-line no-useless-escape
        if (tempMove.match(`^${moveFrom.slice(0, 1)}?x?${moveTo}(\=Q)?[+#]?`)) {
          console.log(`Found! ${move}`);
          console.log(`Found! ${tempMove}`);
          if (tempMove.includes('=')) return tempMove.replace('N', 'Q');
          return tempMove;
        }
      }
    }
    return move;
  }

  async function stockfishMove(currfen: string) {
    const initResponse = (await axios.post(`${baseURL}/stockfishinit/${sliderValue}`)).data;
    if (initResponse.status !== 200) console.log('Error!');

    console.log(`Init Response (83): ${initResponse}`);

    // let {move} = (await axios.get(`${baseURL}/stockfishmove`, {data: {fen: currfen} })).data;
    // console.log(move);
    //let moveResponse = await axios.get(`${baseURL}/stockfishmove`, {fen: currfen} );

    let newFen: string;
    newFen = 'abc';

    await axios
      // eslint-disable-next-line object-shorthand
      .post(`${baseURL}/stockfishmove`, { data: { fen: currfen } })
      .then(response => response.data)
      // eslint-disable-next-line no-return-assign
      .then(data => (newFen = data.move))
      .catch(e => console.log(e));

    console.log(`This is newFen (100): ${newFen}`);

    await axios
      // eslint-disable-next-line object-shorthand
      .post(`${baseURL}/load`, { fen: newFen })
      .then(response => response.data)
      // eslint-disable-next-line no-return-assign
      .then(data => console.log(`Loaded ${newFen}`))
      .catch(e => console.log(e));
    //const moveResponse = await axios.post(`${baseURL}/move/${move}/?color=b`);

    setFen(newFen);
  }

  async function onDrop(sourceSquare: any, targetSquare: any) {
    if (over !== 'Not Over') {
      console.log(over);

      const getWinner = (await axios.get(`${baseURL}/winner`)).data;
      console.log(getWinner);
      setWinner(getWinner.winner);
      console.log(`WINNER: ${winner}`);
      console.log(
        `TERINARY CHECK: ${winner === coveyTownController.ourPlayer.id ? 'WHITE' : 'BLACK'}`,
      );

      return;
    }
    console.log(fen);
    const moveData = {
      from: sourceSquare,
      to: targetSquare,
      color: chess.turn(),
      promotion: 'q', // promote to queen where possible
    };
    console.log(moveData.color, 'move data color');
    //const move = makeAMove(moveData);
    const pieceResponse = await axios.get(`${baseURL}/piece/${moveData.from}`);
    const pieceData = pieceResponse.data;
    const piece = pieceData.piece.toUpperCase();

    const { moves } = (await axios.get(`${baseURL}/moves`)).data;
    console.log(`MOVES!!!!!!!!!!!!!!!! ${moves}`);

    let move = piece === 'P' ? `${moveData.to}` : `${piece}${moveData.to}`;

    console.log(`Before ${move}`);
    move = matchMove(piece, move, moves, moveData.from, moveData.to, fen, pieceData.color);
    console.log(`After ${move}`);

    //const move = `${moveData.to}`;
    // illegal move
    if (move === null) return false;
    //setFen(chess.fen());
    if (!stockfishFlag) {
      const turnResponse = await axios.get(`${baseURL}/turn`);
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
      move = move.slice(0, move.length - 1);
    }
    console.log(move);

    const turnResponse = await axios.get(`${baseURL}/turn`);
    if (turnResponse.data.code !== 200) {
      console.error('Error getting turn:', turnResponse.data);
      return false;
    }
    console.log(`Turn: ${turnResponse.data.turn}`);
    const moveResponse = await axios.post(`${baseURL}/move/${move}/?color=${turn}`);

    console.log(moveResponse);
    if (moveResponse.data.code !== 200) {
      console.error('Error making move:', moveData.color);
      return false;
    }

    const newFen = await axios.get(`${baseURL}/fen`);
    console.log(newFen.data.fen);
    setFen(newFen.data.fen);
    //let newFen = chess.fen();
    //setFen(newFen);
    //fen=newFen;
    //console.log(`NEW FEN for real: ${newFen}`);
    if (stockfishFlag) {
      await stockfishMove(newFen.data.fen);
    }

    // const isOver = (await axios.get(`${baseURL}/reason`)).data;
    // setOver(isOver.reason);
    // console.log(`Over: ${over}`);

    return true;
  }
  // const makeAMove = useCallback(
  //    (move) => {
  //     try {
  //       const result = chess.move(move);
  //      //chess.move(move); // update Chess instance
  //     //fen=chess.fen(); // chess.move(move);
  //       console.log("over, checkmate", chess.isGameOver(), chess.isCheckmate());
  //       if (chess.isGameOver()) { // check if move led to "game over"
  //         if (chess.isCheckmate()) { // if reason for game over is a checkmate
  //           // Set message to checkmate.
  //           setOver(
  //             `Checkmate! ${chess.turn() === "w" ? "black" : "white"} wins!`
  //           );
  //           // The winner is determined by checking which side made the last move
  //         } else if (chess.isDraw()) { // if it is a draw
  //           setOver("Draw"); // set message to "Draw"
  //         } else {
  //           setOver("Game over");
  //         }
  //       }
  //       return result;
  //     } catch (e) {
  //       return null;
  //     }
  //      // null if the move was illegal, the move object if the move was legal
  //   },
  //   [] // Include 'fen' in the dependency array
  // );

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    console.log(validateFen(inputFen).ok);
    if (!validateFen(inputFen).ok) return;

    await axios
      // eslint-disable-next-line object-shorthand
      .post(`${baseURL}/load`, { fen: inputFen })
      .then(response => response.data)
      // eslint-disable-next-line no-return-assign
      .then(data => console.log(`Loaded ${inputFen}`))
      .catch(e => console.log(e));
    //const moveResponse = await axios.post(`${baseURL}/move/${move}/?color=b`);

    setFen(inputFen);
  };

  const historyFunc = async (event: any) => {
    console.log(`In historyFunc!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
    if (!Object.keys(history).length && over !== 'Not Over') {
      await axios
        .get(`${baseURL}/history`)
        .then(res => res.data)
        .then(hist => setHistory(hist.history))
        .catch(e => console.log(e));
    }
    console.log(history);
  };

  const loadHist = async (event: any) => {
    console.log('YES HI HELLO');
    const histFen = event.target.value;
    console.log(histFen);
    setInputFen(histFen);
    handleSubmit(event);
    setInHistory(true);

    const initResponse = (await axios.post(`${baseURL}/stockfishinit/3000`)).data;
    if (initResponse.status !== 200) console.log('Error!');
    console.log(`INIT RESPONSE: ${initResponse}`);
    console.log(`INPUTFEN ${inputFen}`);
    await axios
      .post(`${baseURL}/stockfishreal`, { data: { fen: inputFen } })
      .then(res => res.data)
      .then(data => {
        console.log(`DATA.REALMOVE: ${data.realMove}`);
        setList(data.realMove);
      })
      .catch(e => console.log(e));
    console.log(`LIST ${list}`);
  };

  const newGame = async (event: any) => {
    fetch(
      `http://localhost:5757/initialize/?player1=${coveyTownController.ourPlayer.id}&player2=2&force=true`,
      {
        method: 'POST',
        body: JSON.stringify({ msg: 'force' }),
      },
    )
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(error => {
        console.error('Error initializing game:', error);
      });
    setHistory({});
    setInHistory(false);
  };

  const isOpen = newGameModal !== undefined;
  useEffect(() => {
    if (newGameModal) {
      coveyTownController.pause();
    } else {
      coveyTownController.unPause();
    }
  }, [coveyTownController, newGameModal]);

  const closeModal = useCallback(() => {
    if (newGameModal) {
      coveyTownController.interactEnd(newGameModal);
    }
  }, [coveyTownController, newGameModal]);

  const toast = useToast();

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
            <th style={{ textAlign: 'center' }}>Username</th>
            <th style={{ textAlign: 'center' }}>Elo</th>
          </tr>
          {Object.entries(currentleaderboard).map(([playerName, elo]) => (
            <tr role='row' key={playerName}>
              <td role='gridcell' style={{ textAlign: 'center' }}>
                {playerName}
              </td>
              <td role='gridcell' style={{ textAlign: 'center' }}>
                {elo}
              </td>
            </tr>
          ))}
        </table>
        <Button onClick={() => setShowTimer(!showTimer)}>Toggle Timer</Button>
        {showTimer && <Time />}
        <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center' }}>
          <table>
            <tr style={{ textAlign: 'center' }}>
              <th>
                <Button onClick={saveSliderValue} style={{ display: 'block', marginTop: '10px' }}>
                  Start A.I. game
                </Button>
              </th>
              <th>
                <Button onClick={disableStock} style={{ display: 'block', marginTop: '10px' }}>
                  Start human game
                </Button>
              </th>
            </tr>
            <tr style={{ textAlign: 'center' }}>
              <th>
                {' '}
                <p>Set A.I. Elo</p>{' '}
              </th>
              <th>
                <ReactSlider
                  className='horizontal-slider'
                  marks
                  markClassName='example-mark'
                  min={300}
                  max={3000}
                  step={50}
                  thumbClassName='example-thumb'
                  trackClassName='example-track'
                  value={sliderValue}
                  onChange={handleSliderChange}
                  renderThumb={(props, state) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: '12px',
                        width: '12px',
                        backgroundColor: '#000',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}>
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '-25px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          color: 'black',
                          fontSize: '12px',
                        }}>
                        {state.valueNow}
                      </div>
                    </div>
                  )}
                  renderTrack={(props, state) => (
                    <div {...props} style={{ ...props.style, backgroundColor: 'red', height: '10px' }} />
                  )}
                />
              </th>
            </tr>
          </table>
        </div>
        <Button onClick={newGame}>Start New Game</Button>
        <Chessboard position={fen} onPieceDrop={onDrop} autoPromoteToQueen={true} />

        <div>
          <form onSubmit={handleSubmit}>
            <input
              type='text'
              placeholder='Enter FEN String'
              value={inputFen}
              onChange={e => setInputFen(e.target.value)}
            />
          </form>
          {over === 'Not Over' ? '' : over}
          <br></br>
          {inHistory ? `Stockfish Top Move: ${list}` : ''}
          <br></br>
          <button
            onClick={historyFunc}
            style={{ display: 'block', marginTop: '10px', textAlign: 'center' }}>
            History:
          </button>
          {
            // eslint-disable-next-line prettier/prettier
            Object.keys(history).length
              ? Object.keys(history).map((key, index) => (
                  <button
                    key={index}
                    value={history[key]}
                    onClick={loadHist}
                    style={{ display: 'block', fontSize: 14 }}>
                    {' '}
                    {`${key}: ${history[key].split(' ')[0]}`}{' '}
                  </button>
                ))
              : ''
          }
        </div>
      </ModalContent>
    </Modal>
  );
}
