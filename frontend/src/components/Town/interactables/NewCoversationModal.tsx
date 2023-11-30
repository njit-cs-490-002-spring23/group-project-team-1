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

export default function NewConversationModal(): JSX.Element {
  const coveyTownController = useTownController();
  const newConversation = useInteractable('conversationArea');
  const [topic, setTopic] = useState<string>('');

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

  const currentleaderboard = {
    'ahmed': 2000,
    'deepblue': 300,
    'roblox': 3405,
    'roblox lover': 1000,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        closeModal();
        coveyTownController.unPause();
      }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{newConversation?.name} </ModalHeader>
        <ModalCloseButton />
        <form
          onSubmit={ev => {
            ev.preventDefault();
            createConversation();
          }}>
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel htmlFor='topic'>Top 10 Chess Users</FormLabel>
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
            </FormControl>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
