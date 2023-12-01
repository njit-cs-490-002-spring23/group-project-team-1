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
import { ConversationArea } from '../../../generated/client';
import useTownController from '../../../hooks/useTownController';
import Time from './time'; //
import { Chessboard } from 'react-chessboard'; //https://medium.com/@ryangregorydev/creating-a-chessboard-app-in-react-3fd9e2b2f6a6
// import chess from 'chess.js';
import chessboard from 'chessboardjsx'; // npm install --save chessboardjsx chess.js
// import Database from '../../../../../townService/src/town/chess/database/database';
import Database from '../../../../../townService/src/town/chess/database/database';

export default function NewConversationModal(): Promise<JSX.Element> {
  // const currentleaderboard: { [username: string]: any } = leaderboardElo;
  const coveyTownController = useTownController();
  const newConversation = useInteractable('conversationArea');
  const [topic, setTopic] = useState<string>('');
  const [showTimer, setShowTimer] = useState(false);
  const [showChess, setShowChess] = useState(false);
  const [currentleaderboard, setLeaderboard] = useState({});

  //const db = new Database();
  //const currentleaderboard = db.db_getAllELO();

  const isOpen = newConversation !== undefined;

  useEffect(() => {
    if (newConversation) {
      coveyTownController.pause();
    } else {
      coveyTownController.unPause();
    }
  }, [coveyTownController, newConversation]);

  useEffect(() => {
    fetch('http://localhost:3001/leaderboard', {
      method: 'GET',
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data);
        setLeaderboard(data);
      });
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
        topic,
        id: newConversation.name,
        occupantsByID: [],
      };
      try {
        await coveyTownController.createConversationArea(conversationToCreate);
        toast({
          title: 'Conversation Created!',
          status: 'success',
        });
        setTopic('');
        coveyTownController.unPause();
        closeModal();
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        closeModal();
        coveyTownController.unPause();
      }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> LeaderBaord </ModalHeader>
        <ModalCloseButton />
        <table>
          <tr>
            <th>Username </th>
            <th> Elo</th>
          </tr>
          {Object.entries(currentleaderboard).map(([playerName, elo]) => (
            <tr role='row' key={playerName}>
              <td role='gridcell'>{playerName}</td>
              <td role='gridcell'>{elo}</td>
            </tr>
          ))}
        </table>
        <Button onClick={() => setShowTimer(!showTimer)}>Toggle Timer</Button>
        {showTimer && <Time />}
        <Button onClick={() => setShowChess(!showChess)}>Toggle chess</Button>
        <Chessboard position={'start'} />;
      </ModalContent>
    </Modal>
  );
}
