import { Table, Tbody, Td, Thead, Tr } from '@chakra-ui/react';
import React from 'react';
// import { GameResult } from '../../../types/CoveyTownSocket';
import MatchResult from '../../../../../townService/src/town/chess/database/elo';
//very basic leaderboard will continue to update

export default function Leaderboard({ results }: { results: GameResult[] }): JSX.Element {
  // get players for update leaderbaord
  const currentplayers = [];
  results.forEach(result => {
    for (const [playerName] of Object.entries(result.scores)) {
      currentplayers.push(playerName);
    }
  });
  //   MatchResult.updateElo(currentplayers[0],currentplayers[1], results) //update elo from elo.ts with current players
  // take leaderboard map
  const currentleaderboard: { [username: string]: any } = MatchResult.leaderboardElo();
  //display name: elo
  return (
    <table role='grid'>
      <thead>
        <tr role='row'>
          <th>Player</th>
          <th>Elo</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(currentleaderboard).map(([playerName, elo]) => (
          <tr role='row' key={playerName}>
            <td role='gridcell'>{playerName}</td>
            <td role='gridcell'>{elo}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

