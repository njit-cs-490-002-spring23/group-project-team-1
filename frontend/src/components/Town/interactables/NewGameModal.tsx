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
import React, { useCallback, useEffect, useState } from 'react';
import { useInteractable } from '../../../classes/TownController';
import { GameArea } from '../../../generated/client';
import useTownController from '../../../hooks/useTownController';

export default function NewGameModal(): JSX.Element {
  const coveyTownController = useTownController();
  const newGame = useInteractable('gameArea');
  const [chosenGame, setChosenGame] = useState<string>('');

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
      coveyTownController.interactEnd(newGame);
    }
  }, [coveyTownController, newGame]);

  const toast = useToast();

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
        setChosenGame('');
        coveyTownController.unPause();
        closeModal();
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        closeModal();
        coveyTownController.unPause();
      }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a game in {newGame?.name} </ModalHeader>
        <ModalCloseButton />
        <form
          onSubmit={ev => {
            ev.preventDefault();
            createGame();
          }}>
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel htmlFor='topic'>Choose Game</FormLabel>
              <Input
                id='topic'
                placeholder='Choose the game you want to play'
                name='game'
                value={chosenGame}
                onChange={e => setChosenGame(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={createGame}>
              Create
            </Button>
            <Button onClick={closeModal}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
