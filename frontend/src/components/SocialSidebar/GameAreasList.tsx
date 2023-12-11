import { Box, Heading, ListItem, UnorderedList } from '@chakra-ui/react';
import React from 'react';
import GameAreaController, {
  useGameAreaOccupants,
  useGameAreaChosenGame,
} from '../../classes/GameAreaController';
import { useActiveGameAreas } from '../../classes/TownController';
import PlayerName from './PlayerName';

type GameAreaViewProps = {
  area: GameAreaController;
};

/**
 * Displays a list of "active" conversation areas, along with their occupants
 *
 * A conversation area is "active" if its topic is not set to the constant NO_TOPIC_STRING that is exported from the ConverationArea file
 *
 * If there are active areas, it sorts them by label ascending
 *
 * See relevant hooks: useConversationAreas, usePlayersInTown.
 */
function GameAreaView({ area }: GameAreaViewProps): JSX.Element {
  const occupants = useGameAreaOccupants(area);
  const topic = useGameAreaChosenGame(area);

  return (
    <Box>
      <Heading as='h3' fontSize='m'>
        {area.id}: {topic}
      </Heading>
      <UnorderedList>
        {occupants.map(occupant => {
          return (
            <ListItem key={occupant.id}>
              <PlayerName player={occupant} />
            </ListItem>
          );
        })}
      </UnorderedList>
    </Box>
  );
}
export default function GameAreasList(): JSX.Element {
  const activeGameAreas = useActiveGameAreas();
  return (
    <Box>
      <Heading as='h2' fontSize='l'>
        Active Game Areas:
      </Heading>
      {activeGameAreas.length === 0 ? (
        <>No active game areas</>
      ) : (
        activeGameAreas
          .sort((a1, a2) =>
            a1.id.localeCompare(a2.id, undefined, { numeric: true, sensitivity: 'base' }),
          )
          .map(area => <GameAreaView area={area} key={area.id} />)
      )}
    </Box>
  );
}
