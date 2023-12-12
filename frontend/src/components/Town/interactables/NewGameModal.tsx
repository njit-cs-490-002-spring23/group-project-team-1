import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useToast,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { useInteractable } from '../../../classes/TownController';
import { GameArea } from '../../../generated/client';
import useTownController from '../../../hooks/useTownController';
//import axios from 'axios';

export default function NewGameModal(): JSX.Element {
  const coveyTownController = useTownController();
  const newGame = useInteractable('gameArea');
  const [chosenGame, setChosenGame] = useState<string>('');
  const [game, setGame] = useState(' a Game');
  const [currentUI, setUI] = useState('General');

  const isOpen = newGame !== undefined;
  useEffect(() => {
    if (newGame) {
      coveyTownController.pause();
    } else {
      coveyTownController.unPause();
    }
  }, [coveyTownController, newGame]);

  const closeModal = useCallback(() => {
    if (newGame) {
      setGame(' a Game');
      setChosenGame('');
      coveyTownController.interactEnd(newGame);
    }
  }, [coveyTownController, newGame]);

  const toast = useToast();

  function ChessContent() {
    return (
      <ModalContent display={'flex'} flexDirection='row'>
        <ModalContent>
          <ModalHeader textAlign={'center'}>
            Welcome to chess, {coveyTownController.ourPlayer.userName}!
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Chessboard id='BasicBoard' arePiecesDraggable={false} />
          </ModalBody>
          <ChessFooter />
        </ModalContent>
        <ModalContent>
          <ModalContent>
            <ModalHeader textAlign={'center'}>Current Players</ModalHeader>
            <ModalBody textAlign={'center'}></ModalBody>
          </ModalContent>
        </ModalContent>
      </ModalContent>
    );
  }

  function ChessFooter() {
    return (
      <ModalFooter display='flex' flexDirection={'column'} padding={1}>
        <ModalFooter justifyItems={'center'}>
          <Button size='sm' marginRight={5}>
            Play an AI
          </Button>
          <Button size='sm' marginRight={5}>
            Play a Human
          </Button>
          <Button size='sm'>Leaderboard</Button>
        </ModalFooter>
        <ModalFooter alignSelf={'end'}>
          <Button
            size='sm'
            colorScheme='red'
            onClick={() => {
              closeModal();
              setUI('General');
            }}>
            Leave
          </Button>
        </ModalFooter>
      </ModalFooter>
    );
  }

  const createGame = useCallback(async () => {
    if (chosenGame && newGame) {
      const gameToCreate: GameArea = {
        chosenGame,
        id: newGame.name,
        occupantsByID: [],
      };
      try {
        await coveyTownController.createGameArea(gameToCreate);
        toast({
          title: 'Game Created!',
          status: 'success',
        });
        setUI(chosenGame);
        setGame('a Game');
        setChosenGame('');
      } catch (err) {
        if (err instanceof Error) {
          toast({
            title: 'Unable to create game',
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
  }, [chosenGame, setChosenGame, coveyTownController, newGame, closeModal, toast]);

  function GameContent() {
    if (currentUI == 'General') {
      return (
        <>
          <ModalHeader>Create a game in {newGame?.name}</ModalHeader>
          <ModalCloseButton />
          <form
            onSubmit={ev => {
              ev.preventDefault();
              createGame();
            }}>
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel htmlFor='game'>Choose a Game to Play</FormLabel>
                <Select
                  isRequired={true}
                  placeholder='Choose game...'
                  id='game'
                  name='game'
                  value={chosenGame}
                  onChange={e => {
                    setChosenGame(e.target.value);
                    if (e.target.value) setGame(e.target.value);
                    else setGame(' a Game');
                  }}>
                  <option>Chess</option>
                </Select>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={createGame}>
                Play {game}
              </Button>
              <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
          </form>
        </>
      );
    } else {
      return ChessContent();
    }
  }

  return (
    <Modal
      id='chessUI'
      isOpen={isOpen}
      onClose={() => {
        closeModal();
        coveyTownController.unPause();
      }}>
      <ModalOverlay />
      <ModalContent>
        <GameContent />
      </ModalContent>
    </Modal>
  );
}
